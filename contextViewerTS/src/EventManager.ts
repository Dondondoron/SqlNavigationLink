import { PathManager } from "./PathManager";
import { Utility } from "./utils/Utility";


export class EventManager {

    constructor(private pathManager: PathManager) {

    }

    refreshEventListener(): void {
        document.removeEventListener('click', this.clickEvent.bind(this));
        document.addEventListener('click', this.clickEvent.bind(this));
    }


    clickEvent(e: MouseEvent) {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const actionButton = target.closest('button[data-action]') as HTMLElement | null;

        if (actionButton) {
            e.stopPropagation();
            const action = actionButton.dataset.action;

            if (action === 'addPath') {
                this.pathManager.showNewContextButtons();
            } else if (action === 'requestRootPath') {
                this.pathManager.hideNewContextButtons();
                Utility.post(action, actionButton.dataset.value);
            } else if (action === 'addConfigPath') {
                Utility.post(action, actionButton.dataset.value);
            } else if (action === 'parsePath') {
                Utility.post(action, actionButton.dataset.value);
            } else if (action === 'removePath') {
                Utility.post(action, actionButton.dataset.value);
            } else if (action === 'removeContext') {
                Utility.post(action, actionButton.dataset.value);
            } else if (action === 'removeConfigPath') {
                Utility.post(action, actionButton.dataset.path, actionButton.dataset.rootPath);
            } else if (action === 'changePathType') {
                Utility.post(action, actionButton.dataset.value);
            } else if (action) {
                Utility.post(action);
            }

            return;
        }

        const autoParseCheckbox = target.closest('#autoParse') as HTMLInputElement | null;
        if (autoParseCheckbox) {
            e.stopPropagation();
            Utility.post('autoContext', autoParseCheckbox.checked);
            return;
        }

        const pyPkgSection = target.closest('.py-pkg-section');
        if (pyPkgSection) return;

        const card = target.closest('.py-card') as HTMLElement | null;
        if (card) {
            e.stopPropagation();

            document.querySelectorAll('.py-card').forEach(d => d.classList.remove('selected'));

            Utility.post('changeSelectedEnv', card.id);

            card.classList.add('selected');

            const currentPyDiv = document.getElementById("current-py-env-div");
            if (currentPyDiv && card.dataset.venvName) {
                currentPyDiv.textContent = card.dataset.venvName;
            }
            return;
        }
    };


}