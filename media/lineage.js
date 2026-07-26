const vscode = acquireVsCodeApi();

// Listen for messages coming from the extension backend
window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'updateLineage') {
        renderLineage(message.data);
    }
});

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function createCard(data, isCenter = false) {
    const card = document.createElement('div');
    card.className = 'node-card' + (isCenter ? ' center' : '');

    const id = generateId()

    const name = data.fullname ?? data.name

    const cardHeader = document.createElement('header')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = name

    const fieldButton = document.createElement('button')
    fieldButton.className = 'fieldButton'
    fieldButton.dataset.card = id
    fieldButton.textContent = "⬇"

    cardHeader.appendChild(titleSpan)

    card.appendChild(cardHeader)

    if (data.fields && data.fields.length > 0) {

        cardHeader.appendChild(fieldButton)

        fieldsContainer = document.createElement('div')
        fieldsContainer.id = id
        fieldsContainer.style.display = 'none'

        for (const field of data.fields) {

            fieldSpan = document.createElement('span')
            fieldSpan.textContent = field
            fieldsContainer.appendChild(fieldSpan)
        }

        card.appendChild(fieldsContainer)

    }


    return card;
}

eventListener = (e) => {


    const changeSizeButton = e.target.closest('button[data-action]');

    if (changeSizeButton) {
        e.stopPropagation();
        const action = changeSizeButton.dataset.action; 

        if (action === 'increase' || action === 'decrease') {
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
            button.textContent = isHidden ? '⬆' : '⬇';
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
            leftContainer.appendChild(createCard(ref));
        });
    } else {
        leftContainer.innerHTML = '<div class="empty-state">None</div>';
    }

    // Right Nodes
    if (data.rightRefs && data.rightRefs.length > 0) {
        data.rightRefs.forEach(ref => {
            rightContainer.appendChild(createCard(ref));
        });
    } else {
        rightContainer.innerHTML = '<div class="empty-state">None</div>';
    }
}