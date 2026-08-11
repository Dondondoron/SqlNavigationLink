
import * as vscode from "vscode";
import * as path from "path";
import * as os from 'os';
import * as fs from 'fs';

import { execFile } from "child_process";

import { logError, logInformation } from "./logging";


export interface TableInfo {
    fullname: string;
    name: string;
    db?: string;
    catalog?: string;
    alias?: string;
    fields: string[]
}

export class SqlModelInfo extends vscode.TreeItem {
    constructor(
        public name: string,
        public file_name: string,
        public file_path: string,
        public table_names: TableInfo[],
        public cte_names: TableInfo[],
        public columns: Record<string, string[]>,
        public cte_columns: Record<string, string[]>,
    ) {
        super(name, vscode.TreeItemCollapsibleState.Collapsed)

        this.command = {
            command: `sql-nav-link.openPath`,
            title: name,
            arguments: [file_path]
        }
    }
}


type SqlModelsResponse = Record<string, SqlModelInfo>;


export class SqlModelProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private treeItems: Map<string, vscode.TreeItem> = new Map()
    models: Map<string, SqlModelInfo> = new Map()


    private makeTreeItem(label: string, collapsed: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(label, collapsed)
        this.treeItems.set(label, treeItem)
        return treeItem
    }


    constructor() {

    }


    getTreeItem(element: SqlModelInfo): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }
    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        if (!element && this.models.size === 0) {
            return [this.makeTreeItem('No Context Initialized', vscode.TreeItemCollapsibleState.None)]
        }

        else if (!element) {
            const arrayModels = Array.from(this.models.values())
            return arrayModels
        }


    }

    initModels(models: SqlModelsResponse) {

        this.models = new Map(Object.entries(models).map(m =>
            [vscode.Uri.file(m[0]).fsPath,
            new SqlModelInfo(
                m[1].name,
                m[1].file_name,
                m[1].file_path,
                m[1].table_names,
                m[1].cte_names,
                m[1].columns,
                m[1].cte_columns
            )]))

        this._onDidChangeTreeData.fire()
    }


    tableDefinitionProvider() {
        const definitionProvider = new ModelProvideDefinition(this)
        return vscode.languages.registerDefinitionProvider('sql', definitionProvider)
    }


    getPythonParsePromise(pythonPath: string, sqlPaths: any[], context: vscode.ExtensionContext): Promise<SqlModelsResponse | undefined> {

        logInformation("Starting the parsing of files from python env: " + pythonPath)

        const scriptPath = path.join(context.extensionPath, 'scripts', 'run_crawler.py')

        return new Promise<SqlModelsResponse | undefined>((resolve) => {
            // 1. Create a unique temporary file path
            const tempFileName = `sql_scanner_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`;
            const tempFilePath = path.join(os.tmpdir(), tempFileName);

            // Helper to clean up the temp file safely
            const cleanup = () => {
                fs.unlink(tempFilePath, () => { }); // Silent cleanup attempt
            };

            // 2. Pass the tempFilePath as the third CLI argument to Python
            execFile(
                pythonPath,
                [scriptPath, tempFilePath, ...sqlPaths],
                { maxBuffer: 1024 * 1024 * 10 }, // Generous 10MB stderr buffer for Python logs
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        logError(`SQL Scanner Error: ${stderr || error.message}`, error.message)
                    }

                    // 3. Read the output directly from the file
                    fs.readFile(tempFilePath, 'utf-8', (readErr, rawData) => {
                        cleanup();

                        if (readErr) {
                            logError(`SQL Scanner Error: Could not read temporary output file.`)
                            return resolve(undefined);
                        }

                        try {
                            const models: SqlModelsResponse = JSON.parse(rawData);


                            logInformation(
                                "Successfully parsed " + Object.keys(models).length + " SQL files"
                            );

                            resolve(models);
                        } catch (e) {
                            logError("Failed to parse Python JSON output");
                            resolve(undefined);
                        }
                    });
                }
            );
        });
    }


}

class ModelProvideDefinition implements vscode.DefinitionProvider {

    constructor(private modelProvider: SqlModelProvider) {

    }
    async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {


        // Logic to find the table definition goes here
        // 1. Get the word (table name) at the current cursor position
        const wordPattern = /[\w.]+/;
        const range = document.getWordRangeAtPosition(position, wordPattern);
        const tableName = document.getText(range);


        const fqn = tableName


        const targetRefModels = Array.from(this.modelProvider.models.values()).filter(m => m.name === tableName)

        const refModel = targetRefModels[0]


        const refModels = Array.from(this.modelProvider.models.values()).filter((m) => m.table_names.some((dp) => dp.fullname === fqn))

        if (refModel) refModels.push(refModel)


        if (refModels.length === 0) {
            const docModel = this.modelProvider.models.get(document.uri.fsPath)

            if (docModel) {
                const cte = docModel?.cte_names.find(cte => cte.fullname === tableName || cte.alias === tableName)
                if (cte) {

                    const content = document.getText()
                    const matches = content.matchAll(RegExp(tableName, 'g'))

                    const references = Array.from(matches).map(match => {
                        if (match && typeof match.index !== 'undefined') {
                            const targetPos = document.positionAt(match.index);
                            if (targetPos.line !== position.line)
                                return new vscode.Location(document.uri, targetPos);
                        }

                    }).filter(f => f !== undefined)
                    return references
                }

                const tableAlias = tableName.split('.')[0]
                const splitField = tableName.split('.')[1]

                const field = [...docModel.table_names.flatMap(t => t.fields), ...docModel.cte_names.flatMap(t => t.fields)]
                    .find(f => f === tableName || f === splitField)

                if (field) {
                    const content = document.getText()
                    const matches = content.matchAll(RegExp(field, 'g'))

                    const references = Array.from(matches).map(match => {
                        if (match && typeof match.index !== 'undefined') {
                            const targetPos = document.positionAt(match.index);
                            return new vscode.Location(document.uri, targetPos);
                        }

                    }).filter(f => f !== undefined)

                    const refTable = [...docModel.table_names].find(t => t.alias === tableAlias)

                    if (refTable) {

                        const refFieldModel = Array.from(this.modelProvider.models.values()).filter(m => m.name === refTable.fullname)

                        const fieldRefLocationPromises = refFieldModel.map(async (rm) => {
                            const file = vscode.Uri.file(rm.file_path);
                            const doc = await vscode.workspace.openTextDocument(file);
                            const content = doc.getText();
                            const match = content.match(splitField);

                            if (match && typeof match.index !== 'undefined' && doc.fileName !== document.fileName) {
                                const targetPos = doc.positionAt(match.index);
                                return new vscode.Location(file, targetPos);
                            }

                            return new vscode.Location(file, doc.positionAt(0));
                        })

                        const resolvedLocations = await Promise.all(fieldRefLocationPromises);

                        references.push(...resolvedLocations)

                    }

                    return references

                }


            }
        }


        const locationPromises = refModels.map(async (rm) => {
            const file = vscode.Uri.file(rm.file_path);
            const doc = await vscode.workspace.openTextDocument(file);
            const content = doc.getText();
            const match = content.match(tableName);

            if (match && typeof match.index !== 'undefined' && doc.fileName !== document.fileName) {
                const targetPos = doc.positionAt(match.index);
                return new vscode.Location(file, targetPos);
            }

            return new vscode.Location(file, doc.positionAt(0));
        });


        const resolvedLocations = await Promise.all(locationPromises);

        const locations = resolvedLocations.filter(loc => loc !== null);

        return locations.length > 0 ? locations : null;

    }


}
