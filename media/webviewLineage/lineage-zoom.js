

const smoothing = 0.15;
const zoomIntensity = 0.001;

let isAnimating = false

let translateX = 0
let translateY = 0
let scale = 1

let targetTranslateX = 0
let targetTranslateY = 0
let targetScale = 1

let timestamp = Date.now()


let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panActualStartX = 0;
let panActualStartY = 0;


const canvasArea = document.getElementById('canvas-area')
const canvas = document.getElementById('lineage-container')

function handleMouseDown(e) {

    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panActualStartX = e.clientX;
    panActualStartY = e.clientY;
    canvas.style.cursor = "grabbing";

}

function handleMouseMove(e) {
    if (isPanning) {
        if (isAnimating) isAnimating = false;

        const dx = e.clientX - panStartX;
        const dy = e.clientY - panStartY;

        translateX += dx;
        translateY += dy;
        targetTranslateX = translateX;
        targetTranslateY = translateY;

        panStartX = e.clientX;
        panStartY = e.clientY;

        updateTransform();
    }
}


function handleMouseUp(e) {

    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = "default";

        const dx = e.clientX - panActualStartX;
        const dy = e.clientY - panActualStartY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 10;

        if (distance > threshold) {
            return;
        }
    }
}

function handleWheel(e) {


    e.preventDefault();


    if (e.shiftKey) {
        // Shift+scroll: pan horizontally instead of zoom
        const panAmount = e.deltaY; // positive: right, negative: left
        if (!isAnimating) {
            translateX -= panAmount;
            targetTranslateX = translateX;
            updateTransform();
        } else {
            targetTranslateX -= panAmount;
        }
        return;
    }
    if (e.ctrlKey) {
        // Shift+scroll: pan horizontally instead of zoom
        const panAmount = e.deltaY; // positive: right, negative: left
        if (!isAnimating) {
            translateY -= panAmount;
            targetTranslateY = translateY;
            updateTransform();
        } else {
            targetTranslateY -= panAmount;
        }
        return;
    }

    // Default: zoom
    const scrollDelta = -e.deltaY;

    if (!isAnimating) targetScale = scale;

    const mouseX = e.clientX
    const mouseY = e.clientY

    const worldMouseX = (mouseX - translateX) / scale;
    const worldMouseY = (mouseY - translateY) / scale;

    const newTargetScale = targetScale * Math.exp(scrollDelta * zoomIntensity);
    targetScale = Math.max(0.2, Math.min(3, newTargetScale));


    targetTranslateX = mouseX - worldMouseX * targetScale;
    targetTranslateY = mouseY - worldMouseY * targetScale;

    if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() => animateZoom());
    }
}

function animateZoom() {
    if (!isAnimating) return;



    scale += (targetScale - scale) * smoothing;
    translateX += (targetTranslateX - translateX) * smoothing;
    translateY += (targetTranslateY - translateY) * smoothing;
    updateTransform();

    const scaleDiff = Math.abs(targetScale - scale);
    const txDiff = Math.abs(targetTranslateX - translateX);
    const tyDiff = Math.abs(targetTranslateY - translateY);

    if (scaleDiff < 0.001 && txDiff < 0.001 && tyDiff < 0.001) {
        scale = targetScale;
        translateX = targetTranslateX;
        translateY = targetTranslateY;
        isAnimating = false;
    } else {
        requestAnimationFrame(() => animateZoom());
    }
}



function updateTransform() {
    update(scale, translateX, translateY);
    canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    const bgSpacing = 50 * scale;
    canvasArea.style.backgroundSize = `100% ${bgSpacing}%`;
}

function update(scale, tx, ty) {
    scale = scale;
    translateX = tx;
    translateY = ty;

    scale = scale;
    translateX = tx;
    translateY = ty;
    timestamp = Date.now();


}

window.addEventListener('wheel', (e) => {
    handleWheel(e)
}, { passive: false });

window.addEventListener('mousedown', (e) => {
    handleMouseDown(e)
});

window.addEventListener('mousemove', (e) => {
    handleMouseMove(e)
});

window.addEventListener('mouseup', (e) => {
    handleMouseUp(e)
});
