import { h } from 'vue'
import { UBadge } from '#components'

export type CellRenderer = (value: any, row: any) => any

export const tableRenderers = {
  text: (value) => value ?? '-',

  date: (value) => (value ? new Date(value).toLocaleDateString('es-AR') : '-'),

  datetime: (value) => (value ? new Date(value).toLocaleString('es-AR') : '-'),

  number: (value) =>
    value != null ? new Intl.NumberFormat('es-AR').format(Number(value)) : '-',

  currency: (value) =>
    value != null
      ? new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }).format(Number(value))
      : '-',

  badge: (value) =>
    h(
      UBadge,
      {
        color: value === 'ok' ? 'success' : 'neutral',
        variant: 'subtle'
      },
      () => String(value ?? '-')
    )
} satisfies Record<string, CellRenderer>
