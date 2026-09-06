import { Utility } from "../utils/Utility";
import { Card } from "./Card";
import { LineageManager } from "./LineageManager";



export class MouseClicker {


    constructor(private lineageManager: LineageManager){}

    onClick(e: MouseEvent) {

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

                Utility.post(action);
            }
            if (action === 'right-decrease' || action === 'right-increase') {

                const sizeLabel = document.getElementById('right-lineage-size-label')!;
                let currentSize = Number(sizeLabel.textContent)
                if (currentSize > 1 && action === 'right-decrease') currentSize = currentSize - 1
                else if (currentSize < 12 && action === 'right-increase') currentSize = currentSize + 1
                sizeLabel.textContent = currentSize + ''

                Utility.post(action);
            }
            return;
        }

        const button = e.target.closest('.fieldButton');
        if (button instanceof HTMLElement) {
            e.stopPropagation();

            const card = Card.card_stack.get(button.dataset.id ?? '')

            if (card) {

                card.toggle()

                this.lineageManager.repaint()
            }
            return;
        }


        const columnItem = e.target.closest('.column-item');
        if (columnItem instanceof HTMLElement) {

            const cardContainer = e.target.closest('.card_container') as any
            if(cardContainer.dataset.direction !== 'center')return
            const column = columnItem.dataset.column

            this.lineageManager.showLineageOnCard(cardContainer?.dataset.id!, column, e.ctrlKey)

            return;

        }

        const card = e.target.closest('.node-card');
        if (card) {
            const headerSpan = card.querySelector('header span');
            if (headerSpan?.textContent) {
                Utility.post('browse', headerSpan.textContent)
                return
            }
        }

    }


}