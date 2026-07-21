import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'sqlmesh-localite.context';

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = `
            <!DOCTYPE html>
            <html>
            <body>
                <h3>Python Extension Dashboard</h3>
                <button id="testBtn">Trigger Python Logic</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('testBtn').addEventListener('click', () => {
                        vscode.postMessage({ command: 'helloPython' });
                    });
                </script>
            </body>
            </html>
        `;
    }
}