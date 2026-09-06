
import * as vscode from "vscode";
import { Column, SqlModelInfo, SqlModelsResponse } from "./domain/domain";

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
