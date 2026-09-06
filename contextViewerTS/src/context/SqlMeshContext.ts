import { GenericContext, SQLMeshContext } from "./Context";



export class SQLMeshSubPathItem {


    container: HTMLDivElement = document.createElement('div')
    private pathLabel: HTMLLabelElement = document.createElement('label')
    private removeButton: HTMLButtonElement = document.createElement('button')

    constructor(path: string, rootPath: string) {
        this.container.classList.add('header-row', 'config-path-row')

        this.pathLabel.textContent = path;
        this.removeButton.textContent = "Remove"
        this.removeButton.classList.add('secondary')

        this.removeButton.dataset.action = 'removeConfigPath'
        this.removeButton.dataset.path = path
        this.removeButton.dataset.rootPath = rootPath

        this.container.appendChild(this.pathLabel)
        this.container.appendChild(this.removeButton)

    }

}

export class ContextItem {

    type: string = "DBT";
    rootPath: string


    constructor(data: GenericContext,
        public container: HTMLDivElement = document.createElement('div'),
        public header: HTMLElement = document.createElement('header'),
        public center: HTMLElement = document.createElement('div'),
        public buttonContainer: HTMLElement = document.createElement('div'),
    ) {
        container.classList.add('context-item')

        const pathSpan = document.createElement('span')
        pathSpan.textContent = data.rootPath
        header.appendChild(pathSpan)
        const rightSideHeader = document.createElement('div')
        rightSideHeader.classList.add('header-right')
        header.appendChild(rightSideHeader)
        header.classList.add('header-row', 'header-path')

        container.appendChild(header)
        container.appendChild(center)
        container.appendChild(buttonContainer)
        buttonContainer.classList.add('header-row')
        buttonContainer.style.flexDirection = 'row-reverse'
        this.rootPath = data.rootPath
        this.type = data.type


        const removeContextButton = document.createElement('button')
        removeContextButton.textContent = 'X'
        removeContextButton.classList.add('secondary')
        removeContextButton.dataset.action = 'removeContext'
        removeContextButton.dataset.value = data.rootPath
        
        
        const typeButton = document.createElement('button')
        typeButton.classList.add('secondary')
        typeButton.dataset.value = data.rootPath
        typeButton.dataset.action = 'changePathType'
        typeButton.textContent = data.type
        rightSideHeader.appendChild(typeButton)
        rightSideHeader.appendChild(removeContextButton)

        const parseContextButton = document.createElement('button')
        parseContextButton.textContent = 'Parse'
        parseContextButton.classList.add('primary')
        parseContextButton.dataset.action = 'parsePath'
        parseContextButton.dataset.value = data.rootPath

        buttonContainer.appendChild(parseContextButton)
    }

}
export class SQLMeshItem extends ContextItem implements SQLMeshContext {

    configPaths: string[] = []
    configItems: Map<string, SQLMeshSubPathItem> = new Map()

    private addConfigPathButton: HTMLButtonElement = document.createElement('button');

    constructor(
        data: SQLMeshContext,
        private configPathDetails: HTMLDetailsElement = document.createElement('details')
    ) {
        super(data)

        configPathDetails.classList.add('config-details')

        this.center.appendChild(configPathDetails)

        this.addConfigPathButton.textContent = "Add Config Path"
        this.addConfigPathButton.classList.add('secondary')
        this.addConfigPathButton.dataset.value = data.rootPath
        this.addConfigPathButton.dataset.action = 'addConfigPath'

        this.buttonContainer.appendChild(this.addConfigPathButton)

        this.init(data)
    }

    init(data: SQLMeshContext) {
        this.configPathDetails.innerHTML = ''
        this.configPathDetails.style.marginBottom = '6px'

        this.configPathDetails.open = true

        
        const configPathHeader = document.createElement('summary')
        configPathHeader.textContent = "Config Paths"
        this.configPathDetails.appendChild(configPathHeader)

        
        this.configPaths = data.configPaths ?? []


        this.configPaths.forEach(path => {

            const pathItem = new SQLMeshSubPathItem(path, this.rootPath)
            this.configPathDetails.appendChild(pathItem.container)
            this.configItems.set(path, pathItem)

        })

        
    }

}