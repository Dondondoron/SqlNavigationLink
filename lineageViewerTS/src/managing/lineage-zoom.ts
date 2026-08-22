import { MouseClicker } from "./MouseClick";

export class Zoomer {

    static smoothing = 0.15;
    static zoomIntensity = 0.001;


    static instance?: Zoomer
    static getInstance() {
        if (!this.instance) {
            this.instance = new Zoomer()
        }
        return this.instance
    }
    private isAnimating = false

    public translateX = 0
    public translateY = 0
    public scale = 1

    private targetTranslateX = 0
    private targetTranslateY = 0
    private targetScale = 1

    private timestamp = Date.now()


    private isPanning = false;
    private panStartX = 0;
    private panStartY = 0;
    private panActualStartX = 0;
    private panActualStartY = 0;

    private canvasArea = document.getElementById('canvas-area')!
    private canvas = document.getElementById('lineage-container')!

    mouseClick!: MouseClicker

    constructor() {

        window.addEventListener('wheel', (e) => {
            this.handleWheel(e)
        }, { passive: false });

        window.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e)
        });

        window.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e)
        });

        window.addEventListener('mouseup', (e) => {
            this.handleMouseUp(e)
        });


    }

    getIsPanning() {
        return this.isPanning
    }



    private handleMouseDown(e: MouseEvent) {

        this.isPanning = true;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
        this.panActualStartX = e.clientX;
        this.panActualStartY = e.clientY;
        this.canvas.style.cursor = "grabbing";

    }

    private handleMouseMove(e: MouseEvent) {
        if (this.isPanning) {
            if (this.isAnimating) this.isAnimating = false;

            const dx = e.clientX - this.panStartX;
            const dy = e.clientY - this.panStartY;

            this.translateX += dx;
            this.translateY += dy;
            this.targetTranslateX = this.translateX;
            this.targetTranslateY = this.translateY;

            this.panStartX = e.clientX;
            this.panStartY = e.clientY;

            this.updateTransform();
        }
    }


    private handleMouseUp(e: MouseEvent) {

        if (this.isPanning) {
            this.isPanning = false;
            this.canvas.style.cursor = "default";

            const dx = e.clientX - this.panActualStartX;
            const dy = e.clientY - this.panActualStartY;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const threshold = 10;

            if (distance > threshold) {
                return;
            } else {
                this.mouseClick.onClick(e)
            }
        }
    }

    private handleWheel(e: WheelEvent) {


        e.preventDefault();


        if (e.shiftKey) {
            // Shift+scroll: pan horizontally instead of zoom
            const panAmount = e.deltaY; // positive: right, negative: left
            if (!this.isAnimating) {
                this.translateX -= panAmount;
                this.targetTranslateX = this.translateX;
                this.updateTransform();
            } else {
                this.targetTranslateX -= panAmount;
            }
            return;
        }
        if (e.ctrlKey) {
            // Shift+scroll: pan horizontally instead of zoom
            const panAmount = e.deltaY; // positive: right, negative: left
            if (!this.isAnimating) {
                this.translateY -= panAmount;
                this.targetTranslateY = this.translateY;
                this.updateTransform();
            } else {
                this.targetTranslateY -= panAmount;
            }
            return;
        }

        // Default: zoom
        const scrollDelta = -e.deltaY;

        if (!this.isAnimating) this.targetScale = this.scale;

        const mouseX = e.clientX
        const mouseY = e.clientY

        const worldMouseX = (mouseX - this.translateX) / this.scale;
        const worldMouseY = (mouseY - this.translateY) / this.scale;

        const newTargetScale = this.targetScale * Math.exp(scrollDelta * Zoomer.zoomIntensity);
        this.targetScale = Math.max(0.2, Math.min(3, newTargetScale));


        this.targetTranslateX = mouseX - worldMouseX * this.targetScale;
        this.targetTranslateY = mouseY - worldMouseY * this.targetScale;

        if (!this.isAnimating) {
            this.isAnimating = true;
            requestAnimationFrame(() => this.animateZoom());
        }
    }

    private animateZoom() {
        if (!this.isAnimating) return;



        this.scale += (this.targetScale - this.scale) * Zoomer.smoothing;
        this.translateX += (this.targetTranslateX - this.translateX) * Zoomer.smoothing;
        this.translateY += (this.targetTranslateY - this.translateY) * Zoomer.smoothing;
        this.updateTransform();

        const scaleDiff = Math.abs(this.targetScale - this.scale);
        const txDiff = Math.abs(this.targetTranslateX - this.translateX);
        const tyDiff = Math.abs(this.targetTranslateY - this.translateY);

        if (scaleDiff < 0.001 && txDiff < 0.001 && tyDiff < 0.001) {
            this.scale = this.targetScale;
            this.translateX = this.targetTranslateX;
            this.translateY = this.targetTranslateY;
            this.isAnimating = false;
        } else {
            requestAnimationFrame(() => this.animateZoom());
        }
    }



    private updateTransform() {
        this.update(this.scale, this.translateX, this.translateY);
        this.canvas.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        const bgSpacing = 50 * this.scale;
        this.canvasArea.style.backgroundSize = `100% ${bgSpacing}%`;
    }

    private update(scale: number, tx: number, ty: number) {
        this.scale = scale;
        this.translateX = tx;
        this.translateY = ty;

        this.scale = scale;
        this.translateX = tx;
        this.translateY = ty;
        this.timestamp = Date.now();


    }

}

