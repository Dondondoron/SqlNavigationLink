import { Utility } from "../utils/Utility"




export class Card {

    static card_stack: Map<string, Card> = new Map()

    columnData: Map<string, any[]>
    cteColumnData: Map<string, Map<string, any[]>> = new Map()

    isCenter: boolean = false
    fieldsHidden: boolean = false
    containerHidden: boolean = true

    constructor(data: any, isCenter = false, direction = 'left',
        public cardContainer = document.createElement('div'),
        public card = document.createElement('div'),
        public cardHeader = document.createElement('header'),
        public titleSpan = document.createElement('span'),
        public fieldButton = document.createElement('button'),
        public fieldsContainer = document.createElement('ul'),
        public childCards: Map<string, Card> = new Map()

    ) {
        const id = Utility.generateId()
        this.isCenter = isCenter
        cardContainer.className = 'card_container'

        card.className = 'node-card' + (isCenter ? ' center' : '');
        const modelInfo = data.model
        const name = modelInfo.fullname ?? modelInfo.name

        cardContainer.dataset.card = name

        titleSpan.textContent = name

        Card.card_stack.set(name, this)

        fieldButton.className = 'fieldButton'
        fieldButton.dataset.card = name
        fieldButton.dataset.id = id
        fieldButton.textContent = "≡"

        cardHeader.appendChild(titleSpan)

        card.appendChild(cardHeader)

        this.columnData = modelInfo.columns ? new Map(Object.entries(modelInfo.columns)) : new Map()


        if (modelInfo.cte_columns) {
            Object.entries(modelInfo.cte_columns).forEach((ctc: any) => {

                const cteMap: Map<string, any> = new Map(Object.entries(ctc[1]))


                this.cteColumnData.set(ctc[0], cteMap)

            })
        }


        if (modelInfo.columns) {
            cardHeader.appendChild(fieldButton)


            fieldsContainer.id = 'fields-' + id
            fieldsContainer.className = 'fields-container'
            if (!isCenter) fieldsContainer.style.display = 'none'


            for (const field of Object.entries(modelInfo.columns)) {
                const fieldItem = document.createElement('li')
                fieldItem.className = 'field-item column-item'
                fieldItem.textContent = field[0]
                fieldItem.dataset.column = field[0]
                fieldsContainer.appendChild(fieldItem)
            }

            card.appendChild(fieldsContainer)


        }


        if (!isCenter && !modelInfo.columns && data.fields && data.fields.length > 0) {


            cardHeader.appendChild(fieldButton)

            fieldsContainer.id = 'fields-' + id
            fieldsContainer.style.display = 'none'
            fieldsContainer.className = 'fields-container'

            for (const field of data.fields) {
                const fieldItem = document.createElement('li')
                fieldItem.className = 'field-item'
                fieldItem.textContent = field
                fieldItem.dataset.column = field
                fieldsContainer.appendChild(fieldItem)
            }

            card.appendChild(fieldsContainer)

        }


        const childCardContainer = document.createElement('div')

        childCardContainer.classList.add('child_card_container', direction)

        if (direction === 'left') cardContainer.appendChild(childCardContainer)
        cardContainer.appendChild(card)
        if (direction === 'right') cardContainer.appendChild(childCardContainer)

        data.refs.forEach((ref: any) => {

            const newCard = new Card(ref, false);
            this.childCards.set(name, newCard)
            childCardContainer.appendChild(newCard.cardContainer)
        })

    }

    reset() {
        const columnDivs = this.fieldsContainer.querySelectorAll('.field-item');

        columnDivs.forEach(f => {
            f.classList.remove('selected')
        })
    }


    toggle() {
        if (this.fieldsHidden) {
            this.showFields()
            return
        }

        this.showFieldsContainer(!this.containerHidden)
    }

    hideFields() {
        this.fieldsHidden = true;


        const columnDivs = this.fieldsContainer.querySelectorAll('.field-item');

        columnDivs.forEach(f => {
            if (!f.classList.contains('selected'))
                f.classList.add('hidden')
        })
        this.fieldButton.textContent = '👁'

    }

    showFields() {
        const columnDivs = this.fieldsContainer.querySelectorAll('.field-item');

        columnDivs.forEach(f => {
            f.classList.remove('hidden')
        })

        this.fieldButton.textContent = '⬆';
        this.fieldsHidden = false;

    }

    showFieldsContainer(isTrue: boolean) {

        this.fieldsContainer.style.display = isTrue ? 'flex' : 'none';
        this.fieldButton.textContent = isTrue ? '⬆' : '≡';

        this.containerHidden = isTrue
    }


    showLineage(column: any, connect: { a: Element, b: Element }[] = [], preColumnDiv: Element | null) {
        const columnDiv = this.fieldsContainer.querySelector(`[data-column="${column}"]`);
        columnDiv?.classList.add('selected');

        if (this.isCenter) {
            this.fieldsContainer.querySelectorAll('.field-item').forEach(c => c.classList.remove('hidden'))
        }
        else {
            this.hideFields()
            columnDiv?.classList.add('selected');
        }

        if (preColumnDiv && columnDiv) {
            preColumnDiv?.classList.remove('hidden');
            columnDiv?.classList.remove('hidden');
            connect.push({ a: columnDiv, b: preColumnDiv })
        }

        

        const columnLineages = this.columnData.get(column);
        columnLineages?.forEach((lineage: string) => {
            this.resolveLineage(lineage, connect, columnDiv);
        });

        return connect
    }

    private resolveLineage(lineageString: string, connect: { a: Element; b: Element }[], columnDiv: Element | null) {
        const lineageParts = lineageString.split('.');
        const nextColumn = lineageParts.pop()?.replaceAll('"', '');
        const tableName = lineageParts.join('.');
        const sanitizedTableName = tableName.replaceAll('"', '');

        if (!nextColumn) return;

        const allCards = Card.card_stack;
        const targetCard = allCards.get(tableName) ?? allCards.get(sanitizedTableName);


        if (targetCard) {

            // Base case: We found the actual UI Card
            targetCard.showFieldsContainer(true);
            targetCard.showLineage(nextColumn, connect, columnDiv);
        } else {
            // Recursive case: CTE step — look up the intermediate CTE definition
            const cteTable = this.cteColumnData.get(tableName) ?? this.cteColumnData.get(sanitizedTableName);
            const cteColumns = cteTable?.get(nextColumn);

            cteColumns?.forEach((nestedLineage: string) => {
                // Recursively resolve through infinite levels of CTEs
                this.resolveLineage(nestedLineage, connect, columnDiv);
            });
        }
    }


}