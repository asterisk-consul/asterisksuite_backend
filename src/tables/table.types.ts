export type TableColumnType =
  | 'string'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'

export interface TableColumn {
  key: string
  label: string
  type?: TableColumnType
  sortable?: boolean
  filterable?: boolean
defaultVisible?: boolean
readonly?: boolean
}

export interface TableQuery {
  page?: number
  limit?: number
  search?: string
  sort?: string
}

export interface TableMeta {
  page: number
  limit: number
  total: number
}
