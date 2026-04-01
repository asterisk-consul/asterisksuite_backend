import '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData, TValue> {
    label?: string
    disableColumnVisibility?: boolean
    filterType?: 'text' | 'date-range'
  }
}
