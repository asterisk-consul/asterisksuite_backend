import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { Product } from '~/modulos/logistica/master-data/product/product.types'

export const columns: TableColumn<Product>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return `#${id.slice(0, 8)}`
    }
  },

  {
    accessorKey: 'name',
    header: 'Producto'
  },

  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => {
      const sku = row.getValue('sku') as string | undefined
      return sku ?? '—'
    }
  },

  {
    accessorKey: 'requires_refrigeration',
    header: 'Refrigeración',
    cell: ({ row }) => {
      const value = row.getValue('requires_refrigeration') as
        | boolean
        | undefined

      return h(
        UBadge,
        {
          variant: 'subtle',
          color: value ? 'primary' : 'neutral'
        },
        () => (value ? 'Requiere frío' : 'No requiere')
      )
    }
  },

  {
    accessorKey: 'created_at',
    header: 'Creado',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string | undefined
      if (!date) return '—'

      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  },

  {
    accessorKey: 'updated_at',
    header: 'Actualizado',
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string | undefined
      if (!date) return '—'

      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  }
]
