import type { NavigationMenuItem } from '@nuxt/ui'
export const links: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-heroicons-squares-2x2' },
    {
      label: 'Viajes',
      icon: 'i-heroicons-truck',
      to: '/logistica/viajes/',
      defaultOpen: false,
      children: [
        {
          label: 'Orden de despacho',
          icon: 'i-heroicons-truck',
          to: '/logistica/viajes/dispatch-orders'
        },
        {
          label: 'Corredores',
          icon: 'i-lucide-map',
          to: '/logistica/viajes/corridors/'
        },
        {
          label: 'Choferes',
          icon: 'i-heroicons-users',
          to: '/logistica/viajes/drivers/'
        },
        {
          label: 'Locaciones',
          icon: 'i-lucide-map-pin',
          to: '/logistica/viajes/locaciones/'
        }
      ]
    },
    {
      label: 'Depósitos',
      icon: 'i-heroicons-building-storefront',
      to: '/logistica/warehouse/',
      defaultOpen: false,
      children: [
        {
          label: 'Productos',
          icon: 'i-heroicons-cube',
          to: '/logistica/warehouse/productos/'
        }
      ]
    },
    // {
    //   label: 'Picking',
    //   icon: 'i-heroicons-clipboard-document-list',
    //   to: '/'
    // },
    {
      label: 'Flota',
      icon: 'i-heroicons-wrench-screwdriver',
      to: '/logistica/vehicles-combinations/',
      children: [
        {
          label: 'Vehículos',
          icon: 'i-lucide-bus-front',
          to: '/logistica/vehicles-combinations/vehicles/'
        }
      ]
    },
    {
      label: 'Clientes',
      icon: 'i-heroicons-building-office-2',
      to: '/logistica/business-parties/',
      children: [
        {
          label: 'Contactos',
          icon: 'i-heroicons-users',
          to: '/logistica/business-parties/contacts/'
        }
      ]
    },
    {
      label: 'Reportes',
      icon: 'i-heroicons-chart-bar',
      to: '/reportes/ReporteBipages/'
    },
    {
      label: 'Configuraciones',
      icon: 'i-heroicons-cog-6-tooth',
      children: [
        {
          label: 'Documentacion de transporte',
          icon: 'i-heroicons-book-open',
          to: '/logistica/configuraciones/transport-document/'
        },
        {
          label: 'Tarifas',
          icon: 'i-heroicons-banknotes',
          to: '/logistica/configuraciones/tarifas/'
        }
      ]
    }
  ]
]
