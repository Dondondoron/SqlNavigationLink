
import * as vscode from "vscode";
import * as path from "path";
import * as os from 'os';
import * as fs from 'fs';

import { execFile } from "child_process";

import { Config } from "./Settings";
import { logInformation } from "./logging";


interface TableInfo {
    fullname: string;
    name: string;
    db?: string;
    catalog?: string;
    alias?:string;
    fields:string[]
}

class SqlModelInfo extends vscode.TreeItem {
    constructor(
        public name: string,
        public file_name: string,
        public file_path: string,
        public table_names: TableInfo[]
    ){
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

        this.models = new Map(Object.entries(models).map(m=> [vscode.Uri.file(m[0]).fsPath, new SqlModelInfo(m[1].name, m[1].file_name, m[1].file_path, m[1].table_names)]))

        this._onDidChangeTreeData.fire()
    }


    tableDefinitionProvider() {
        const definitionProvider = new ModelProvideDefinition(this)
        return vscode.languages.registerDefinitionProvider('sql', definitionProvider)
    }


    getPythonParsePromise(sqlPaths: string[], context: vscode.ExtensionContext): Promise<SqlModelsResponse | undefined> {



        const pythonPath = Config.pythonPath

        logInformation("Starting the parsing of files from python env: " + pythonPath)

        const scriptPath = path.join(context.extensionPath, 'scripts', 'sql_crawler.py')

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
                [scriptPath, JSON.stringify(sqlPaths), tempFilePath],
                { maxBuffer: 1024 * 1024 * 10 }, // Generous 10MB stderr buffer for Python logs
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        vscode.window.showErrorMessage(
                            `SQL Scanner Error: ${stderr || error.message}`
                        );
                        cleanup();
                        return resolve(undefined);
                    }

                    // 3. Read the output directly from the file
                    fs.readFile(tempFilePath, 'utf-8', (readErr, rawData) => {
                        cleanup(); // Always clean up as soon as reading finishes or fails

                        if (readErr) {
                            vscode.window.showErrorMessage(
                                `SQL Scanner Error: Could not read temporary output file.`
                            );
                            return resolve(undefined);
                        }

                        try {
                            const models: SqlModelsResponse = JSON.parse(rawData);

                            // Access your parsed data
                            for (const [filePath, modelInfo] of Object.entries(models)) {
                                console.log(`Model Path: ${filePath}`);
                                console.log(`Model Name: ${modelInfo.name}`);
                                console.log(`Tables:`, modelInfo.table_names);
                            }

                            logInformation(
                                "Successfully parsed " + Object.keys(models).length + " SQL files"
                            );

                            resolve(models);
                        } catch (e) {
                            vscode.window.showErrorMessage("Failed to parse Python JSON output");
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
            const quoteModel = this.modelProvider.models.get(tableName)
            Array.from(this.modelProvider.models.values()).filter((m) => m.table_names.some((dp) => dp.fullname === tableName)).forEach(p => refModels.push(p))
            if (quoteModel) refModels.push(quoteModel)
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
