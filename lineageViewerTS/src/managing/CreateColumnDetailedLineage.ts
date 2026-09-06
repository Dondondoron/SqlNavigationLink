import { Column } from "../domain/domain";
import { Card } from "./Card";



function createTarget(column: string, element: Element) {

    return {
        column: column,
        element: element
    }
}

export class ColumnDetailLineageCreator {



    constructor(private card: Card, private column: Column) { }


    render(connect: { a: Element; b: Element; }[], preColumnDiv: Element | null) {

        const nextTargets: Map<string, Set<{ column: string, element: Element }>> = new Map()

        const canvas = document.createElement('div')
        canvas.classList.add('lineage-column-container')

        const cardColumn = this.card.cardColumns.get(this.column.name)
        if (!cardColumn) {
            return
        }

        cardColumn.fieldItem.classList.remove('hidden')
        if (cardColumn.expanded) {

            if (preColumnDiv) connect.push({ a: cardColumn.fieldItem, b: preColumnDiv })

            return
        }

        cardColumn.fieldItem.replaceWith(canvas)



        cardColumn.canvas = canvas


        function recurse(col: Column, element: HTMLElement, prevHeader: Element | null, rootElement?: HTMLElement, noChange: string[] = []) {


            //Skip duplicates
            if (col.refs.length === 1 && col.table && col.refs[0].table === col.table && col.refs[0].name === col.name && !rootElement) {
                recurse(col.refs[0], element, prevHeader)
                return
            }
            //Skip no change
            if (col.refs.length === 1 && col.table && col.refs[0].name === col.name && !rootElement) {
                recurse(col.refs[0], element, prevHeader, undefined, [...noChange, col.table])
                return
            }


            const innerCanvas = document.createElement('div')
            innerCanvas.classList.add('lineage-column-container', 'full-width')
            innerCanvas.style.flexDirection = 'row-reverse'


            const header = rootElement ? rootElement : document.createElement('li')
            header.textContent = col.name

            header?.classList.add('selected-detailed');

            if (prevHeader) connect.push({ a: header, b: prevHeader })

            const childContainer = document.createElement('div')
            childContainer.classList.add('child_card_container')


            element.appendChild(innerCanvas)
            innerCanvas.appendChild(header)
            innerCanvas.appendChild(childContainer)

            if (!col.table) {
                //Function or Literal

                if (col.name.startsWith('literal:') || col.name === 'null') {
                    header.classList.add('literal')
                } else {
                    header.classList.add('func')
                }
            }



            if (col.refs.length === 0) {
                // Remove margin on the left edge.
                header.style.marginLeft = '0px'
            }

            if (col.refs.length === 0 && col.table) {

                header.classList.add('outer-table-ref')

                if (nextTargets.has(col.table))
                    nextTargets.get(col.table)?.add(createTarget(col.name, header))
                else {
                    nextTargets.set(col.table, new Set([createTarget(col.name, header)]))
                }
                // To Next Table

            }
            else if (col.refs.length > 0 && col.table && !rootElement) {
                // CTE or SubQuery

                let tableText = ''
                for (const ref of noChange) {
                    tableText += ref + '.'
                }

                tableText += col.table + '.'

                header.textContent = tableText



                header.classList.add('inner-table-ref')
            }
            else if (col.refs.length === 0 && !col.table) {
                // Leaf

            }

            col.refs.forEach(r => {
                recurse(r, childContainer, header)

            })

        }

        recurse(this.column, canvas, preColumnDiv, cardColumn.fieldItem)


        cardColumn.expanded = true

        return nextTargets

    }
}