import { LineageInfo } from "../domain/domain";
import { Card } from "./Card";
import { Zoomer } from "./lineage-zoom";





export class LineageManager {



    centerCard?: Card

    svg: SVGElement
    connections: { a: Element; b: Element; }[] = [];

    constructor() {

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.svg.classList.add('svg')

        const canvasArea = document.getElementById('canvas-area')!
        const lineageArea = document.getElementById('lineage-container')!


        lineageArea.appendChild(this.svg)
    }


    initData(data: LineageInfo) {


        const centerContainer = document.getElementById('center-nodes')!;
        const rightContainer = document.getElementById('right-nodes')!;

        Card.card_stack.clear()

        // Center Node

        const centerCard = new Card(data.centerModel, true)
        this.centerCard = centerCard
        centerContainer.appendChild(centerCard.cardContainer);


        // Right Nodes
        if (data.rightRefs && data.rightRefs.length > 0) {
            data.rightRefs.forEach((ref: any) => {
                const rightCard = new Card(ref, false, 'right', centerCard);
                centerCard.childCards.set(rightCard.id, rightCard)
                rightContainer.appendChild(rightCard.cardContainer);
            });
        } else {
            rightContainer.innerHTML = '<div class="empty-state">None</div>';
        }

    }

    showLineageOnCard(cardId: string, column: any) {


        const focusCard = Card.card_stack.get(cardId)

        if (focusCard && focusCard.isCenter) {

            document.querySelectorAll('.field-item').forEach(c => {
                c.classList.remove('selected')
            })

            Card.card_stack.forEach(card => {
                card.reset()
                if (card !== this.centerCard) card.showFieldsContainer(false)

            })

            const connections = focusCard?.showLineage(column, [], null)

            this.connections = connections

            this.paintConnections(connections)
        }


    }

    clearPaths() {
        this.svg.replaceChildren();
    }

    repaint() {
        this.paintConnections(this.connections)
    }

    paintConnections(connections: { a: Element; b: Element; }[]) {
    // Ensure existing rendered paths are cleared if needed before redrawing
    this.svg.replaceChildren();

    const svgRect = this.svg.getBoundingClientRect();
    const zoomer = Zoomer.getInstance();

    const scale = zoomer.scale || 1;

    connections.forEach(con => {
        const rectA = con.a.getBoundingClientRect();
        const rectB = con.b.getBoundingClientRect();

        // Account for SVG container offset, pan (translate), and zoom (scale)
        const fromX = (rectA.right - svgRect.left ) / scale;
        const fromY = (rectA.top + rectA.height / 2 - svgRect.top ) / scale;

        const toX = (rectB.left - svgRect.left ) / scale;
        const toY = (rectB.top + rectB.height / 2 - svgRect.top ) / scale;

        // Generate bezier path data in the canvas/world coordinate space
        const pathData = LineageManager.createHorizontalCurvedPath(fromX, fromY, toX, toY);

        // Create and append SVG path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke-width', String(2 / scale)); // Optional: keeps stroke width consistent when zooming
        path.setAttribute('fill', 'none');

        this.svg.appendChild(path);
    });
}

    static createHorizontalCurvedPath(fromX: number, fromY: number, toX: number, toY: number): string {
        if (toX < fromX) {
            [fromX, toX] = [toX, fromX];
            [fromY, toY] = [toY, fromY];
        }

        const desiredOffset = 0;
        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 1) return `M ${fromX},${fromY}`;

        const offset = Math.min(desiredOffset, distance / 2);

        const startX = fromX + (deltaX / distance) * offset;
        const startY = fromY + (deltaY / distance) * offset;
        const endX = toX - (deltaX / distance) * offset;
        const endY = toY - (deltaY / distance) * offset;

        const dy = Math.abs(endY - startY);
        const lerped = Math.max((Math.min(((dy - 100) / 400), 1)), 0);

        const dx = Math.abs(endX - startX);
        const baseCurve = 400;
        const minCurve = 20;
        const curve = Math.max(baseCurve / ((dx - 50) / 250 + 1), minCurve) * lerped;

        return `M ${startX},${startY} C ${startX + curve},${startY} ${endX - curve},${endY} ${endX},${endY}`;
    }

}