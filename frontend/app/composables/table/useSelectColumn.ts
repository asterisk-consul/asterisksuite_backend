import { h } from 'vue'
import { UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'

export function useSelectColumn<T>(): TableColumn<T> {
  return {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: unknown) =>
          table.toggleAllPageRowsSelected(!!value)
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: unknown) => row.toggleSelected(!!value)
      }),
    meta: {
      disableColumnVisibility: true
    }
  }
}
