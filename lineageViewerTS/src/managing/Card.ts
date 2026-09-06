import { Column, ModelLineage, SqlModelInfo } from "../domain/domain"
import { Utility } from "../utils/Utility"
import { ColumnDetailLineageCreator } from "./CreateColumnDetailedLineage"


export class CardColumn implements Column {

    name: string
    table?: string
    refs: CardColumn[]
    canvas?: HTMLDivElement

    expanded?: boolean = false

    constructor(column: Column,
        public fieldItem = document.createElement('li')
    ) {
        this.name = column.name
        this.table = column.table
        this.refs = []



        fieldItem.className = 'field-item column-item'
        fieldItem.textContent = column.name
        fieldItem.dataset.column = column.name
        fieldItem.title = column.table + '.' + column.name
    }

}


export class Card {

    static card_stack: Map<string, Card> = new Map()

    parent: Card | undefined
    id: string
    table: string
    direction: "left" | "center" | "right"
    columnData: Map<string, Column>
    cteColumnData: Map<string, Map<string, any[]>> = new Map()

    isCenter: boolean = false
    fieldsHidden: boolean = false
    containerHidden: boolean = true
    cardColumns: Map<string, CardColumn> = new Map()

    constructor(model: ModelLineage, isCenter = false, direction: "left" | "right" = 'left', parent: Card | undefined = undefined,
        public cardContainer = document.createElement('div'),
        public card = document.createElement('div'),
        public cardHeader = document.createElement('header'),
        public titleSpan = document.createElement('span'),
        public fieldButton = document.createElement('button'),
        public fieldsContainer = document.createElement('ul'),
        public childCards: Map<string, Card> = new Map()

    ) {
        const id = Utility.generateId()
        this.id = id
        this.direction = isCenter ? 'center' : direction
        this.parent = parent
        this.isCenter = isCenter
        cardContainer.className = 'card_container'

        card.className = 'node-card' + (isCenter ? ' center' : '');
        const modelInfo = model.model
        const name = modelInfo.name
        this.table = name.replaceAll('"', '')

        cardContainer.dataset.card = name
        cardContainer.dataset.id = id

        titleSpan.textContent = name

        Card.card_stack.set(id, this)

        fieldButton.className = 'fieldButton'
        fieldButton.dataset.card = name
        fieldButton.dataset.id = id
        fieldButton.textContent = "≡"

        cardHeader.appendChild(titleSpan)

        card.appendChild(cardHeader)

        this.columnData = modelInfo.columns ? new Map(modelInfo.columns.map(c => [c.name, c])) : new Map()


        if (modelInfo.columns) {
            cardHeader.appendChild(fieldButton)

            fieldsContainer.id = 'fields-' + id
            fieldsContainer.className = 'fields-container'

            for (const field of modelInfo.columns) {

                const cardColumn = new CardColumn(field)

                this.cardColumns.set(field.name, cardColumn)

                fieldsContainer.appendChild(cardColumn.fieldItem)
            }

            card.appendChild(fieldsContainer)


        }


        const childCardContainer = document.createElement('div')

        childCardContainer.classList.add('child_card_container', direction)

        if (direction === 'left') cardContainer.appendChild(childCardContainer)
        cardContainer.appendChild(card)
        if (direction === 'right') cardContainer.appendChild(childCardContainer)

        model.refs?.forEach((ref) => {

            const newCard = new Card(ref, false, direction, this);
            this.childCards.set(ref.model.name.replaceAll('"', ''), newCard)

            if (this.isCenter) {
                const leftContainer = document.getElementById('left-nodes')!;
                leftContainer.appendChild(newCard.cardContainer)
            }
            else childCardContainer.appendChild(newCard.cardContainer)
        })


        if (!this.isCenter) this.showFieldsContainer(false)
    }

    reset() {
        this.hideCard(false)
        const columnDivs = this.fieldsContainer.querySelectorAll('.field-item');

        columnDivs.forEach(f => {
            f.classList.remove('selected')
            f.classList.remove('selected-detailed')
        })

        this.cardColumns.forEach(cc => {
            if (cc.canvas) {
                cc.canvas.replaceWith(cc.fieldItem)
                cc.canvas = undefined
                cc.expanded = false
            }
        })
    }

    toggle() {
        if (this.fieldsHidden) {
            this.showFields()
            return
        }

        this.showFieldsContainer(!this.containerHidden)
    }


    hideCard(isTrue: boolean) {
        if (isTrue) this.card.classList.add('hidden')
        else this.card.classList.remove('hidden')

        this.childCards.forEach(cc=>cc.hideCard(isTrue))
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

        this.showFieldsContainer(true)
    }

