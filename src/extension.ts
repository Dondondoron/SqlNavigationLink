import * as vscode from "vscode";
import * as path from "path";
import * as fs from 'fs';
import * as os from 'os';


import { MainController } from "./MainController";
import { Config } from "./Settings";




export async function activate(context: vscode.ExtensionContext) {

  const config = vscode.workspace.getConfiguration('Dondondoron.sql-nav-link.pythonPath');
  const autoLoadContext = vscode.workspace.getConfiguration('Dondondoron.sql-nav-link.autoContext');

  const pythonPath = vscode.workspace
    .getConfiguration('Dondondoron.sql-nav-link')
    .get<string>('pythonPath');




  await setUpPython(context, config, pythonPath);

  Config.extensionUri = context.extensionUri


  const mainController = new MainController(context)


  const tableDefinitionProvider = mainController.sqlModelProvider.tableDefinitionProvider()
  const configListener = mainController.onChangeSettingsCommand()
  const addPathCommand = mainController.pathProvider.addPathCommand();

  const removePathCommand = mainController.pathProvider.removePathCommand();

  // Register the sidebar view
  ;


  context.subscriptions.push(
    configListener,
    tableDefinitionProvider,
    addPathCommand,
    removePathCommand,
    mainController.openPathCommand(),
    mainController.openModelCommand(),
    mainController.parseCommand(context),
    mainController.fileOpenListener(),
    vscode.window.registerTreeDataProvider("sqlNavLinkPaths", mainController.pathProvider),
    vscode.window.registerTreeDataProvider("sql-nav-link.modelTree", mainController.sqlModelProvider),
    vscode.window.registerWebviewViewProvider("sql-nav-link.parseView", mainController.planController),
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

  if(autoLoadContext){
    vscode.commands.executeCommand('sql-nav-link.parsePaths')
  }

}



export async function deactivate(): Promise<void> { }



async function setUpPython(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration, settingsPythonPath: string | undefined) {

  const pythonPath = settingsPythonPath ?? config.get<string>('pythonPath', await getPythonPath(context) ?? '.');

  if (pythonPath) {
    console.log(`Using Python from: ${pythonPath}`);


    try {

      Config.pythonPath = pythonPath

      return true

    } catch (e) {
      vscode.window.showErrorMessage("Backend failed to start in time.");
      console.error("Backend failed to start in time.");
      return false
    }

  } else {
    vscode.window.showErrorMessage("Could not detect a valid Python interpreter.");
  }

}

async function getPythonPath(context: vscode.ExtensionContext): Promise<string | undefined> {
  const pythonExtension = vscode.extensions.getExtension('ms-python.python');
  const api = pythonExtension?.exports;

  // 1. Check if the user has an active environment selected in the UI
  const activeEnvPath = api?.environments.getActiveEnvironmentPath();
  if (activeEnvPath) {
    const environment = await api.environments.resolveEnvironment(activeEnvPath);
    if (environment?.executable.uri?.fsPath) {
      return environment.executable.uri.fsPath;
    }
  }

  if (fs.existsSync(activeEnvPath.path)) {
    return activeEnvPath;
  }
  // 2. FALLBACK: Look for a .venv inside your server folder
  const isWindows = os.platform() === 'win32';
  const venvPath = path.join(
    context.extensionPath,
    '.venv',
    isWindows ? 'Scripts' : 'bin',
    isWindows ? 'python.exe' : 'python'
  );

  if (fs.existsSync(venvPath)) {
    return venvPath;
  }

  // 3. LAST RESORT: Try the system 'python' (This is what's likely failing now)
  return 'python';
}



