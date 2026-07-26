import * as vscode from 'vscode';

export class ParseViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'sqlNavLinkParser';

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