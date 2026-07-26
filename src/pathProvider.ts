import * as vscode from 'vscode';
import { Config } from './Settings';

export enum SqlType {
  SQLMESH = 'SQLMESH',
  DBT = 'DBT'
}
export interface PathObject {
  id: string;
  label: string;
  filePath: string;
  description?: string;
  type: SqlType
}


export class PathTreeItem extends vscode.TreeItem {
  constructor(public readonly pathObj: PathObject) {
    super(pathObj.label, vscode.TreeItemCollapsibleState.None);


    this.init(pathObj)
    this.contextValue = 'pathItem';
  }

  init(pathObj: PathObject) {

    this.description = pathObj.description || pathObj.filePath;
    this.tooltip = `Type: ${pathObj.type}, Path: ${pathObj.filePath}`;
    const iconName = pathObj.type === SqlType.DBT
      ? 'dbt_icon.svg'
      : 'sqlmesh_icon.svg';

    this.iconPath = {
      dark:vscode.Uri.joinPath(Config.extensionUri, 'media', 'icons',  'dark',  iconName),
      light:vscode.Uri.joinPath(Config.extensionUri, 'media', 'icons', 'light', iconName)
    }

    this.command = {
      command: 'vscode.open',
      title: 'Open File',
      arguments: [vscode.Uri.file(pathObj.filePath)]
    }

  }
}

export class PathTreeDataProvider implements vscode.TreeDataProvider<PathTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PathTreeItem | undefined | void> =
    new vscode.EventEmitter<PathTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<PathTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private pathObjects: PathObject[] = [];

  constructor(initialPaths?: PathObject[]) {
    if (initialPaths) {
      this.pathObjects = initialPaths;
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  addPath(newPath: PathObject): void {
    this.pathObjects.push(newPath);
    this.refresh();
  }

  removePath(node: PathTreeItem): void {
    this.pathObjects = this.pathObjects.filter(item => item.id !== node.pathObj.id);
    this.refresh();
  }

  getPaths(): PathObject[] {
    return this.pathObjects;
  }

  getTreeItem(element: PathTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PathTreeItem): vscode.ProviderResult<PathTreeItem[]> {
    if (!element) {
      return this.pathObjects.map(obj => new PathTreeItem(obj));
    }
    return [];
  }

  removePathCommand() {
    return vscode.commands.registerCommand(
      'sql-nav-link.removePath',
      (node: PathTreeItem) => {
        if (node) {
          this.removePath(node);
        }
      }
    )
  }
  changePathTypeCommand() {
    return vscode.commands.registerCommand(
      'sql-nav-link.changePathType',
      async (node: PathTreeItem) => {
        if (node) {
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

          node.pathObj.type = type as SqlType

          node.init(node.pathObj)

          this.refresh()
        }
      }
    )
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

        // Option B: Prompt for a custom label/name using standard InputBox
        const label = await vscode.window.showInputBox({
          prompt: 'Enter a name/label for this path',
          placeHolder: 'e.g., Input Dataset, Script Entry',
          value: selectedUri.path.split('/').pop()
        });

        if (!label) {
          return;
        }

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
          label: label,
          filePath: selectedUri.fsPath,
          type: type as SqlType
        };

        this.addPath(newPathObj);
      }
    )
  }
}