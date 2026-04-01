import type { Row } from '@tanstack/vue-table'

export interface TableDateRange {
  start?: Date
  end?: Date
}

export function useDateColumn(locale = 'es-AR') {
  const meta = { filterType: 'date-range' as const }

  const filterFn = <TData>(
    row: Row<TData>,
    columnId: string,
    value: TableDateRange
  ) => {
    if (!value?.start || !value?.end) return true

    const raw = row.getValue<string>(columnId)
    if (!raw) return false

    const date = new Date(raw)

    const start = new Date(value.start)
    start.setHours(0, 0, 0, 0)

    const end = new Date(value.end)
    end.setHours(23, 59, 59, 999)

    return date >= start && date <= end
  }

  const format = (raw?: string) => {
    if (!raw) return '—'

    return new Date(raw).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return {
    meta,
    filterFn,
    format
  }
}
