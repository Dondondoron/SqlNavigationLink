

import * as vscode from "vscode";

import { PathObject, SqlType } from "./pathClasses";
import { SqlModelProvider } from "./modelProvider";
import { LineagePanelProvider } from "./lineage/lineagePanelProvider";
import { ParseViewProvider } from "./parsing/parsingProvider";
import { PythonSupplier } from "./pythonSupplier";
import { logError } from "./logging";


export class MainController {
    commandParseController!: vscode.Disposable;

    sqlModelProvider!: SqlModelProvider;
    parseView!: ParseViewProvider
    lineagePanelProvider!: LineagePanelProvider

    pythonSupplier!: PythonSupplier


    constructor(context: vscode.ExtensionContext) {
        this.init(context)
    }
    private async init(context: vscode.ExtensionContext) {

        const savedPaths = context.globalState.get<PathObject[]>('sql-nav-link-' + vscode.workspace.name + 'paths')

        const defaultPaths: PathObject[] = savedPaths ?? (vscode.workspace.workspaceFolders ?? []).map(folder => {
            folder.uri.fsPath

            const label = folder.uri.fsPath.split('/').pop()
            return {
                id: folder.uri.fsPath ?? '',
                label: label ?? '',
                filePath: folder.uri.fsPath,
                type: SqlType.DBT
            };
        })

        
        const autoLoadContext = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('autoContext', false);


        const savedCache = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('saveCache', false);


        this.pythonSupplier = new PythonSupplier(context)

        this.sqlModelProvider = new SqlModelProvider(context)
        this.parseView = new ParseViewProvider(this.pythonSupplier, context, defaultPaths)
        this.lineagePanelProvider = new LineagePanelProvider(context.extensionUri, this.sqlModelProvider)
        await this.pythonSupplier.init()


        if (savedCache) {
            this.sqlModelProvider.loadAllCache(this.parseView.pathObjects.map(p=>p.filePath))

        }
        else if (autoLoadContext) {
            this.parseView.refreshAutoContext()
        
            await Promise.all(this.parseView.pathObjects.map(m => this.parse(context, m.filePath)))
        }

        this.lineagePanelProvider.init()

    }


    fileOpenListener() {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (!editor) return

            const document = editor.document
            // Example: Ignore non-file schemes (like output panels, webviews, git views, etc.)
            if (document.uri.scheme !== 'file' || !document.fileName.endsWith('.sql')) {
                return;
            }

            console.log(`File opened: ${document.fileName}`);
            console.log(`Language: ${document.languageId}`);

            // Show a quick notification message (optional)
            vscode.window.showInformationMessage(`Opened: ${document.fileName}`);

            this.lineagePanelProvider.openedSqlFile(document.uri)
        });
    }

    openModelCommand() {

        return vscode.commands.registerCommand('sql-nav-link.openModel', async (modelName: string) => {
            if (!modelName) {
                vscode.window.showErrorMessage('No model name provided to open.');
                return;
            }
            const normalizedModelName = modelName.replaceAll('"', '')
            const model = Array.from(this.sqlModelProvider.models).find(m => m[1].name.replaceAll('"', '') === normalizedModelName)
            if (!model) {
                vscode.window.showErrorMessage('No model with name ' + modelName + ' found');
                return;
            }
            try {

                const uri = vscode.Uri.file(model[0]);

                // 2. Open the document and show it in the editor
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, { preview: true });

                vscode.window.showInformationMessage(`Opened: ${uri.path}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to open path: ${error}`);
            }

        })
    }

    openPathCommand() {

        return vscode.commands.registerCommand('sql-nav-link.openPath', async (path: string) => {
            if (!path || !path[0]) {
                vscode.window.showErrorMessage('No path provided to open.');
                return;
            }
            try {
                const uri = vscode.Uri.file(path);

                // 2. Open the document and show it in the editor
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, { preview: true });

                vscode.window.showInformationMessage(`Opened: ${path}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to open path: ${error}`);
            }

        })
    }

    parseCommand(context: vscode.ExtensionContext) {
        return vscode.commands.registerCommand(
            'sql-nav-link.parsePaths',
            async (arg:any) => {
                this.parse(context, arg)
            }
        )
    }

    private async parse(context: vscode.ExtensionContext, path:any) {
        const pathArguments: any[] = [path]

        const targetPath = this.parseView.pathObjects.find(m => path === m.filePath)

        const pythonEnv = this.pythonSupplier.getCurrenPythonEnv()

        if (!targetPath) {
            logError('Unable to find Path for parsing')
            return
        }
        if (!pythonEnv) {
            logError('Unable to find python environment executable for parsing')
            return
        }

        const models = await this.sqlModelProvider.getPythonParsePromise(pythonEnv.pythonExecutable, targetPath.filePath, targetPath.type, context);

        if (models) this.sqlModelProvider.initModels(models);
    }

    updatePythonEnvironmentCommand() {
        return vscode.commands.registerCommand(
            'sql-nav-link.pythonRefresh',
            async () => {
                this.parseView.refreshPython()
            }
        )
    }


    onChangeSettingsCommand() {
        return vscode.workspace.onDidChangeConfiguration(async event => {
            if (event.affectsConfiguration('Dondondoron.sql-nav-link.pythonPath')) {
                await this.pythonSupplier.getConfigEnv()
                this.parseView.refreshPython()
            }
            else if (event.affectsConfiguration('Dondondoron.sql-nav-link.autoContext')) {
                this.parseView.refreshAutoContext()
            }
        })
    }





}


