

import * as vscode from "vscode";
import * as path from "path";
import * as fsp from 'fs/promises'
import { SqlModelsResponse } from "./domain/domain";
import { logError, logInformation, logMessage } from "./logging";
import { getSafeFileNameForPath } from "./utils";

import * as os from 'os';
import * as fs from 'fs';
import { spawn } from "child_process";
import { SqlModelProvider } from "./modelProvider";
import { SQLMeshContext } from "./parsing/parsingProvider";


export class ModelLoader {

    constructor(
        private context: vscode.ExtensionContext,
        private sqlModelProvider: SqlModelProvider
    ) { }


    getPythonParsePromise(pythonPath: string, rootPath: any, type: any, configPaths: string[]): Promise<SqlModelsResponse | undefined> {

        const saveCache = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get('saveCache', false);


        const scriptPath = path.join(this.context.extensionPath, 'scripts', 'run_crawler.py');

        return new Promise<SqlModelsResponse | undefined>((resolve) => {
            // 1. Create a unique temporary file path
            const tempFileName = saveCache ? getSafeFileNameForPath(rootPath) : `sql_scanner_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`;
            const tempFilePath = saveCache ? this.getCacheUri().fsPath : os.tmpdir();
            const fullTarget = path.join(tempFilePath, tempFileName);

            const cleanup = () => {
                fs.unlink(fullTarget, () => { }); // Fixed to target the actual file
            };

            // Get total system memory in bytes and calculate 80%
            const totalMemoryBytes = os.totalmem();
            const targetMemoryBytes = Math.floor(totalMemoryBytes * 0.8);
            const targetMemoryMb = Math.floor(targetMemoryBytes / (1024 * 1024));

            // 2. Calculate CPU Quota (80% of total aggregate core power)
            const coreCount = os.cpus().length;
            const cpuQuotaPercentage = coreCount * 80;

            const osPlatform = os.platform();

            logMessage("Starting the parsing of files from python env: " + pythonPath + " with target path: " 
                + rootPath + " with type: " + type 
                + 'Config Paths: ' + configPaths
                + " \n With total memory: " + totalMemoryBytes 
                + " bytes, target memory: " + targetMemoryBytes 
                + " bytes, CPU cores: " + coreCount 
                + ", CPU quota: " + cpuQuotaPercentage + "%"
                + ", Linux platform: " + osPlatform
            );

            // 3. Platform-aware process configuration
            const isLinux = osPlatform === 'linux';
            let command: string;
            let args: string[];

            if (isLinux) {
                // Linux: Use systemd-run to enforce hard resource limits and protect SSH
                command = 'systemd-run';
                args = [
                    '--user',
                    '--scope',
                    '-p', `MemoryMax=${targetMemoryMb}M`,
                    '-p', `CPUQuota=${cpuQuotaPercentage}%`,
                    '-p', 'MemorySwapMax=0',
                    pythonPath,
                    scriptPath,
                    tempFilePath,
                    tempFileName,
                    type,
                    ...configPaths
                ];
            } else {
                // Windows / macOS: Fall back to executing Python directly
                command = pythonPath;
                args = [
                    scriptPath,
                    tempFilePath,
                    tempFileName,
                    type,
                    ...configPaths
                ];
            }

            const pythonProcess = spawn(command, args, { cwd: rootPath });

            // Capture stdout in runtime
            pythonProcess.stdout.on('data', (data) => {
                const output = data.toString();
                logMessage(`[py]: ${output.trim()}`);
            });

            // Capture stderr in runtime
            pythonProcess.stderr.on('data', (data) => {
                const errorOutput = data.toString();
                logError(`[py error]: ${errorOutput.trim()}`);
            });

            // Handle process completion and file reading
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    logError(`SQL Scanner Process exited with code ${code}`);
                    return resolve(undefined);
                }

                fs.readFile(fullTarget, 'utf-8', (readErr, rawData) => {
                    if (!saveCache) cleanup();

                    if (readErr) {
                        logError(`SQL Scanner Error: Could not read temporary output file.`);
                        return resolve(undefined);
                    }

                    try {
                        const models: SqlModelsResponse = JSON.parse(rawData);
                        logMessage("Successfully parsed " + Object.keys(models).length + " SQL files");
                        resolve(models);
                    } catch (e) {
                        logError("Failed to parse Python JSON output");
                        resolve(undefined);
                    }
                });
            });
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