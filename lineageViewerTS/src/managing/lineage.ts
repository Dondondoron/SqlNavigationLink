import { LineageInfo } from "../domain/domain";
import { Zoomer } from "./lineage-zoom";
import { LineageManager } from "./LineageManager";
import { MouseClicker } from "./MouseClick";


// Listen for messages coming from the extension backend
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'renderLineage') {
        renderLineage(message.data);
    }
});

const lineageManager = new LineageManager()

const mouseClicker = new MouseClicker(lineageManager)
Zoomer.getInstance().mouseClick = mouseClicker



export function renderLineage(data: LineageInfo) {
    const leftContainer = document.getElementById('left-nodes')!;
    const centerContainer = document.getElementById('center-nodes')!;
    const rightContainer = document.getElementById('right-nodes')!;

    const leftSizeLabel = document.getElementById('left-lineage-size-label')!;

    leftSizeLabel.textContent = data.size_left

    const rightSizeLabel = document.getElementById('right-lineage-size-label')!;

    rightSizeLabel.textContent = data.size_right


    // Clear previous content
    leftContainer.innerHTML = '';
    centerContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    lineageManager.initData(data)


}

