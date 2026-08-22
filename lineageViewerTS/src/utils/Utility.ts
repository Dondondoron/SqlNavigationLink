import { getVsCodeApi } from "./vscodeAPI";


const vscode = getVsCodeApi();

export class Utility {

    static generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    

    
    static post(command: string, ...args: any[]) {
        vscode?.postMessage({
            command: command,
            args: args
        })
    }
    
}