import { Utility } from "./utils/Utility";

interface PackageInfo {
    name: string;
    version: string;
    relevant?: boolean;
}

interface PythonEnvData {
    path: string;
    venvName: string;
    source?: string;
    pythonExecutable: string;
    packages?: PackageInfo[];
    missingPackages?: PackageInfo[];
}


export class PythonManager {


    refreshPython(data: PythonEnvData[], selectedEnv?: string): void {
        const pythonContainer = document.getElementById("python-env-content");
        if (!pythonContainer) return;

        pythonContainer.innerHTML = "";

        data.forEach(pyenv => {
            pythonContainer.appendChild(this.createPythonEnvCard(pyenv));
        });

        if (selectedEnv) {
            const currentPyDiv = document.getElementById("current-py-env-div");
            const card = document.getElementById(selectedEnv) as HTMLElement | null;
            if (card) {
                card.classList.add('selected');
                if (currentPyDiv && card.dataset.venvName) {
                    currentPyDiv.textContent = card.dataset.venvName;
                }
            }
        }
    }


    createPythonEnvCard(pyenv: PythonEnvData): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'py-card';
    card.id = pyenv.path;
    card.dataset.venvName = pyenv.venvName;

    const cardHeader = document.createElement('div');
    cardHeader.className = 'py-card-header';
    cardHeader.innerHTML = `
        <div class="py-card-title-row">
            <h3 class="py-env-name">${Utility.escapeHtml(pyenv.venvName || 'Python Environment')}</h3>
            <span class="py-source-badge">${Utility.escapeHtml(pyenv.source || 'env')}</span>
        </div>
        <div class="py-card-details">
            <p><strong>Path:</strong> <code>${Utility.escapeHtml(pyenv.path)}</code></p>
            <p><strong>Executable:</strong> <code>${Utility.escapeHtml(pyenv.pythonExecutable)}</code></p>
        </div>
    `;
    card.appendChild(cardHeader);

    const hasPackages = pyenv.packages && pyenv.packages.length > 0;
    const hasMissingPackages = pyenv.missingPackages && pyenv.missingPackages.length > 0;

    if (hasPackages || hasMissingPackages) {
        const pkgSection = document.createElement('details');
        pkgSection.className = 'py-pkg-section';

        const isMissingPackages = (pyenv.missingPackages?.length ?? 0) === 0 ? false : true;

        const summary = document.createElement('summary');
        if (isMissingPackages) summary.className = 'missing';
        summary.textContent = `Packages (${pyenv.packages?.length ?? 0})`;
        pkgSection.appendChild(summary);

        const pkgListMissing = document.createElement('ul');
        pkgListMissing.className = 'py-pkg-list missing';
        
        pyenv.missingPackages?.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="pkg-name">${Utility.escapeHtml(p.name)}</span> <span class="pkg-version">v${Utility.escapeHtml(p.version)}</span>`;
            pkgListMissing.appendChild(li);
        });

        const pkgList = document.createElement('ul');
        pkgList.className = 'py-pkg-list';

        pyenv.packages?.forEach(p => {
            const li = document.createElement('li');
            if (p.relevant) li.className = 'relevant';
            li.innerHTML = `<span class="pkg-name">${Utility.escapeHtml(p.name)}</span> <span class="pkg-version">v${Utility.escapeHtml(p.version)}</span>`;
            pkgList.appendChild(li);
        });

        if (isMissingPackages) pkgSection.appendChild(pkgListMissing);
        pkgSection.appendChild(pkgList);
        card.appendChild(pkgSection);
    }

    return card;
}
}