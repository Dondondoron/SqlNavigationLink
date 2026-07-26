import * as vscode from 'vscode';

export class ControlPanelProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly context: vscode.ExtensionContext,
    ) { }
    private _view?: vscode.WebviewView;

    
    enableButtons(enable: boolean = true) {
        if (this._view) {
            this._view.webview.postMessage({ command: 'setButtonState', enabled: enable });
        }
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = { enableScripts: true };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
       
        
        webviewView.webview.onDidReceiveMessage(data => {

            switch (data.command) {
                case 'plan':
                    vscode.commands.executeCommand('sql-nav-link.parsePaths');
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        padding: 10px;
                        color: var(--vscode-foreground);
                        font-family: var(--vscode-font-family);
                    }
                    button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        filter: grayscale(1);
                    }
                    h3 {
                        margin-bottom: 10px;
                        font-size: 0.9em;
                        text-transform: uppercase;
                        opacity: 0.8;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    /* Styling the checkbox area to look like VS Code */
                    .checkbox-container {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        font-size: 0.85em;
                        margin-bottom: 5px;
                    }
                    .checkbox-container input {
                        cursor: pointer;
                        width: auto; /* Overriding your global input style */
                    }
                    input[type="text"] {
                        background: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        padding: 6px;
                        border-radius: 2px;
                        outline: none;
                    }
                    input[type="text"]:focus {
                        border: 1px solid var(--vscode-focusBorder);
                    }
                    button {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        width: 100%;
                        padding: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        border-radius: 2px;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    .secondary-btn {
                        background-color: var(--vscode-button-secondaryBackground);
                        color: var(--vscode-button-secondaryForeground);
                    }
                    .secondary-btn:hover {
                        background-color: var(--vscode-button-secondaryHoverBackground);
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <button id="planBtn">Parse</button>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'setButtonState':
                                const buttons = document.querySelectorAll('button');
                                buttons.forEach(btn => btn.disabled = !message.enabled);
                                break;
                        }
                    });

                    function sendMessage(command, data = {}) {
                        vscode.postMessage({
                            command: command,
                            ...data
                        });
                    }

                    // Event Listeners
                    document.getElementById('planBtn').addEventListener('click', () => sendMessage('plan'));
                    
                </script>
            </body>
            </html>`;
    }
}