    showFieldsContainer(isTrue: boolean) {

        this.fieldsContainer.style.display = isTrue ? 'flex' : 'none';
        this.fieldButton.textContent = isTrue ? '⬆' : '≡';

        this.containerHidden = isTrue
    }


    showFullLineage(column: string, connect: { a: Element, b: Element }[] = [], preColumnDiv: Element | null) {


        this.showFieldsContainer(true)

        const cardColumn = this.columnData.get(column)


        if (cardColumn) {

            const next_targets = new ColumnDetailLineageCreator(this, cardColumn)
                .render(connect, preColumnDiv)

            if (next_targets) {

                Array.from(this.childCards.entries()).forEach(cc => {
                    

                    if (!next_targets.has(cc[0])) {

                        cc[1].hideCard(true)

                    }

                })

                Array.from(next_targets.entries()).forEach(t => {

                    const child = this.childCards.get(t[0])


                    if (child) {
                        t[1].forEach(ct => {

                            child.showFullLineage(ct.column, connect, ct.element)
                        })
                    }
                })
            }

        }


        return connect
    }

    showLineage(column: string, connect: { a: Element, b: Element }[] = [], preColumnDiv: Element | null) {

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

        debugger


        if (this.direction === 'center' && columnDiv) {
            // Define a recursive helper function to process a card and traverse its right-side children
            const traverseRightCards = (card: Card, targetTable: string, targetColumn: string, currentColumnDiv: Element) => {
                if (!card) return;

                if (!card.isCenter) {
                    card.showFieldsContainer(true);
                    card.hideFields();
                    currentColumnDiv?.classList.add('selected');
                }

                const leafs = this.getLeafColumnsWithParent(Array.from(card.columnData.values()))

                // 1. Process column data for the current card
                Array.from(leafs)
                    .filter(leaf => {
                        return leaf.column.table === targetTable && leaf.column.name === targetColumn
                    })
                    .forEach(leaf => {
                        const inoCa = card.cardColumns.get(leaf.parent?.name??'');
                        if (inoCa && currentColumnDiv) {
                            inoCa.fieldItem.classList.add('selected');
                            inoCa.fieldItem.classList.remove('hidden');
                            currentColumnDiv.classList.remove('hidden');
                            connect.push({ a: currentColumnDiv, b: inoCa.fieldItem });

                            // 2. Recursively traverse further down the tree for any 'right' child cards,
                            // passing the current card's table and the matched column name (coco.name) 
                            // so the next level links against this newly matched field item!
                            if (card.childCards) {
                                card.childCards.forEach(innerCard => {
                                    if (innerCard.direction === 'right') {
                                        traverseRightCards(innerCard, card.table, leaf.parent?.name??'', inoCa.fieldItem);
                                    }
                                });
                            }
                        }
                    });
            };

            // Kick off the recursion starting directly from the center card's first-layer children
            Array.from(this.childCards.values())
                .filter(f => f.direction === 'right')
                .forEach(innerCard => {
                    traverseRightCards(innerCard, this.table, column, columnDiv);
                });
        }

        const columnLineages = this.columnData.get(column);



        if (columnLineages) {
            const leafColumns = this.getLeafColumns([columnLineages])

            leafColumns.forEach((col) => {
                this.resolveLineage(col, connect, columnDiv);
            })

        }
        ;

        return connect
    }


    private getLeafColumnsWithParent(columndata: Column[], cols: {column: Column, parent: Column | undefined}[] = [], first_boolean:boolean = true, parentColumn?: Column) {
        columndata.forEach(cd => {
            if (cd.refs.length === 0 && cd.table) {
                cols.push({ column: cd, parent: parentColumn })
            } else {
                this.getLeafColumnsWithParent(cd.refs, cols, false, first_boolean ? cd : parentColumn)
            }

        })
        return cols
    }


    private getLeafColumns(columndata: Column[], cols: Column[] = []) {
        columndata.forEach(cd => {
            if (cd.refs.length === 0 && cd.table) {
                cols.push(cd)
            } else {
                this.getLeafColumns(cd.refs, cols)
            }

        })
        return cols
    }

    private resolveLineage(col: Column, connect: { a: Element; b: Element }[], columnDiv: Element | null) {

        const nextColumn = col.name;
        const tableName = col.table;
        const sanitizedTableName = tableName?.replaceAll('"', '')??'';

        if (!nextColumn) return;

        const allCards = this.childCards;
        const targetCard = allCards.get(tableName??'') ?? allCards.get(sanitizedTableName??'');


        if (targetCard) {

            // Base case: We found the actual UI Card
            targetCard.showFieldsContainer(true);
            targetCard.showLineage(nextColumn, connect, columnDiv);
        }
    }


}