import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PathObject, SqlType } from '../pathClasses';
import { PythonSupplier } from '../pythonSupplier';
import { logInformation } from '../logging';


export class ParseViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    currentUri?: vscode.Uri

    pathObjects: PathObject[] = [];

    pythonSupplier: PythonSupplier


    constructor(
        pythonSupplier: PythonSupplier,
        private readonly _extensionUri: vscode.Uri,
        initialPaths?: PathObject[]
    ) {
        this.pythonSupplier = pythonSupplier
        if (initialPaths) {
            this.pathObjects = initialPaths;
        }

    }

    public async resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;


        webviewView.webview.onDidReceiveMessage(async data => {

            switch (data.command) {
                case "addPath":
                    await vscode.commands.executeCommand('sql-nav-link.addPath')
                    break;
                case "parsePaths":
                    vscode.commands.executeCommand('sql-nav-link.parsePaths')
                    break;
                case "removePath":
                    await this.removePathCommand(data.args[0])
                    break;
                case "changePathType":
                    await this.changePathTypeCommand(data.args[0])
                    break;
                case "changeSelectedEnv":
                    this.pythonSupplier.selectedEnvPath = data.args[0]
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

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        this.updatePaths()

        await this.pythonSupplier.init()

        const autoLoadContext = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('autoContext', false);


        if (autoLoadContext) this.refreshAutoContext()

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

    updatePaths() {
        if (!this._view) {
            return;
        }
        this._view.webview.postMessage({
            command: 'updatePaths',
            data: this.pathObjects
        });
    }

    async refreshPython() {
        if (!this._view) {
            return;
        }

        logInformation('Getting available python packages')

        await Promise.all([...this.pythonSupplier.pythonVenvs.map(e => e.getPackages())])

        const envs = this.pythonSupplier.pythonVenvs

        if (!this.pythonSupplier.selectedEnvPath && envs.length > 0) this.pythonSupplier.selectedEnvPath = envs[0].path

        this._view.webview.postMessage({
            command: 'refreshPython',
            data: envs,
            selectedEnv: this.pythonSupplier.selectedEnvPath
        });
    }


    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Convert local file paths into Webview URIs
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'webviewParsing', 'styles.css')
        );
        let jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'webviewParsing', 'config.js')
        );

        // Read HTML template from disk
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'webviewParsing', 'index.html');
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
                    canSelectFiles: true,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Path'
                });

                if (!fileUris || fileUris.length === 0) {
                    return;
                }

                const selectedUri = fileUris[0];

                /*
                // Option B: Prompt for a custom label/name using standard InputBox
                const label = await vscode.window.showInputBox({
                    prompt: 'Enter a name/label for this path',
                    placeHolder: 'e.g., Input Dataset, Script Entry',
                    value: selectedUri.path.split('/').pop()
                });

                if (!label) {
                    return;
                }
                    */

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
        }
    }
}