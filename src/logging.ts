import * as vscode from 'vscode';


const outputChannel = vscode.window.createOutputChannel('SQL Nav Link');

export function logInformation(message: string) {

  console.log(message);
  outputChannel.appendLine(message);
  vscode.window.showInformationMessage(message);
}

export function logError(message: string, error?:unknown) {

  console.error(message, error);
  outputChannel.appendLine(message);
  vscode.window.showErrorMessage(message);
}
