const vscode = acquireVsCodeApi();

// Listen for messages coming from the extension backend
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'renderLineage') {
        renderLineage(message.data);
    }
});

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function createCard(data, isCenter = false, direction = 'left') {
    const cardContainer = document.createElement('div')
    cardContainer.className = 'card_container'
    const card = document.createElement('div');
    card.className = 'node-card' + (isCenter ? ' center' : '');

    const modelInfo = data.model

    const id = generateId()

    const name = modelInfo.fullname ?? modelInfo.name

    const cardHeader = document.createElement('header')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = name

    const fieldButton = document.createElement('button')
    fieldButton.className = 'fieldButton'
    fieldButton.dataset.card = id
    fieldButton.textContent = "≡"

    cardHeader.appendChild(titleSpan)

    card.appendChild(cardHeader)

    if(isCenter){
        cardHeader.appendChild(fieldButton)

        fieldsContainer = document.createElement('ul')
        fieldsContainer.id = id
        fieldsContainer.className = 'fields-container'

        debugger

        for (const field of Object.entries(modelInfo.columns)) {
            const fieldItem = document.createElement('li')
            fieldItem.className = 'field-item column-item'
            fieldItem.textContent = field[0]
            fieldsContainer.appendChild(fieldItem)
        }

        card.appendChild(fieldsContainer)


    }

    if (!isCenter && data.fields && data.fields.length > 0) {

        cardHeader.appendChild(fieldButton)

        fieldsContainer = document.createElement('ul')
        fieldsContainer.id = id
        fieldsContainer.style.display = 'none'
        fieldsContainer.className = 'fields-container'

        for (const field of data.fields) {
            const fieldItem = document.createElement('li')
            fieldItem.className = 'field-item'
            fieldItem.textContent = field
            fieldsContainer.appendChild(fieldItem)
        }

        card.appendChild(fieldsContainer)

    }

    const childCardContainer = document.createElement('div')

    childCardContainer.classList.add('child_card_container', direction)

    if (direction === 'left') cardContainer.appendChild(childCardContainer)
    cardContainer.appendChild(card)
    if (direction === 'right') cardContainer.appendChild(childCardContainer)

    data.refs.forEach(ref => {
        childCardContainer.appendChild(createCard(ref, false))
    })

    return cardContainer;
}

eventListener = (e) => {


    const changeSizeButton = e.target.closest('button[data-action]');

    if (changeSizeButton) {
        e.stopPropagation();
        const action = changeSizeButton.dataset.action;

        if (action === 'left-decrease' || action === 'left-increase') {

            const sizeLabel = document.getElementById('left-lineage-size-label');
            let currentSize = Number(sizeLabel.textContent)
            if (currentSize > 1 && action === 'left-decrease') currentSize = currentSize - 1
            else if (currentSize < 12 && action === 'left-increase') currentSize = currentSize + 1
            sizeLabel.textContent = currentSize + ''

            post(action);
        }
        if (action === 'right-decrease' || action === 'right-increase') {

            const sizeLabel = document.getElementById('right-lineage-size-label');
            let currentSize = Number(sizeLabel.textContent)
            if (currentSize > 1 && action === 'right-decrease') currentSize = currentSize - 1
            else if (currentSize < 12 && action === 'right-increase') currentSize = currentSize + 1
            sizeLabel.textContent = currentSize + ''

            post(action);
        }
        return;
    }

    const button = e.target.closest('.fieldButton');
    if (button) {
        e.stopPropagation();

        const fieldContainer = document.getElementById(button.dataset.card);
        if (fieldContainer) {
            const isHidden = fieldContainer.style.display === 'none';
            fieldContainer.style.display = isHidden ? 'flex' : 'none';
            button.textContent = isHidden ? '⬆' : '≡';
        }
        return;
    }


    const card = e.target.closest('.node-card');
    if (card) {
        const headerSpan = card.querySelector('header span');
        if (headerSpan?.textContent) {
            post('browse', headerSpan.textContent)
        }
    }
}

function post(command, ...args) {
    vscode.postMessage({
        command: command,
        args: args
    })
}

function renderLineage(data) {
    const leftContainer = document.getElementById('left-nodes');
    const centerContainer = document.getElementById('center-nodes');
    const rightContainer = document.getElementById('right-nodes');

    const leftSizeLabel = document.getElementById('left-lineage-size-label');

    leftSizeLabel.textContent = data.size_left

    const rightSizeLabel = document.getElementById('right-lineage-size-label');

    rightSizeLabel.textContent = data.size_right

    document.removeEventListener('click', eventListener)
    document.addEventListener('click', eventListener)

    // Clear previous content
    leftContainer.innerHTML = '';
    centerContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    // Center Node
    if (data.centerModel) {
        centerContainer.appendChild(createCard(data.centerModel, true));
    }

    // Left Nodes
    if (data.leftRefs && data.leftRefs.length > 0) {
        data.leftRefs.forEach(ref => {
            leftContainer.appendChild(createCard(ref, false, 'left'));
        });
    } else {
        leftContainer.innerHTML = '<div class="empty-state">None</div>';
    }

    // Right Nodes
    if (data.rightRefs && data.rightRefs.length > 0) {
        data.rightRefs.forEach(ref => {
            rightContainer.appendChild(createCard(ref, false, 'right'));
        });
    } else {
        rightContainer.innerHTML = '<div class="empty-state">None</div>';
    }
}

let currentScale = 1;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3.0;
const ZOOM_SPEED = 0.1;


document.removeEventListener('click', eventListener)
document.addEventListener('click', eventListener)