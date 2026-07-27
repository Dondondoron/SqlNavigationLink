
export enum SqlType {
  SQLMESH = 'SQLMESH',
  DBT = 'DBT'
}
export interface PathObject {
  id: string;
  label: string;
  filePath: string;
  description?: string;
  type: SqlType
}
