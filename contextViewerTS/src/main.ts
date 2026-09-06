// contextViewerTS/src/main.ts


import './style.css';
import { EventManager } from './EventManager';
import { PathManager } from './PathManager';
import { PythonManager } from './PythonManager';


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
});




interface IncomingMessage {
    command: string;
    data?: any;
    selectedEnv?: string;
}


const pathManager = new PathManager();
const pythonManager = new PythonManager()

const eventManager = new EventManager(pathManager)

eventManager.refreshEventListener()

// Listen for messages coming from the extension backend
window.addEventListener('message', (event: MessageEvent<IncomingMessage>) => {
    const message = event.data;

    if (message.command === 'updatePaths') {
        pathManager.addPath(message.data);
    }
    if (message.command === 'updateContexts') {
        pathManager.updateContexts(message.data);
    }
    if (message.command === 'refreshPython') {
        pythonManager.refreshPython(message.data, message.selectedEnv);
    }
    if (message.command === 'setAutoLoadCheckBox') {
        const checkbox = document.getElementById('autoParse') as HTMLInputElement | null;
        if (checkbox) {
            checkbox.checked = message.data;
        }
    }
    if (message.command === 'setSaveCacheCheckbox') {
        const checkbox = document.getElementById('cacheContext') as HTMLInputElement | null;
        if (checkbox) {
            checkbox.checked = message.data;
        }
    }
});



