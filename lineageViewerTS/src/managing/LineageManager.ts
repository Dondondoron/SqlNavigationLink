import { LineageInfo } from "../domain/domain";
import { Card } from "./Card";
import { Zoomer } from "./lineage-zoom";


interface ColumnConfig {
    id: string;
    title: string;
    nodesId: string;
}

class ModelStructure {
    private sectionElement: HTMLDivElement;
    private nodeContainers: Map<string, HTMLElement> = new Map();

    constructor() {
        this.sectionElement = this.buildStructure();
    }

    private buildStructure(): HTMLDivElement {
        const columns: ColumnConfig[] = [
            { id: 'left-col', title: 'Upstream (Refs)', nodesId: 'left-nodes' },
            { id: 'center-col', title: 'Current Model', nodesId: 'center-nodes' },
            { id: 'right-col', title: 'Downstream (Referenced By)', nodesId: 'right-nodes' }
        ];

        const section = document.createElement('div');
        section.className = 'section';

        columns.forEach(col => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'column';
            columnDiv.id = col.id;

            const titleDiv = document.createElement('div');
            titleDiv.className = 'col-title';
            titleDiv.textContent = col.title;

            const nodesDiv = document.createElement('div');
            nodesDiv.className = 'nodes';
            nodesDiv.id = col.nodesId;

            columnDiv.appendChild(titleDiv);
            columnDiv.appendChild(nodesDiv);
            section.appendChild(columnDiv);

            // Cache reference for easier node insertion later
            this.nodeContainers.set(col.nodesId, nodesDiv);
        });

        return section;
    }

    /**
     * Mounts the structure into a target DOM container.
     */
    public mount(containerId: string): void {
        const parent = document.getElementById(containerId);
        if (parent) {
            parent.appendChild(this.sectionElement);
        } else {
            console.error(`Container with ID "${containerId}" not found.`);
        }
    }

    /**
     * Retrieves a specific nodes container element by its ID (e.g., 'left-nodes').
     */
    public getNodeContainer(nodesId: string): HTMLElement | undefined {
        return this.nodeContainers.get(nodesId);
    }

    /**
     * Returns the main section element.
     */
    public getElement(): HTMLDivElement {
        return this.sectionElement;
    }
}

export class LineageManager {



    centerCard?: Card


    structures: ModelStructure[] = []

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

        this.structures.forEach(structure => {
            structure.getElement().remove()
        })
        this.structures = []

        this.clearPaths()

        Card.card_stack.clear()


        data.centerModels.forEach(centerModel => {

            const modelStructure = new ModelStructure()

            modelStructure.mount('lineage-container')

            this.structures.push(modelStructure)


            const centerContainer = modelStructure.getNodeContainer('center-nodes')!;
            const rightContainer = modelStructure.getNodeContainer('right-nodes')!;
            const leftContainer = modelStructure.getNodeContainer('left-nodes')!;

            // Center Node

            const centerCard = new Card(centerModel, true, undefined, undefined, leftContainer)
            this.centerCard = centerCard
            centerContainer.appendChild(centerCard.cardContainer);


            // Right Nodes
            if (centerModel.rightRefs && centerModel.rightRefs.length > 0) {
                centerModel.rightRefs.forEach((ref: any) => {
                    const rightCard = new Card(ref, false, 'right', centerCard);
                    centerCard.childCards.set(rightCard.id, rightCard)
                    rightContainer.appendChild(rightCard.cardContainer);
                });
            } else {
                rightContainer.innerHTML = '<div class="empty-state">None</div>';
            }


        })

    }

    showLineageOnCard(cardId: string, column: any, detailed: boolean = false) {

        this.clearPaths()


        const focusCard = Card.card_stack.get(cardId)

        if (focusCard && focusCard.isCenter) {

            document.querySelectorAll('.field-item').forEach(c => {
                c.classList.remove('selected')
            })

            Card.card_stack.forEach(card => {
                card.reset()
                if (!card.isCenter) card.showFieldsContainer(false)

            })

            if (detailed) {
                Card.card_stack.forEach(c => {
                    if (!c.isCenter) {
                        c.hideFields()
                    }
                })
            }

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