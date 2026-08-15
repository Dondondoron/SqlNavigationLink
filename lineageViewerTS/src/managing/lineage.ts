import { LineageInfo } from "../domain/domain";
import { getVsCodeApi } from "../utils/vscodeAPI";
import { Card } from "./Card";
import { LineageManager } from "./LineageManager";

const vscode = getVsCodeApi();

// Listen for messages coming from the extension backend
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'renderLineage') {
        renderLineage(message.data);
    }
});

const lineageManager = new LineageManager()




const eventListener = (e: Event) => {

    if (!(e.target instanceof HTMLElement)) return;

    const changeSizeButton = e.target?.closest('button[data-action]');

    if (changeSizeButton instanceof HTMLElement) {
        e.stopPropagation();
        const action = changeSizeButton.dataset.action;

        if (action === 'left-decrease' || action === 'left-increase') {

            const sizeLabel = document.getElementById('left-lineage-size-label')!;
            let currentSize = Number(sizeLabel.textContent)
            if (currentSize > 1 && action === 'left-decrease') currentSize = currentSize - 1
            else if (currentSize < 12 && action === 'left-increase') currentSize = currentSize + 1
            sizeLabel.textContent = currentSize + ''

            post(action);
        }
        if (action === 'right-decrease' || action === 'right-increase') {

            const sizeLabel = document.getElementById('right-lineage-size-label')!;
            let currentSize = Number(sizeLabel.textContent)
            if (currentSize > 1 && action === 'right-decrease') currentSize = currentSize - 1
            else if (currentSize < 12 && action === 'right-increase') currentSize = currentSize + 1
            sizeLabel.textContent = currentSize + ''

            post(action);
        }
        return;
    }

    const button = e.target.closest('.fieldButton');
    if (button instanceof HTMLElement) {
        e.stopPropagation();

        const card = Card.card_stack.get(button.dataset.id??'')

        if (card) {

            card.toggle()

            lineageManager.repaint()
        }
        return;
    }


    const columnItem = e.target.closest('.column-item');
    if (columnItem instanceof HTMLElement) {

        const cardContainer = e.target.closest('.card_container') as any


        const column = columnItem.dataset.column

        lineageManager.showLineageOnCard(cardContainer?.dataset.id!, column)

        return;

    }

    const card = e.target.closest('.node-card');
    if (card) {
        const headerSpan = card.querySelector('header span');
        if (headerSpan?.textContent) {
            post('browse', headerSpan.textContent)
            return
        }
    }

}

function post(command: string, ...args: any[]) {
    lineageManager.clearPaths()
    vscode?.postMessage({
        command: command,
        args: args
    })
}


export function renderLineage(data: LineageInfo) {
    const leftContainer = document.getElementById('left-nodes')!;
    const centerContainer = document.getElementById('center-nodes')!;
    const rightContainer = document.getElementById('right-nodes')!;

    const leftSizeLabel = document.getElementById('left-lineage-size-label')!;

    leftSizeLabel.textContent = data.size_left

    const rightSizeLabel = document.getElementById('right-lineage-size-label')!;

    rightSizeLabel.textContent = data.size_right

    document.removeEventListener('click', eventListener)
    document.addEventListener('click', eventListener)

    // Clear previous content
    leftContainer.innerHTML = '';
    centerContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    lineageManager.initData(data)


}

let currentScale = 1;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3.0;
const ZOOM_SPEED = 0.1;


document.removeEventListener('click', eventListener)
document.addEventListener('click', eventListener)