

import * as vscode from "vscode";
import * as path from "path";
import * as fsp from 'fs/promises'
import { SqlModelsResponse } from "./domain/domain";
import { logError, logInformation } from "./logging";
import { getSafeFileNameForPath } from "./utils";

import * as os from 'os';
import * as fs from 'fs';
import { execFile } from "child_process";
import { SqlModelProvider } from "./modelProvider";


export class ModelLoader {

    constructor(
        private context: vscode.ExtensionContext,
        private sqlModelProvider: SqlModelProvider
    ) { }


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

            const cleanup = () => {
                fs.unlink(tempFilePath, () => { }); // Silent cleanup attempt
            };

            execFile(
                pythonPath,
                [scriptPath, tempFilePath, tempFileName, targetPath, type],
                { maxBuffer: 1024 * 1024 * 10, cwd: targetPath }, 
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        logError(`SQL Scanner Error: ${stderr || error.message}`, error.message)
                    }

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

        Promise.all(paths.map(p => this.loadCache(getSafeFileNameForPath(p)))).then(data => {
            data.forEach(d => {

                if (d) {
                    this.sqlModelProvider.initModels(d)
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
}