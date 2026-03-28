import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

export function useIdColumn<T extends { id: string }>(
  onClick?: (row: T) => void
): TableColumn<T> {
  return {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      const id = row.getValue('id') as string

      return h(
        'button',
        {
          class: 'text-primary hover:underline font-mono hover:cursor-pointer',
          onClick: () => onClick?.(row.original)
        },
        `#${id.slice(0, 8)}`
      )
    }
  }
}
