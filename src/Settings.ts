import * as vscode from 'vscode';

interface VersionMap {
  defaultVersion: string
  min?: string,
  max?: string
}

export class Config {

  static extensionUri: vscode.Uri

  static sqlmeshRequirements: Record<string, VersionMap> = {
    'sqlmesh': { defaultVersion: '0.236.0' },
    'Jinja2': { defaultVersion: '3.1.6' },
    'sqlglot': { defaultVersion: '30.8.0' }
  };

  static dbtRequirements: Record<string, VersionMap> = {
    'Jinja2': { defaultVersion: '3.1.6' },
    'PyYAML': { defaultVersion: '6.0.3' }
  };


  static requirements: Record<string, VersionMap> = {
    ...this.sqlmeshRequirements,
    ...this.dbtRequirements
  };
}