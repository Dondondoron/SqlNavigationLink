


export interface GenericContext{

    type: string;
    rootPath: string

}

export interface SQLMeshContext extends GenericContext{
    configPaths: string[]
}
export interface DBTContext extends GenericContext{
   

}