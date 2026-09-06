import * as vscode from "vscode";
import * as path from "path";
import * as fs from 'fs';
import * as os from 'os';


import { MainController } from "./MainController";
import { Config } from "./Settings";




export async function activate(context: vscode.ExtensionContext) {


  Config.extensionUri = context.extensionUri


  const mainController = new MainController(context)


  const tableDefinitionProvider = mainController.sqlModelProvider.tableDefinitionProvider()
  const configListener = mainController.onChangeSettingsCommand()
  const addPathCommand = mainController.parseView.addPathCommand();


  // Register the sidebar view
  ;


  context.subscriptions.push(
    configListener,
    tableDefinitionProvider,
    addPathCommand,
    mainController.openPathCommand(),
    mainController.openModelCommand(),
    mainController.parseCommand(),
    mainController.fileOpenListener(),
    mainController.updatePythonEnvironmentCommand(),
    vscode.window.registerTreeDataProvider("sql-nav-link.modelTree", mainController.sqlModelProvider),
    vscode.window.registerWebviewViewProvider("sql-nav-link.parseView", mainController.parseView),
    vscode.window.registerWebviewViewProvider("sql-nav-link-panel.Lineage", mainController.lineagePanelProvider),
    vscode.commands.registerCommand(
      "sqlNavLink.openFile",
      (filePath: string) => {
        vscode.workspace.openTextDocument(filePath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      },
    )
  )

  
}



export async function deactivate(): Promise<void> { }


