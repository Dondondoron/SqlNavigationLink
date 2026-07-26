
import * as vscode from "vscode";
import * as path from "path";
import { execFile } from "child_process";

class SqlModelTreeProvider implements vscode.TreeDataProvider<ModelTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    ModelTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ModelTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ModelTreeItem): Promise<ModelTreeItem[]> {
    if (element) {
      return Promise.resolve([]); // No child nesting needed yet
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return Promise.resolve([]);
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const scriptPath = path.join(
      __dirname,
      "..",
      "src",
      "sql_crawler",
      "run_crawler.py",
    );

    return new Promise((resolve, reject) => {
      // Run Python directly without LSP!
      execFile(
        "python",
        [scriptPath, workspacePath],
        (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(
              `SQL Scanner Error: ${stderr || error.message}`,
            );
            return resolve([]);
          }

          try {
            const models = JSON.parse(stdout);
            const treeItems = models.map(
              (m: any) => new ModelTreeItem(m.name, m.path),
            );
            resolve(treeItems);
          } catch (e) {
            vscode.window.showErrorMessage(
              "Failed to parse Python JSON output",
            );
            resolve([]);
          }
        },
      );
    });
  }
}

class ModelTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly filePath: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = filePath;
    this.description = path.basename(path.dirname(filePath)); // Show folder name next to title
    this.iconPath = new vscode.ThemeIcon("database"); // Use built-in database icon

    // Attach click action to open the file
    this.command = {
      command: "sqlNavLink.openFile",
      title: "Open Model",
      arguments: [this.filePath],
    };
  }
}
