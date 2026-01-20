import { TableColumn } from '@/tables/table.types'
export const ArticulosTable: TableColumn[] = [
  {
    key: 'internalcode',
    label: 'Código interno',
    filterable: true,
    sortable: true,
  },
  {
    key: 'externalcode',
    label: 'Código externo',
    filterable: true,
  },
  {
    key: 'nombre',
    label: 'Nombre',
    filterable: true,
    defaultVisible: true,
  },
  {
    key: 'descrip',
    label: 'Descripción',
    filterable: true,
  },
  {
    key: 'activo',
    label: 'Activo',
  },
  {
    key: 'precio',
    label: 'Precio',
    type: 'currency',
    defaultVisible: false,
  },
]
