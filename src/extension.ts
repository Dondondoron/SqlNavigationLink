// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";
import { execFile } from "child_process";
import * as path from "path";
import * as fs from 'fs';
import * as os from 'os';


import { getSqlLinkTerminal, writeEmitter } from './logging';
import { PathObject, PathTreeDataProvider, PathTreeItem } from "./pathProvider";


function logInformation(message: string) {

  console.log(message);
  vscode.window.showInformationMessage(message);
}

interface TableInfo {
  fullname: string;
  name: string;
  db?: string;
  catalog?: string;
}

interface SqlModelInfo {
  name: string;
  file_name: string;
  file_path: string;
  table_names: TableInfo[];
}

type SqlModelsResponse = Record<string, SqlModelInfo>;

class PythonConfig {

  static pythonPath: string

}

class SqlModelProvider {

  models: Map<string, SqlModelInfo> = new Map()


  initModels(models: SqlModelsResponse) {

    this.models = new Map(Object.entries(models))
  }


}

export async function activate(context: vscode.ExtensionContext) {

  const config = vscode.workspace.getConfiguration('Dondondoron.sql-nav-link.pythonPath');

  const pythonPath = vscode.workspace
    .getConfiguration('Dondondoron.sql-nav-link')
    .get<string>('pythonPath');

  const configListener = vscode.workspace.onDidChangeConfiguration(async event => {
    // Check if the specific setting (or whole section) was affected
    if (event.affectsConfiguration('Dondondoron.sql-nav-link.pythonPath')) {

      // Read the updated value
      const updatedPythonPath = vscode.workspace
        .getConfiguration('Dondondoron.sql-nav-link')
        .get<string>('pythonPath');

      console.log('Python path changed to:', updatedPythonPath);
      vscode.window.showInformationMessage(`Updated Python Path: ${updatedPythonPath}`);

      if (updatedPythonPath) PythonConfig.pythonPath = updatedPythonPath
      // Re-initialize or handle your Python execution logic here...
    }
  });

  const startEngine = async () => {
    const pythonActive = await setUpPython(context, config, pythonPath);
    if (pythonActive) {
      writeEmitter.fire("⚙ Activating providers ⚙");
      return true;
    }
    return false;
  };

  const sqlModelProvider = new SqlModelProvider()


  const success = await startEngine();

  const pathProvider = new PathTreeDataProvider([]);

  const parsePaths = vscode.commands.registerCommand(
    'sql-nav-link.parsePaths',
    async () => {


      const sqlPaths: string[] = pathProvider.getPaths().length > 0
        ? pathProvider.getPaths().map(m => m.filePath)
        : (vscode.workspace.workspaceFolders ?? []).map(folder => folder.uri.fsPath);

      const models = await getPythonParsePromise(sqlPaths, context)

      if (models) sqlModelProvider.initModels(models)

    }
  );

  const tableDefinitionProvider = vscode.languages.registerDefinitionProvider('sql', {
    provideDefinition(document, position, token) {
      // Logic to find the table definition goes here
      return findTableDefinition(document, position, sqlModelProvider);
    }
  });

  const addPathCommand = vscode.commands.registerCommand(
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

      const newPathObj: PathObject = {
        id: Date.now().toString(),
        label: label,
        filePath: selectedUri.fsPath
      };

      pathProvider.addPath(newPathObj);
    }
  );

  const removePathCommand = vscode.commands.registerCommand(
    'sql-nav-link.removePath',
    (node: PathTreeItem) => {
      if (node) {
        pathProvider.removePath(node);
      }
    }
  );

  // Register the sidebar view
  vscode.window.registerTreeDataProvider("sqlNavLinkView", pathProvider);

  // Command: Click item to open file in editor
  context.subscriptions.push(
    configListener,
    tableDefinitionProvider,
    vscode.commands.registerCommand(
      "sqlNavLink.openFile",
      (filePath: string) => {
        vscode.workspace.openTextDocument(filePath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      },
    ),
    vscode.commands.registerCommand(
      'sql-nav-link.runPythonApp',
      async () => {
        const currentPaths = pathProvider.getPaths();
        const pathStrings = currentPaths.map(p => p.filePath);

        vscode.window.showInformationMessage(
          `Passing ${pathStrings.length} paths to Python app...`
        );

        // Example: send paths as arguments to a Python script via VS Code Terminal
        const terminal = vscode.window.createTerminal('Python Runner');
        terminal.show();
        terminal.sendText(`python app.py ${pathStrings.map(p => `"${p}"`).join(' ')}`);
      }),
    addPathCommand,
    removePathCommand,
    parsePaths
  )

}



export async function deactivate(): Promise<void> { }



async function setUpPython(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration, settingsPythonPath: string | undefined) {

  const pythonPath = settingsPythonPath ?? config.get<string>('pythonPath', await getPythonPath(context) ?? '.');

  const serverModulePath = path.join(context.extensionPath, 'server');
  if (pythonPath) {
    console.log(`Using Python from: ${pythonPath}`);


    try {

      PythonConfig.pythonPath = pythonPath

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

export function getSqlCrawlerPath(context: vscode.ExtensionContext): string {
  return path.join(context.extensionPath, 'scripts', 'sql_crawler.py');
}
function getPythonParsePromise(sqlPaths: string[], context: vscode.ExtensionContext): Promise<SqlModelsResponse | undefined> {



  const pythonPath = PythonConfig.pythonPath

  logInformation("Starting the parsing of files from python env: " + pythonPath)

  const scriptPath = getSqlCrawlerPath(context)

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
      (error, stdout, stderr) => {
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

async function findTableDefinition(document: vscode.TextDocument, position: vscode.Position, provider: SqlModelProvider) {
  // 1. Get the word (table name) at the current cursor position
  const wordPattern = /[\w.]+/;
  const range = document.getWordRangeAtPosition(position, wordPattern);
  const tableName = document.getText(range);


  const fqn = tableName


  const targetRefModels = Array.from(provider.models.values()).filter(m => m.name === tableName)

  const refModel = targetRefModels[0]


  const refModels = Array.from(provider.models.values()).filter((m) => m.table_names.some((dp) => dp.fullname === fqn))

  if (refModel) refModels.push(refModel)


  if (refModels.length === 0) {
    const quoteModel = provider.models.get(tableName)
    Array.from(provider.models.values()).filter((m) => m.table_names.some((dp) => dp.fullname === tableName)).forEach(p => refModels.push(p))
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