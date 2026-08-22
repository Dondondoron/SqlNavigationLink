
import * as vscode from "vscode";
import * as path from "path";
import * as os from 'os';
import * as fs from 'fs';
import * as fsp from 'fs/promises'
import { execFile } from "child_process";
import * as crypto from 'crypto';
import { logError, logInformation } from "./logging";
import { Column, SqlModelInfo } from "./domain/domain";

export class SqlModelInfoTree extends vscode.TreeItem implements SqlModelInfo {
    constructor(
        public name: string,
        public file_name: string,
        public file_path: string,
        public table_names: string[],
        public columns: Column[]

    ) {
        super(name, vscode.TreeItemCollapsibleState.Collapsed)

        this.command = {
            command: `sql-nav-link.openPath`,
            title: name,
            arguments: [file_path]
        }
    }
}


type SqlModelsResponse = Record<string, any>;


export class SqlModelProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private treeItems: Map<string, vscode.TreeItem> = new Map()
    models: Map<string, SqlModelInfoTree> = new Map()


    private makeTreeItem(label: string, collapsed: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(label, collapsed)
        this.treeItems.set(label, treeItem)
        return treeItem
    }


    constructor(private context: vscode.ExtensionContext) {

    }


    getTreeItem(element: SqlModelInfoTree): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

        Object.entries(models).forEach(m =>
            this.models.set(
                vscode.Uri.file(m[1].file_path).fsPath,
                new SqlModelInfoTree(
                    m[1].name,
                    m[1].file_name,
                    m[1].file_path,
                    m[1].table_names,
                    m[1].columns
                )
            )
        )

        this._onDidChangeTreeData.fire()
    }


    tableDefinitionProvider() {
        const definitionProvider = new ModelProvideDefinition(this)
        return vscode.languages.registerDefinitionProvider('sql', definitionProvider)
    }

    getCacheUri() {

        const globalStorageUri = this.context.globalStorageUri;

        // 2. Ensure the storage directory exists on disk
        try {
            fsp.mkdir(globalStorageUri.fsPath, { recursive: true });
        } catch (error) {
            console.error('Failed to create global storage directory:', error);
        }

        return globalStorageUri
    }

    async saveCache(filename: string, data: object) {

        const cacheFileUri = vscode.Uri.joinPath(this.getCacheUri(), filename)

        const jsonString = JSON.stringify(data, null, 2);
        await vscode.workspace.fs.writeFile(cacheFileUri, Buffer.from(jsonString, 'utf8'));

    }

    loadAllCache(paths: string[]) {

        Promise.all(paths.map(p => this.loadCache(getSafeFileNameForPath(p)))).then(data=>{
            data.forEach(d=>{

                if(d){
                    this.initModels(d)
                }
            })
        })

    }

    async loadCache(filename: string): Promise<object | null> {
        const cacheFileUri = vscode.Uri.joinPath(this.getCacheUri(), filename)

        try {
            const fileData = await vscode.workspace.fs.readFile(cacheFileUri);
            return JSON.parse(Buffer.from(fileData).toString('utf8'));
        } catch {
            // File likely doesn't exist yet
            return null
        }
    }

    getPythonParsePromise(pythonPath: string, targetPath: any, type: any): Promise<SqlModelsResponse | undefined> {

        const saveCache = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('saveCache', false);

        logInformation("Starting the parsing of files from python env: " + pythonPath)

        const scriptPath = path.join(this.context.extensionPath, 'scripts', 'run_crawler.py');

        return new Promise<SqlModelsResponse | undefined>((resolve) => {
            // 1. Create a unique temporary file path
            const tempFileName = saveCache ? getSafeFileNameForPath(targetPath) : `sql_scanner_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`;
            const tempFilePath = saveCache ? this.getCacheUri().fsPath : os.tmpdir();
            const fullTarget = path.join(tempFilePath, tempFileName)

            // Helper to clean up the temp file safely
            const cleanup = () => {
                fs.unlink(tempFilePath, () => { }); // Silent cleanup attempt
            };

            // 2. Pass the tempFilePath as the third CLI argument to Python
            execFile(
                pythonPath,
                [scriptPath, tempFilePath, tempFileName, targetPath, type],
                { maxBuffer: 1024 * 1024 * 10 , cwd:targetPath}, // Generous 10MB stderr buffer for Python logs
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        logError(`SQL Scanner Error: ${stderr || error.message}`, error.message)
                    }

                    // 3. Read the output directly from the file
                    fs.readFile(fullTarget, 'utf-8', (readErr, rawData) => {
                        if (!saveCache) cleanup();

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


        const refModels = Array.from(this.modelProvider.models.values()).filter((m) => m.table_names.some((dp) => dp === fqn))

        if (refModel) refModels.push(refModel)


        if (refModels.length === 0) {
            const docModel = this.modelProvider.models.get(document.uri.fsPath)

            /*
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
                */
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
export function getSafeFileNameForPath(inputPath: string): string {
    // 1. Normalize slashes and resolve to an absolute path if needed
    const resolvedPath = path.resolve(inputPath);

    const sanitized = resolvedPath
        .replace(/[:/\\*?"<>|]/g, '_')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_');

    const hash = crypto.createHash('md5').update(resolvedPath).digest('hex').substring(0, 8);

    const ext = path.extname(resolvedPath) || '.json';

    const cleanName = sanitized.replace(/^_+|_+$/g, '');

    return `${cleanName}_${hash}${ext}`;
}