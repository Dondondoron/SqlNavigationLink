import * as vscode from "vscode";
import * as path from "path";
import * as childProcess from 'child_process';
import { promisify } from 'util';
import { logError, logInformation } from "./logging";
import { Config } from "./Settings";

const exec = promisify(childProcess.exec);

export interface PythonPackage {
    name: string;
    version: string;
    relevant?: boolean;
}

enum PythonSource {
    EXTENSION_SETTINGS = "Extension Settings",
    VSCODE_EXTENSION = 'VSCode Python Extension'
}

export class PythonEnvironment {
    public readonly venvName: string;
    public readonly path: string;
    public readonly pythonExecutable: string;
    public readonly source: PythonSource

    public packages: PythonPackage[] = []
    public missingPackages: PythonPackage[] = []

    constructor(venvName: string, envPath: string, pythonExecutable: string, source: PythonSource) {
        this.venvName = venvName;
        this.path = envPath;
        this.pythonExecutable = pythonExecutable;
        this.source = source
    }

    toJSON(){
        return {
            venvName: this.venvName,
            path: this.path,
            pythonExecutable: this.pythonExecutable,
            source: this.source,
            packages:this.packages,
            missingPackages:this.missingPackages,
        }
    }

    static fromJSON(data:any){
        const pythonEnv = new PythonEnvironment(
            data.venvName,
            data.path,
            data.pythonExecutable,
            data.source
        )
        pythonEnv.packages = data.packages
        pythonEnv.missingPackages = data.missingPackages
        
        return pythonEnv
    }

    /**
     * Checks if a given file name looks like a Python executable.
     */
    private static isPythonBinary(fileName: string): boolean {
        const lower = fileName.toLowerCase();
        // Matches "python", "python3", "python3.11", "python.exe", "python3.exe", etc.
        return /^python(\d+(\.\d+)?)?(\.exe)?$/.test(lower);
    }
    /**
         * Finds all potential Python executables given a path (file or root directory).
         */
    private static async findPythonExecutables(inputPath: string): Promise<{ executables: string[]; envFolder: string }> {
        let isFile = false;
        try {
            const stat = await vscode.workspace.fs.stat(vscode.Uri.file(inputPath));
            isFile = (stat.type & vscode.FileType.File) !== 0;
        } catch {
            return { executables: [], envFolder: inputPath };
        }

        // Case 1: User pointed directly to a file (e.g., /venv/bin/python3)
        if (isFile) {
            const fileName = path.basename(inputPath);
            if (this.isPythonBinary(fileName)) {
                // Infer env root by popping bin/Scripts or parent dir
                const parentDir = path.dirname(inputPath);
                const parentDirName = path.basename(parentDir).toLowerCase();
                const envFolder = (parentDirName === 'bin' || parentDirName === 'scripts')
                    ? path.dirname(parentDir)
                    : parentDir;

                return { executables: [inputPath], envFolder };
            }
            return { executables: [], envFolder: path.dirname(inputPath) };
        }

        // Case 2: User pointed to an environment directory
        const envFolder = inputPath;
        const binSubdir = process.platform === 'win32' ? 'Scripts' : 'bin';
        const binDirUri = vscode.Uri.file(path.join(envFolder, binSubdir));

        try {
            const entries = await vscode.workspace.fs.readDirectory(binDirUri);
            const executables = entries
                .filter(([name, type]) => type === vscode.FileType.File && this.isPythonBinary(name))
                .map(([name]) => path.join(binDirUri.fsPath, name));

            return { executables, envFolder };
        } catch {
            // No bin/Scripts directory found
            return { executables: [], envFolder };
        }
    }

    /**
     * Validates and creates a PythonEnvironment from a path.
     * Prompts the user if multiple binaries are found.
     */
    static async createFromPath(inputPath: string, source: PythonSource): Promise<PythonEnvironment | null> {
        const { executables, envFolder } = await this.findPythonExecutables(inputPath);

        if (executables.length === 0) {
            return null;
        }

        let chosenExecutable = executables[0];

        // If multiple executables are found, ask the user to pick one
        if (executables.length > 1) {
            const items = executables.map(exePath => ({
                label: path.basename(exePath),
                description: exePath,
                path: exePath
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Multiple Python binaries found. Choose which one to use:',
                title: 'Select Python Executable'
            });

            if (!selected) {
                // User cancelled the quick pick
                return null;
            }

            chosenExecutable = selected.path;
        }

        const venvName = path.basename(envFolder);
        return new PythonEnvironment(venvName, envFolder, chosenExecutable, source);
    }

    /**
     * Inspects the environment and returns a list of installed packages.
     */
    async getPackages(): Promise<PythonPackage[]> {
        try {
            // Using `python -m pip list --format=json` gets structured output directly
            const { stdout } = await exec(`"${this.pythonExecutable}" -m pip list --format=json`);

            const packages: PythonPackage[] = JSON.parse(stdout);

            this.packages = packages
                .map(p => {
                    const isRelevant = Boolean(Config.requirements[p.name]);
                    return {
                        ...p,
                        relevant: isRelevant
                    };
                })
                .sort((a, b) => Number(b.relevant) - Number(a.relevant));

            this.missingPackages = Object.entries(Config.requirements)
                .filter(([packageName]) => !this.packages.some(p => p.name === packageName))
                .map(([packageName, versionMap]) => ({
                    name: packageName,
                    version: versionMap.defaultVersion
                } as PythonPackage));

            return this.packages;
        } catch (error) {
            logError(`Failed to retrieve packages for ${this.path}:`, error)
            return [];
        }
    }
}
export class PythonSupplier {

