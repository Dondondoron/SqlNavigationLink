import { getVsCodeApi } from "./vscodeAPI";


const vscode = getVsCodeApi();

export class Utility {

    static generateId() {
        return Math.random().toString(36).substring(2, 9);
    }


    static escapeHtml(str: string | undefined | null): string {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    static post(command: string, ...args: any[]) {
        vscode?.postMessage({
            command: command,
            args: args
        })
    }

}