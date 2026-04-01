import { h } from 'vue'
import { UButton } from '#components'
import type { TableColumn } from '@nuxt/ui'

export function useSortableColumn<T>() {
  return function sortableColumn(
    accessorKey: keyof T | string,
    label: string,
    options?: Partial<TableColumn<T>>
  ): TableColumn<T> {
    return {
      accessorKey,
      ...options,

      header: ({ column }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label,
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        })
      }
    }
  }
}
