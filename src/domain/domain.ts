
export interface TableReference{
    table_name:string
    schema_name:string
    catalog_name:string

}

export interface Column {
    name:string
    table?:TableReference
    refs:Column[]
}

export interface SqlModelInfo{
    name: string
    table_name: string
    table_schema: string
    catalog: string
    file_name: string
    file_path: string
    table_names: string[]
    columns: Column[]
}

export interface ModelLineage {
    model: SqlModelInfo 
    refs?: ModelLineage[]
    fields?: string[]
}



export interface LineageInfo{

            centerModel:ModelLineage
            rightRefs: ModelLineage[]
            size_left: string
            size_right: string
        
}