import type { CellContext, HeaderContext } from '@tanstack/vue-table'
import { UButton } from '#components'
const UDropdownMenu = resolveComponent('UDropdownMenu')

export const columns = [
  {
    header: (ctx: HeaderContext<Compra, unknown>) => {
      const column = ctx.column
      const isSorted = column.getIsSorted()

      return h('div', { class: 'group' }, [
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Cliente',
          trailingIcon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up'
              : 'i-lucide-arrow-down'
            : 'i-lucide-arrow-up-down',
          class: [
            '-mx-2.5 hover:cursor-pointer',
            // Oculta el icono arrow-up-down cuando no está sorted
            !isSorted &&
              '[&>span:last-child]:opacity-0 group-hover:[&>span:last-child]:opacity-100 [&>span:last-child-child]:transition-opacity'
          ]
            .filter(Boolean)
            .join(' '),
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      ])
    },
    accessorKey: 'clientname'
  },
  {
    accessorKey: 'fecha',
    cell: (ctx: CellContext<Compra, unknown>) => {
      const row = ctx.row
      return new Date(row.getValue('fecha')).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour12: false
      })
    },
    header: (ctx: HeaderContext<Compra, unknown>) => {
      const column = ctx.column
      const isSorted = column.getIsSorted()

      return h('div', { class: 'group' }, [
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Fecha',
          trailingIcon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up'
              : 'i-lucide-arrow-down'
            : 'i-lucide-arrow-up-down',
          class: [
            '-mx-2.5 hover:cursor-pointer',
            // Oculta el icono arrow-up-down cuando no está sorted
            !isSorted &&
              '[&>span:last-child]:opacity-0 group-hover:[&>span:last-child]:opacity-100 [&>span:last-child-child]:transition-opacity'
          ]
            .filter(Boolean)
            .join(' '),
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      ])
    }
  },
  {
    header: (ctx: HeaderContext<Compra, unknown>) => {
      const column = ctx.column
      const isSorted = column.getIsSorted()

      return h('div', { class: 'group' }, [
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Fecha Compromiso',
          trailingIcon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up'
              : 'i-lucide-arrow-down'
            : 'i-lucide-arrow-up-down',
          class: [
            '-mx-2.5 hover:cursor-pointer',
            // Oculta el icono arrow-up-down cuando no está sorted
            !isSorted &&
              '[&>span:last-child]:opacity-0 group-hover:[&>span:last-child]:opacity-100 [&>span:last-child-child]:transition-opacity'
          ]
            .filter(Boolean)
            .join(' '),
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      ])
    },
    accessorKey: 'fechacompromiso',
    cell: (ctx: CellContext<Compra, unknown>) => {
      const row = ctx.row
      return new Date(row.getValue('fechacompromiso')).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour12: false
      })
    }
  },
  {
    header: 'Referencia',
    accessorKey: 'referenciatexto'
  },
  {
    header: 'Total Impuestos',
    accessorKey: 'totalimpuestos',
    cell: (ctx: CellContext<Compra, unknown>) => {
      const amount = Number(ctx.row.getValue('totalimpuestos'))
      const formatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(amount)

      return h('span', { class: 'font-semibold text-success' }, formatted)
    }
  },
  {
    header: 'Total Precio',
    accessorKey: 'totalprecio',
    cell: (ctx: CellContext<Compra, unknown>) => {
      const amount = Number(ctx.row.getValue('totalprecio'))
      const formatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(amount)

      return h('span', { class: 'font-semibold text-success' }, formatted)
    }
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: (ctx: CellContext<Compra, unknown>) => {
      const row = ctx.row
      const compra = row.original

      return h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          color: 'secondary',
          variant: 'soft',
          size: 'xs',
          icon: 'i-lucide-edit',
          onClick: () => {
            // evento que se captura en el componente padre
            window.dispatchEvent(
              new CustomEvent('open-modal-compra', {
                detail: compra
              })
            )
          }
        })
      ])
    }
  }
]
