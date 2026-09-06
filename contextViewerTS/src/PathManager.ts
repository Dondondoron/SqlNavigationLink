import { GenericContext, SQLMeshContext } from "./context/Context";
import { ContextItem, SQLMeshItem } from "./context/SqlMeshContext";
import { Utility } from "./utils/Utility";

interface PathItemData {
    filePath?: string;
    type: string;
}




export class PathManager {
    pathContainer: HTMLElement
    contextItems: ContextItem[] = []

    constructor() {
        this.pathContainer = document.getElementById('pathContainer') as HTMLElement
    }


    showNewContextButtons() {
        const newContextContainer = document.getElementById('newContextContainer')
        newContextContainer!.classList.remove('hidden');
    }
    hideNewContextButtons() {
        const newContextContainer = document.getElementById('newContextContainer')
        newContextContainer!.classList.add('hidden');
    }


    updateContexts(data: GenericContext[]): void {

        this.contextItems.forEach(c=> c.container.remove())

        data.forEach(d=>{
            this.addPath(d)
        })
    }

    addPath(data: GenericContext): void {

        const item = data.type === 'SQLMESH' ? new SQLMeshItem(data as SQLMeshContext) : new ContextItem(data)
        this.pathContainer.appendChild(item.container)
        this.contextItems.push(item)
    }


    updateRootPath(data: SQLMeshContext): void {
        const item = this.contextItems.find(item => item.rootPath === data.rootPath && item.type === "SQLMESH") as SQLMeshItem

        item.init(data)

    }


    createPathItem(d: PathItemData): string {
        return `
        <div class="path-row">
            <input readonly class="path-input" value="${Utility.escapeHtml(d.filePath || '')}" placeholder="Path to model folder..." />

            <button data-action="changePathType" data-value="${Utility.escapeHtml(d.filePath || '')}" type="button" class="sqltype-button">
                ${Utility.escapeHtml(d.type)}
            </button>

            <button data-action="parsePath" data-value="${Utility.escapeHtml(d.filePath || '')}" type="button" class="icon-button">
                Parse
            </button>
            <button data-action="removePath" data-value="${Utility.escapeHtml(d.filePath || '')}" type="button" class="icon-button">
                x
            </button>
        </div>
    `.trim();
    }

    updatePaths(data: PathItemData[]): void {
        const pathContainer = document.getElementById('pathContainer');
        if (!pathContainer) return;

        pathContainer.innerHTML = '';
        data.forEach(d => {
            pathContainer.insertAdjacentHTML('beforeend', this.createPathItem(d));
        });


    }

}