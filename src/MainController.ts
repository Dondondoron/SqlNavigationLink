

import * as vscode from "vscode";
import * as path from "path";

import { PathObject, PathTreeDataProvider } from "./pathProvider";
import { SqlModelProvider } from "./modelProvider";
import { PythonConfig } from "./Settings";
import { logInformation } from "./logging";
import { ControlPanelProvider } from "./planController";
import { LineagePanelProvider } from "./lineage/lineagePanelProvider";


export class MainController {
    commandParseController!: vscode.Disposable;


    pathProvider: PathTreeDataProvider
    sqlModelProvider: SqlModelProvider;
    planController: ControlPanelProvider
    lineagePanelProvider: LineagePanelProvider

    constructor(context: vscode.ExtensionContext) {

        const defaultPaths: PathObject[] = (vscode.workspace.workspaceFolders ?? []).map(folder => {
            folder.uri.fsPath

            const label = folder.uri.fsPath.split('/').pop()
            return {
                id: folder.uri.fsPath ?? '',
                label: label ?? '',
                filePath: folder.uri.fsPath
            };
        })

        this.pathProvider = new PathTreeDataProvider(defaultPaths);
        this.sqlModelProvider = new SqlModelProvider()
        this.lineagePanelProvider = new LineagePanelProvider(context.extensionUri, this.sqlModelProvider)
        this.planController = new ControlPanelProvider(context)


    }

    fileOpenListener() {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if(!editor) return
            
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
            const model = Array.from(this.sqlModelProvider.models).find(m=> m[1].name === modelName)
            if(!model){
                vscode.window.showErrorMessage('No model with name '+ modelName + ' found');
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
            async () => {


                const sqlPaths: string[] = this.pathProvider.getPaths().length > 0
                    ? this.pathProvider.getPaths().map(m => m.filePath)
                    : (vscode.workspace.workspaceFolders ?? []).map(folder => folder.uri.fsPath);

                const models = await this.sqlModelProvider.getPythonParsePromise(sqlPaths, context);

                if (models) this.sqlModelProvider.initModels(models);

            }
        )
    }


    onChangeSettingsCommand() {
        return vscode.workspace.onDidChangeConfiguration(async event => {
            // Check if the specific setting (or whole section) was affected
            if (event.affectsConfiguration('Dondondoron.sql-nav-link.pythonPath')) {

                // Read the updated value
                const updatedPythonPath = vscode.workspace
                    .getConfiguration('Dondondoron.sql-nav-link')
                    .get<string>('pythonPath');

                console.log('Python path changed to:', updatedPythonPath);
                vscode.window.showInformationMessage(`Updated Python Path: ${updatedPythonPath}`);

                if (updatedPythonPath) PythonConfig.pythonPath = updatedPythonPath
                // Re-initialize or handle your Python execution logic here...
            }
        })
    }





}


