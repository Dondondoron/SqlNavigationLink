import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PathObject, SqlType } from '../pathClasses';
import { PythonSupplier } from '../pythonSupplier';
import { logInformation } from '../logging';


export interface GenericContext {
    type: string;
    rootPath: string
}

export interface SQLMeshContext extends GenericContext {
    configPaths?: Set<string>
}
export interface DBTContext extends GenericContext {
}

export class ParseViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    currentUri?: vscode.Uri

    pathObjects: PathObject[] = [];

    contextItems: SQLMeshContext[] = [];

    pythonSupplier: PythonSupplier


    constructor(
        pythonSupplier: PythonSupplier,
        private context: vscode.ExtensionContext,
    ) {
        this.pythonSupplier = pythonSupplier


        const rawContexts = this.context.globalState.get<any[]>(
            'sql-nav-link-' + vscode.workspace.name + '-contexts'
        ) ?? [];

        this.contextItems = rawContexts.map(item => ({
            ...item,
            configPaths: new Set(item.configPaths ?? [])
        }));

    }


    public async resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;


        webviewView.webview.onDidReceiveMessage(async data => {

            switch (data.command) {
                case "addPath":
                    vscode.commands.executeCommand('sql-nav-link.parsePaths', data.args[0])




                    break;
                case "requestRootPath":
                    const fileUris = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'Select Path'
                    });

                    if (!fileUris || fileUris.length === 0) {
                        return;
                    }

                    const selectedUri = fileUris[0];

                    const dataType = data.args[0];

                    const configPaths: Set<string> = new Set()

                    const contextObject = { type: dataType, rootPath: selectedUri.fsPath, configPaths: configPaths }

                    this.contextItems.push(contextObject)

                    this.refreshContexts()

                    break;
                case "addConfigPath":
                    const fileUriss = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'Select Path'
                    });

                    if (!fileUriss || fileUriss.length === 0) {
                        return;
                    }

                    const selectedUriConfig = fileUriss[0];

                    const contextItem = this.contextItems.find(item => item.rootPath === data.args[0] && item.type === "SQLMESH") as SQLMeshContext

                    if (contextItem.configPaths) {
                        contextItem.configPaths.add(selectedUriConfig.fsPath)
                    } else {
                        contextItem.configPaths = new Set([selectedUriConfig.fsPath])
                    }

                    this.refreshContexts()

                    break;
                case "parsePath":
                    vscode.commands.executeCommand('sql-nav-link.parsePaths', data.args[0])
                    break;
                case "removeContext":
                    const contextIndex = this.contextItems.findIndex(item => item.rootPath === data.args[0])

                    this.contextItems.splice(contextIndex, 1)

                    this.refreshContexts()

                    break;
                case "removePath":
                    await this.removePathCommand(data.args[0])
                    break;
                case "removeConfigPath":
                    const path = data.args[0]
                    const rootPath = data.args[1]

                    const contextItemm = this.contextItems.find(item => item.rootPath === rootPath) as SQLMeshContext

                    contextItemm.configPaths?.delete(path)

                    this.refreshContexts()

                    break;
                case "changePathType":
                    await this.changePathTypeCommand(data.args[0])
                    break;
                case "changeSelectedEnv":
                    this.pythonSupplier.setCurrentPythonEnv(data.args[0])
                    break;
                case "selectPythonEnv":
                    await this.pythonSupplier.setNewConfigPythonEnv()
                    break;
                case "refreshPythonEnv":
                    await this.refreshPython()
                    break;
                case "autoContext":
                    const checkboxValue = Boolean(data.args[0]);

                    const config = vscode.workspace.getConfiguration('Dondondoron.sql-nav-link');

                    await config.update(
                        'autoContext',
                        checkboxValue,
                        vscode.ConfigurationTarget.Global
                    );
                    break;
            }
        });

        webviewView.onDidChangeVisibility((e) => {
            if (webviewView.visible) {

                this.updatePaths()
                this.updatePython()
                this.refreshAutoContext()


            }
        })

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);


        this.updatePaths()
        this.refreshContexts()
        this.updatePython()
        this.refreshAutoContext()

    }

    refreshAutoContext() {
        const autoLoadContext = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('autoContext', false);


        if (!this._view) {
            return;
        }
        this._view.webview.postMessage({
            command: 'setAutoLoadCheckBox',
            data: autoLoadContext
        });

    }

    getSafeContext() {
        return this.contextItems.map(item => ({
            ...item,
            configPaths: item.configPaths ? Array.from(item.configPaths) : []
        }))
    }


    refreshContexts() {
        if (!this._view) {
            return;
        }

        const safeContextItems = this.getSafeContext()

        
        this.saveContexts(safeContextItems)

        this._view.webview.postMessage({
            command: 'updateContexts',
            data: safeContextItems
        });
    }
    updatePaths() {
        if (!this._view) {
            return;
        }
        this._view.webview.postMessage({
            command: 'updatePaths',
            data: this.pathObjects
        });
    }
    updatePython() {
        if (this._view)
            this._view.webview.postMessage({
                command: 'refreshPython',
                data: this.pythonSupplier.pythonVenvs,
                selectedEnv: this.pythonSupplier.selectedEnvPath
            });
    }


    async refreshPython() {
        if (!this._view) {
            return;
        }
        await this.pythonSupplier.refreshPython()
        this.updatePython()
    }



    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Convert local file paths into Webview URIs
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'contextViewer', 'index.css')
        );
        let jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'contextViewer', 'index.js')
        );

        // Read HTML template from disk
        const htmlPath = path.join(this.context.extensionUri.fsPath, 'media', 'contextViewer', 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Replace placeholders with real URIs
        return htmlContent
            .replace('{{cssUri}}', cssUri.toString())
            .replace('{{jsUri}}', jsUri.toString());
    }

    addPathCommand() {
        return vscode.commands.registerCommand(
            'sql-nav-link.addPath',
            async () => {
                // Option A: Open native File/Folder picker
                const fileUris = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Path'
                });

                if (!fileUris || fileUris.length === 0) {
                    return;
                }

                const selectedUri = fileUris[0];


                const type = await vscode.window.showQuickPick(
                    [
                        SqlType.DBT,
                        SqlType.SQLMESH
                    ],
                    {
                        title: 'Select SQL Type', // Title shown above the quick pick input
                        placeHolder: 'e.g., Select DBT or SQLMESH'
                    }
                );

                if (!type) return

                const newPathObj: PathObject = {
                    id: Date.now().toString(),
                    label: selectedUri.fsPath,
                    filePath: selectedUri.fsPath,
                    type: type as SqlType
                };

                this.pathObjects.push(newPathObj)

                this.updatePaths()
                this.savePaths()
            }
        )
    }


    async removePathCommand(arg: any) {

        const confirm = await vscode.window.showQuickPick(
            [
                'Yes',
                'No'
            ],
            {
                title: `Remove Path of ${arg}`,
                placeHolder: `Remove Path of ${arg}`

            }
        );
        if (confirm === 'Yes') {
            for (let i = this.pathObjects.length - 1; i >= 0; i--) {
                if (this.pathObjects[i].filePath === arg) {
                    this.pathObjects.splice(i, 1);
                }
            }
            this.updatePaths()
            this.savePaths()
        }
    }
    async changePathTypeCommand(arg: any) {
        const node = this.pathObjects.find(path => path.filePath === arg)
        if (node) {
            const type = await vscode.window.showQuickPick(
                [
                    SqlType.DBT,
                    SqlType.SQLMESH
                ],
                {
                    title: 'Select SQL Type',
                    placeHolder: 'e.g., Select DBT or SQLMESH'
                }
            );

            if (!type) return

            node.type = type as SqlType


            this.updatePaths()

            this.savePaths()
        }
    }

    async savePaths() {
        this.context.globalState.update('sql-nav-link-' + vscode.workspace.name + 'paths', this.pathObjects);
    }
    saveContexts(safeContexts: any) {
        this.context.globalState.update('sql-nav-link-' + vscode.workspace.name + '-contexts', safeContexts);
    }
}