    getEnvsConfigName() {
        return 'sql-nav-link-' + vscode.workspace.name + '-py-envs'
    }

    getCurrentEnvConfigName() {
        return 'sql-nav-link-' + vscode.workspace.name + '-current-py-env'
    }

    pythonVenvs: PythonEnvironment[] = []

    selectedEnvPath?: string

    constructor(
        private context: vscode.ExtensionContext
    ) { }

    async init() {

        const savedCurrentEnv = this.context.globalState.get<string>(this.getCurrentEnvConfigName())
        const savedEnvs = this.context.globalState.get<any[]>(this.getEnvsConfigName())?.map(d=> PythonEnvironment.fromJSON(d))
        

        if (!savedEnvs)
            await Promise.all([this.getConfigEnv(), this.loadPyExtension()]).then(() => {
                vscode.commands.executeCommand('sql-nav-link.pythonRefresh')
            })
        else this.pythonVenvs = savedEnvs

        if (savedCurrentEnv) this.selectedEnvPath = savedCurrentEnv
        else if (this.pythonVenvs.length > 0) this.setCurrentPythonEnv(this.pythonVenvs[0].path)
    }


    saveLocalPythonEnvs() {
        this.context.globalState.update(this.getEnvsConfigName(), this.pythonVenvs.map(p=>p.toJSON()))
    }


    setCurrentPythonEnv(env: string) {
        this.selectedEnvPath = env
        this.context.globalState.update(this.getCurrentEnvConfigName(), env)
    }

    getCurrenPythonEnv() {
        return this.pythonVenvs.find(f => f.path === this.selectedEnvPath)
    }

    async refreshPython() {
        logInformation('Getting available python packages')

        await Promise.all([...this.pythonVenvs.map(e => e.getPackages())])

        const envs = this.pythonVenvs

        if (!this.selectedEnvPath && envs.length > 0) this.selectedEnvPath = envs[0].path

        this.saveLocalPythonEnvs()
    }

    async getConfigEnv() {
        const pythonPath = vscode.workspace
            .getConfiguration('Dondondoron.sql-nav-link')
            .get<string>('pythonPath');

        this.pythonVenvs = this.pythonVenvs.filter(p => p.source !== PythonSource.EXTENSION_SETTINGS)

        if (pythonPath) {
            const pythonEnv = await PythonEnvironment.createFromPath(pythonPath, PythonSource.EXTENSION_SETTINGS)
            if (pythonEnv) this.pythonVenvs.push(pythonEnv)
            else logError(`Could not find executable from sql-nav-link Settings with path: ${pythonPath}`)
        }
    }

    async setNewConfigPythonEnv() {
        const fileUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select Path'
        });

        if (!fileUris || fileUris.length === 0) {
            return;
        }

        const selectedUri = fileUris[0];

        const config = vscode.workspace.getConfiguration('Dondondoron.sql-nav-link');

        await config.update(
            'pythonPath',
            selectedUri.fsPath,
            vscode.ConfigurationTarget.Global
        );
    }


    async loadPyExtension() {

        const pythonExtension = vscode.extensions.getExtension('ms-python.python');
        const api = pythonExtension?.exports;

        api.environments.onDidChangeActiveEnvironmentPath(async (e: any) => {
            const pyEnv = await this.refreshVsCodeExtensionEnv(api);
            if (pyEnv) {
                vscode.commands.executeCommand('sql-nav-link.pythonRefresh')
            } else {
                logError(`Could not load Python Env after MS Python Environment change`)
            }
        })
    }



    private async refreshVsCodeExtensionEnv(api: any) {
        const activeEnvPath = api?.environments.getActiveEnvironmentPath();
        if (activeEnvPath) {

            const pythonEnv = await PythonEnvironment.createFromPath(activeEnvPath.path, PythonSource.VSCODE_EXTENSION);
            if (pythonEnv) {
                this.pythonVenvs = this.pythonVenvs.filter(p => p.source !== PythonSource.VSCODE_EXTENSION)
                this.pythonVenvs.push(pythonEnv);
            }
            else logError(`Could not find executable from VSCode Python extension with path: ${activeEnvPath.path}`);
            return pythonEnv
        }
    }
}