export interface Column {
    name:string
    table:string
    refs:Column[]
}

export interface SqlModelInfo{
         name: string
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