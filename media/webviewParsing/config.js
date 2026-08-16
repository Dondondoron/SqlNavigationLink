const vscode = acquireVsCodeApi();

const defaultVSIconFolder = '{{def_icon_uri}}'
const extensionIconFolder = '{{ext_icon_uri}}'

// Listen for messages coming from the extension backend
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'updatePaths') {
        updatePaths(message.data);
    }
    if (message.command === 'refreshPython') {
        refreshPython(message.data, message.selectedEnv);
    }
    if (message.command === 'setAutoLoadCheckBox') {
        const checkbox = document.getElementById('autoParse')
        checkbox.checked = message.data
    }
});

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

eventListener = (e) => {

    const actionButton = e.target.closest('button[data-action]');

    if (actionButton) {
        e.stopPropagation();
        const action = actionButton.dataset.action;

        if (action === 'addPath') {
            post(action);
        }
        else if (action === 'parsePath') {
            post(action, actionButton.dataset.value);
        }
        else if (action === 'removePath') {
            post(action, actionButton.dataset.value);
        }
        else if (action === 'changePathType') {
            post(action, actionButton.dataset.value);
        }
        else{
            post(action)
        }

        return;
    }
    
    const autoParseCheckbox = e.target.closest('#autoParse');
    if(autoParseCheckbox){
        e.stopPropagation()

        post('autoContext', autoParseCheckbox.checked)
        return
    }

    const pyPkgSection = e.target.closest('.py-pkg-section');
    if (pyPkgSection) return

    const card = e.target.closest('.py-card');
    if (card) {
        e.stopPropagation();

        document.querySelectorAll('.py-card').forEach(d => d.classList.remove('selected'))

        post('changeSelectedEnv', card.id)

        card.classList.add('selected')

        const currentPyDiv = document.getElementById("current-py-env-div");
        if (currentPyDiv) {
            currentPyDiv.textContent = card.dataset.venvName
        }
        return;
    }

}

function post(command, ...args) {
    vscode.postMessage({
        command: command,
        args: args
    })
}


function refreshEventListener() {
    document.removeEventListener('click', eventListener)
    document.addEventListener('click', eventListener)
}

function createPathItem(d) {
    const sqltypeIcon = `${extensionIconFolder}/${d.type.toLowerCase()}_icon.svg`;
    const trashIcon = `${defaultVSIconFolder}/trash.svg`;

    return `
        <div class="path-row">
            <input readonly class="path-input" value="${d.filePath || ''}" placeholder="Path to model folder..." />

            <button data-action="changePathType" data-value="${d.filePath}" type="button" class="sqltype-button">
                ${d.type}
            </button>

            <button data-action="parsePath" data-value="${d.filePath}" type="button" class="icon-button">
                Parse
            </button>
            <button data-action="removePath" data-value="${d.filePath}" type="button" class="icon-button">
                x
            </button>
        </div>
    `.trim();

}


function updatePaths(data) {

    const pathContainer = document.getElementById('pathContainer')
    pathContainer.innerHTML = ''
    data.forEach(d => {
        pathContainer.insertAdjacentHTML('beforeend', createPathItem(d));
    });

    refreshEventListener()
}


function refreshPython(data, selectedEnv) {
    const pythonContainer = document.getElementById("python-env-content");
    pythonContainer.innerHTML = ""; // Clear existing cards before rendering

    data.forEach(pyenv => {
        pythonContainer.appendChild(createPythonEnvCard(pyenv));
    });

    if (selectedEnv) {
        const currentPyDiv = document.getElementById("current-py-env-div");
        const card = document.getElementById(selectedEnv)
        card.classList.add('selected')
        currentPyDiv.textContent = card.dataset.venvName

    }
}

function createPythonEnvCard(pyenv) {
    const card = document.createElement('div');
    card.className = 'py-card';
    card.id = pyenv.path
    card.dataset.venvName = pyenv.venvName

    // 1. Card Header & Main Info
    const cardHeader = document.createElement('div');
    cardHeader.className = 'py-card-header';
    cardHeader.innerHTML = `
        <div class="py-card-title-row">
            <h3 class="py-env-name">${escapeHtml(pyenv.venvName || 'Python Environment')}</h3>
            <span class="py-source-badge">${escapeHtml(pyenv.source || 'env')}</span>
        </div>
        <div class="py-card-details">
            <p><strong>Path:</strong> <code>${escapeHtml(pyenv.path)}</code></p>
            <p><strong>Executable:</strong> <code>${escapeHtml(pyenv.pythonExecutable)}</code></p>
        </div>
    `;
    card.appendChild(cardHeader);

    // 2. Packages Section (Collapsible)
    if ((pyenv.packages && pyenv.packages.length > 0) || pyenv.missingPackages && pyenv.missingPackages.length > 0) {
        const pkgSection = document.createElement('details');
        pkgSection.className = 'py-pkg-section';

        const isMissingPackages = pyenv.missingPackages?.length??0 === 0 ? true : false

        const summary = document.createElement('summary');
        if(isMissingPackages) summary.className = 'missing'
        summary.textContent = `Packages (${pyenv.packages.length})`;
        pkgSection.appendChild(summary);

        const pkgListMissing = document.createElement('ul');
        pkgListMissing.className = 'py-pkg-list missing';
        
        pyenv.missingPackages?.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="pkg-name">${escapeHtml(p.name)}</span> <span class="pkg-version">v${escapeHtml(p.version)}</span>`;
            pkgListMissing.appendChild(li);
        });


        const pkgList = document.createElement('ul');
        pkgList.className = 'py-pkg-list';

        pyenv.packages?.forEach(p => {
            const li = document.createElement('li');
            if(p.relevant) li.className = 'relevant'
            li.innerHTML = `<span class="pkg-name">${escapeHtml(p.name)}</span> <span class="pkg-version">v${escapeHtml(p.version)}</span>`;
            pkgList.appendChild(li);
        });

        if(isMissingPackages)pkgSection.appendChild(pkgListMissing);
        pkgSection.appendChild(pkgList);
        card.appendChild(pkgSection);
    }

    return card;
}

// Utility to prevent XSS in webview content
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
refreshEventListener()