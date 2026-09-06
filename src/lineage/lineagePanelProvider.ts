import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { SqlModelInfoTree, SqlModelProvider } from '../modelProvider';
import { Column, LineageInfo, ModelLineage, SqlModelInfo } from '../domain/domain';



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

        webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible && this.currentUri) {
                this.openedSqlFile(this.currentUri)
            }
        })

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    public init() {

        const openDocument = vscode.window.activeTextEditor?.document
        if (openDocument) this.openedSqlFile(openDocument.uri)
    }



    public openedSqlFile(uri: vscode.Uri) {
        if (!this._view) {
            return;
        }

        const allModels = this.modelProvider.models;
        const arrayedModels = Array.from(allModels.values())
        const models = this.modelProvider.pathToModel.get(uri.fsPath);

        if (!models || models.size === 0) {
            return;
        }

        const model = Array.from(models)[0]

        this.currentUri = uri

        function getLeafs(column: Column, tables: Map<string, Column[]>) {

            if (column.refs.length > 0) {
                column.refs.forEach(ref => getLeafs(ref, tables))
            } else if(column.table){
                if (tables.has(column.table)) {
                    tables.get(column.table)?.push(column)
                }
                else tables.set(column.table, [column])
            }
            return tables
        }

        function loopModelToRefLeftSide(model: SqlModelInfoTree, maxLoops: number, currentDepth: number = 2): ModelLineage[] {
            const leafMap: Map<string, Column[]> = new Map();

            model.columns.forEach(m => {
                getLeafs(m, leafMap);
            });

            return Array.from(leafMap).map((t) => {
                const found = arrayedModels.find(m => m.name.replaceAll('"', '') === t[0].replaceAll('"', ''));

                const out = found ?? t;

                const isSqlModel = !Array.isArray(out);

                const canGoDeeper = isSqlModel && currentDepth < maxLoops;

                return {
                    model: isSqlModel
                        ? out
                        : { name: t[0], file_name: '', file_path: '', table_names: [], columns: t[1] },

                    refs: canGoDeeper ? loopModelToRefLeftSide(out as SqlModelInfoTree, maxLoops, currentDepth + 1) : [],

                    fields: isSqlModel ? (out as SqlModelInfoTree).columns.map(c => c.name) : t[1].map(c => c.name)
                };
            });
        }

        const leafMap: Map<string, Column[]> = new Map();

        model.columns.forEach(m => {
            getLeafs(m, leafMap);
        });


        const leftRefs = Array.from(leafMap)
            .map(ti => {
                const nextModel = arrayedModels.find(m => m.name.replaceAll('"', '') === ti[0].replaceAll('"', '')) ?? ti[0]
                const isSqlModel = nextModel instanceof SqlModelInfoTree;

                model.columns

                return {
                    model: isSqlModel ? nextModel : { name: nextModel, file_name: '', file_path: '', table_names: [], columns: ti[1] },
                    refs: nextModel instanceof SqlModelInfoTree && this.currentLeftDepth > 1 ? loopModelToRefLeftSide(nextModel, this.currentLeftDepth) : [],
                    fields: typeof nextModel === 'string' ? [] : nextModel.columns.map(c => c.name)
                }
            });




        function loopModelToRefRightSide(currentModel: SqlModelInfo, maxLoops: number, currentDepth: number = 2): ModelLineage[] {
            // Find all models that depend on currentModel
            const downstreamModels = arrayedModels.filter(m =>
                m.table_names?.some(t => t.replaceAll('"', '') === currentModel.name.replaceAll('"', ''))
            );

            return downstreamModels.map(m => {

                const canGoDeeper = currentDepth < maxLoops;

                return {
                    model: m,
                    refs: canGoDeeper ? loopModelToRefRightSide(m, maxLoops, currentDepth + 1) : [],
                    fields: m.columns.filter(c=> c.table !== m.name).map(c=>c.name)
                };
            });
        }

        // Right refs invocation (Downstream dependents)
        const rightRefs : ModelLineage[] = arrayedModels
            .filter(m => m.table_names?.some(t => t.replaceAll('"', '') === model.name.replaceAll('"', '')))
            .map(m => {
                return {
                    model: m,
                    refs: this.currentRightDepth > 1 ? loopModelToRefRightSide(m, this.currentRightDepth) : [],
                    fields: model.columns.filter(c=> c.table !== m.name).map(c=>c.name)
                        };
            });




        const centerModel: ModelLineage = {
            model: model,
            refs: leftRefs

        }


        const data: LineageInfo = {
            centerModel: centerModel,
            rightRefs: rightRefs,
            size_left: this.currentLeftDepth.toString(),
            size_right: this.currentRightDepth.toString()
        }


        // Post message to the client side JS inside the webview
        this._view.webview.postMessage({
            command: 'renderLineage',
            data: data
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Convert local file paths into Webview URIs
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'lineageViewer', 'index.css')
        );
        const jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'lineageViewer', 'index.js')
        );

        // Read HTML template from disk
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'lineageViewer', 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Replace placeholders with real URIs
        return htmlContent
            .replace('{{cssUri}}', cssUri.toString())
            .replace('{{jsUri}}', jsUri.toString());
    }
}