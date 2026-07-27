import * as vscode from 'vscode';


export function logInformation(message: string) {

  console.log(message);
  vscode.window.showInformationMessage(message);
}

export function logError(message: string, error?:unknown) {

  console.error(message, error);
  vscode.window.showErrorMessage(message);
}
