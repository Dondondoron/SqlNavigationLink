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

    showLineageOnCard(cardId: string, column: any, detailed: boolean = false) {


        const focusCard = Card.card_stack.get(cardId)

        if (focusCard && focusCard.isCenter) {

            document.querySelectorAll('.field-item').forEach(c => {
                c.classList.remove('selected')
            })

            Card.card_stack.forEach(card => {
                card.reset()
                if (card !== this.centerCard) card.showFieldsContainer(false)

            })

            const connections = detailed ? focusCard?.showFullLineage(column, [], null) : focusCard?.showLineage(column, [], null)

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
            const fromX = (rectA.right - svgRect.left) / scale;
            const fromY = (rectA.top + rectA.height / 2 - svgRect.top) / scale;

            const toX = (rectB.left - svgRect.left) / scale;
            const toY = (rectB.top + rectB.height / 2 - svgRect.top) / scale;

            // Generate bezier path data in the canvas/world coordinate space
            const pathData = LineageManager.createHorizontalCurvedPathCooooler(fromX, fromY, toX, toY);

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

    static createHorizontalCurvedPathEasy(fromX: number, fromY: number, toX: number, toY: number): string {
        if (toX < fromX) {
            [fromX, toX] = [toX, fromX];
            [fromY, toY] = [toY, fromY];
        }

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 1) return `M ${fromX},${fromY}`;

        // Give it a mild, smooth curve proportional to the horizontal distance, 
        // but clamped so it doesn't get too wild or too flat.
        const curve = Math.min(Math.max(deltaX * 0.1, 30), 150);

        return `M ${fromX},${fromY} C ${fromX + curve},${fromY} ${toX - curve},${toY} ${toX},${toY}`;
    }
    static createHorizontalCurvedPathThree(fromX: number, fromY: number, toX: number, toY: number): string {
        if (toX < fromX) {
            [fromX, toX] = [toX, fromX];
            [fromY, toY] = [toY, fromY];
        }

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const distanceY = Math.sqrt(deltaY * deltaY);

        if (distance < 1) return `M ${fromX},${fromY}`;

        // Define a moderate curve magnitude based on distance
        const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);

        // First control point stays close to start (straight departure)
        const ctrl1X = fromX + curve * 2;
        const ctrl1Y = fromY;

        // Second control point is pulled far back from the end (immediate curve on arrival)
        const ctrl2X = toX - curve;
        const ctrl2Y = toY;

        return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }

    static createHorizontalCurvedPathCool(fromX: number, fromY: number, toX: number, toY: number): string {
        if (toX < fromX) {
            [fromX, toX] = [toX, fromX];
            [fromY, toY] = [toY, fromY];
        }

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 1) return `M ${fromX},${fromY}`;

        // Define a moderate curve magnitude based on distance
        const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);

        // First control point stays close to start (straight horizontal departure)
        const ctrl1X = fromX + curve * 0.2;
        const ctrl1Y = fromY;

        // Second control point X is aligned with toX
        const ctrl2X = toX;
        let ctrl2Y = toY;

        // Determine approach direction based on vertical difference
        const diffY = toY - fromY;
        const threshold = 10;

        if (Math.abs(diffY) <= threshold) {
            return `M ${fromX},${fromY} L ${toX},${toY}`;
        }

        if (Math.abs(diffY) <= threshold) {
            // Close by: approach horizontally
            ctrl2Y = toY;
        } else if (diffY > 0) {
            // Destination is lower down (fromY is higher): approach from above (coming down)
            ctrl2Y = toY - curve;
        } else {
            // Destination is higher up (fromY is lower): approach from below (coming up)
            ctrl2Y = toY + curve;
        }

        return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }
    static createHorizontalCurvedPathCooooler(fromX: number, fromY: number, toX: number, toY: number): string {
        if (toX < fromX) {
            [fromX, toX] = [toX, fromX];
            [fromY, toY] = [toY, fromY];
        }

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 1) return `M ${fromX},${fromY}`;

        // Define a moderate curve magnitude based on distance
        const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);

        // First control point stays close to start (straight horizontal departure)
        const ctrl1X = fromX + curve * 0.2;
        const ctrl1Y = fromY;

        // Determine vertical relationship
        const diffY = toY - fromY;
        const threshold = 10;

        let ctrl2X = toX;
        let ctrl2Y = toY;

        if (Math.abs(diffY) <= threshold) {
            // Close by: approach horizontally
            return `M ${fromX},${fromY} L ${toX},${toY}`;
            ctrl2X = toX - curve;
            ctrl2Y = toY;
        } else {
            // 80% vertical / 20% horizontal blend
            const verticalSign = diffY > 0 ? -1 : 1; // if destination is lower, approach from above (-Y); if higher, from below (+Y)

            ctrl2Y = toY + (curve * 0.8 * verticalSign);
            ctrl2X = toX - (curve * 0.2); // slight horizontal pull back from the destination
        }

        return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }
}