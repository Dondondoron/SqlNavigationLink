import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { SqlModelProvider } from '../modelProvider';

export class LineagePanelProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private modelProvider: SqlModelProvider
    ) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;


        webviewView.webview.onDidReceiveMessage(data => {

            switch(data.command){
                case "browse":
                    vscode.commands.executeCommand('sql-nav-link.openModel', data.args[0])
                break;
                case "increase":
                    vscode.commands.executeCommand('sql-nav-link.openModel', data.args[0])
                break;
                case "decrease":
                    vscode.commands.executeCommand('sql-nav-link.openModel', data.args[0])
                break;
            }

            

        });

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    public openedSqlFile(uri: vscode.Uri) {
        if (!this._view) {
            return;
        }

        const allModels = this.modelProvider.models;
        const model = allModels.get(uri.fsPath);

        if (!model) {
            return;
        }

        // Left refs (Upstream dependencies)
        const leftRefs = (model.table_names || []).map(t => t);

        // Right refs (Downstream dependents)
        const rightRefs = Array.from(allModels.values())
            .filter(m => m.table_names?.some(t => t.fullname === model.name))



        // Post message to the client side JS inside the webview
        this._view.webview.postMessage({
            command: 'updateLineage',
            data: {
                centerModel: model,
                leftRefs,
                rightRefs
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Convert local file paths into Webview URIs
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'lineage.css')
        );
        const jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'lineage.js')
        );

        // Read HTML template from disk
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'lineage.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Replace placeholders with real URIs
        return htmlContent
            .replace('{{cssUri}}', cssUri.toString())
            .replace('{{jsUri}}', jsUri.toString());
    }
}