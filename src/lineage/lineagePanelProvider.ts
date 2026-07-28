import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { SqlModelInfo, SqlModelProvider, TableInfo } from '../modelProvider';

interface ModelLineage {
    model: SqlModelInfo | TableInfo
    refs?: ModelLineage[]
    fields?: string[]
}

export class LineagePanelProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    currentUri?: vscode.Uri
    currentLeftDepth: number = 3
    currentRightDepth: number = 2

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private modelProvider: SqlModelProvider
    ) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;


        webviewView.webview.onDidReceiveMessage(data => {

            switch (data.command) {
                case "browse":
                    vscode.commands.executeCommand('sql-nav-link.openModel', data.args[0])
                    break;
                case "left-increase":
                    if (this.currentLeftDepth < 12) this.currentLeftDepth++;
                    else return
                    if (this.currentUri) this.openedSqlFile(this.currentUri)
                    break;
                case "left-decrease":
                    if (this.currentLeftDepth > 1) this.currentLeftDepth--;
                    else return
                    if (this.currentUri) this.openedSqlFile(this.currentUri)
                    break;
                case "right-increase":
                    if (this.currentRightDepth < 12) this.currentRightDepth++;
                    else return
                    if (this.currentUri) this.openedSqlFile(this.currentUri)
                    break;
                case "right-decrease":
                    if (this.currentRightDepth > 1) this.currentRightDepth--;
                    else return
                    if (this.currentUri) this.openedSqlFile(this.currentUri)
                    break;
            }
        });

        webviewView.onDidChangeVisibility(()=>{
            if(webviewView.visible && this.currentUri){
                this.openedSqlFile(this.currentUri)
            }
        })

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
        const arrayedModels = Array.from(allModels.values())
        const model = allModels.get(uri.fsPath);

        if (!model) {
            return;
        }

        this.currentUri = uri

        function loopModelToRefLeftSide(model: SqlModelInfo, maxLoops: number, currentDepth: number = 2): ModelLineage[] {
            return model.table_names.map(l => {
                const out = arrayedModels.find(m => m.name === l.fullname) ?? l;
                const isSqlModel = out instanceof SqlModelInfo;

                // Only recurse deeper if we haven't hit maxLoops yet
                const canGoDeeper = isSqlModel && currentDepth < maxLoops;

                return {
                    model: out,
                    // Depth 2 items get refs: [] when maxLoops = 2
                    refs: canGoDeeper ? loopModelToRefLeftSide(out, maxLoops, currentDepth + 1) : [],
                    fields: l.fields
                };
            });
        }

        const leftRefs = (model.table_names || []).map(t => t)
            .map(ti => {
                const nextModel = arrayedModels.find(m => m.name === ti.fullname) ?? ti
                return {
                    model: nextModel,
                    refs: nextModel instanceof SqlModelInfo && this.currentLeftDepth > 1 ? loopModelToRefLeftSide(nextModel, this.currentLeftDepth) : [],
                    fields: ti.fields
                }
            });




        function loopModelToRefRightSide(currentModel: SqlModelInfo, maxLoops: number, currentDepth: number = 2): ModelLineage[] {
            // Find all models that depend on currentModel
            const downstreamModels = arrayedModels.filter(m =>
                m.table_names?.some(t => t.fullname === currentModel.name)
            );

            return downstreamModels.map(m => {
                // Find matching field metadata from downstream model's table_names entry
                const matchingTable = m.table_names?.find(t => t.fullname === currentModel.name);

                const canGoDeeper = currentDepth < maxLoops;

                return {
                    model: m,
                    refs: canGoDeeper ? loopModelToRefRightSide(m, maxLoops, currentDepth + 1) : [],
                    fields: matchingTable?.fields
                };
            });
        }

        // Right refs invocation (Downstream dependents)
        const rightRefs = arrayedModels
            .filter(m => m.table_names?.some(t => t.fullname === model.name))
            .map(m => {
                const matchingTable = m.table_names?.find(t => t.fullname === model.name);
                return {
                    model: m,
                    refs: this.currentRightDepth > 1 ? loopModelToRefRightSide(m, this.currentRightDepth) : [],
                    fields: matchingTable?.fields
                };
            });

        // Post message to the client side JS inside the webview
        this._view.webview.postMessage({
            command: 'renderLineage',
            data: {
                centerModel: { model: model, refs: [] },
                leftRefs,
                rightRefs,
                size_left: this.currentLeftDepth.toString(),
                size_right: this.currentRightDepth.toString()
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Convert local file paths into Webview URIs
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'webviewLineage','lineage.css')
        );
        const jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'webviewLineage', 'lineage.js')
        );

        // Read HTML template from disk
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'webviewLineage', 'lineage.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Replace placeholders with real URIs
        return htmlContent
            .replace('{{cssUri}}', cssUri.toString())
            .replace('{{jsUri}}', jsUri.toString());
    }
}