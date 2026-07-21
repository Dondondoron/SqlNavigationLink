import * as vscode from 'vscode';



export let writeEmitter = new vscode.EventEmitter<string>();
let sqlMeshTerminal: vscode.Terminal | undefined;



export function getSqlMeshTerminal() {
    if (!sqlMeshTerminal) {
        const pty: vscode.Pseudoterminal = {
            onDidWrite: writeEmitter.event,
            open: () => { },
            close: () => { sqlMeshTerminal = undefined; },
            // Optional: Handle physical key presses if you want
            handleInput: (data) => {
                if (data === '\r') writeEmitter.fire('\r\n'); // Handle Enter
            }
        };

        sqlMeshTerminal = vscode.window.createTerminal({
            name: "SQLMesh Uvicorn",
            pty
        });
    }
    return sqlMeshTerminal;
}