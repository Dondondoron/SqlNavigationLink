

import * as vscode from "vscode";

import { PathObject, SqlType } from "./pathClasses";
import { SqlModelProvider } from "./modelProvider";
import { LineagePanelProvider } from "./lineage/lineagePanelProvider";
import { GenericContext, ParseViewProvider } from "./parsing/parsingProvider";
import { PythonSupplier } from "./pythonSupplier";
import { logError } from "./logging";
import { ModelLoader } from "./ModelLoader";


export class MainController {
    commandParseController!: vscode.Disposable;

    sqlModelProvider!: SqlModelProvider;
    parseView!: ParseViewProvider
    lineagePanelProvider!: LineagePanelProvider

    modelLoader!: ModelLoader
    pythonSupplier!: PythonSupplier


    constructor(context: vscode.ExtensionContext) {
        this.init(context)
    }
    private async init(context: vscode.ExtensionContext) {



        const autoLoadContext = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('autoContext', false);


        const savedCache = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('saveCache', false);


        this.pythonSupplier = new PythonSupplier(context)

        this.sqlModelProvider = new SqlModelProvider(context)
        this.modelLoader = new ModelLoader(context, this.sqlModelProvider)
        this.parseView = new ParseViewProvider(this.pythonSupplier, context)
        this.lineagePanelProvider = new LineagePanelProvider(context.extensionUri, this.sqlModelProvider)
        await this.pythonSupplier.init()


        if (savedCache) {
            this.modelLoader.loadAllCache(this.parseView.pathObjects.map(p => p.filePath))
            this.parseView.refreshSaveCache()

        }
        else if (autoLoadContext) {
            this.parseView.refreshAutoContext()

            await Promise.all(this.parseView.pathObjects.map(m => this.parse(m.filePath)))
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

            const modelPath = this.sqlModelProvider.modelToPath.get(modelName)
            if (!modelPath) {
                vscode.window.showErrorMessage('No model with name ' + modelName + ' found');
                return;
            }
            try {

                const uri = vscode.Uri.file(modelPath);

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

    parseCommand() {
        return vscode.commands.registerCommand(
            'sql-nav-link.parsePaths',
            async (arg: any) => {
                this.parse(arg)
            }
        )
    }

    private async parse(path: any) {

        const targetContext = this.parseView.contextItems.find(m => path === m.rootPath)

        const pythonEnv = this.pythonSupplier.getCurrenPythonEnv()

        if (!targetContext) {
            logError('Unable to find Context Path for parsing')
            return
        }
        if (!pythonEnv) {
            logError('Unable to find python environment executable for parsing')
            return
        }

        const models = await this.modelLoader.getPythonParsePromise(
            pythonEnv.pythonExecutable,
            targetContext.rootPath,
            targetContext.type,
            targetContext.configPaths && targetContext.configPaths.size > 0 ? Array.from(targetContext.configPaths) : [targetContext.rootPath]);

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
            else if (event.affectsConfiguration('Dondondoron.sql-nav-link.saveCache')) {
                this.parseView.refreshSaveCache()
            }
        })
    }





}


