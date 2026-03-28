import type { tableRenderers } from './tableRenderers'

export type ColumnConfig = {
  label?: string
  renderer?: keyof typeof tableRenderers
  align?: 'left' | 'center' | 'right'
}
