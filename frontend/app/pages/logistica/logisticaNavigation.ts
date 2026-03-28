import type { NavigationMenuItem } from '@nuxt/ui'
export const links: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-heroicons-squares-2x2' },
    {
      label: 'Viajes',
      icon: 'i-heroicons-truck',
      to: '/logistica/transport/trips',
      defaultOpen: false,
      children: [
        {
          label: 'Corredores',
          icon: 'i-lucide-map',
          to: '/logistica/transport/corridors/'
        },
        {
          label: 'Choferes',
          icon: 'i-heroicons-users',
          to: '/logistica/transport/drivers/'
        },
        {
          label: 'Locaciones',
          icon: 'i-lucide-map-pin',
          to: '/logistica/master-data/locaciones/'
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
          to: '/logistica/master-data/productos/'
        }
      ]
    },
    {
      label: 'Picking',
      icon: 'i-heroicons-clipboard-document-list',
      to: '/'
    },
    { label: 'Stock', icon: 'i-heroicons-archive-box', to: '/' },
    {
      label: 'Flota',
      icon: 'i-heroicons-wrench-screwdriver',
      to: '/logistica/transport/vehicles-combinations/',
      children: [
        {
          label: 'Vehículos',
          icon: 'i-lucide-bus-front',
          to: '/logistica/transport/vehicles/'
        }
      ]
    },
    {
      label: 'Clientes',
      icon: 'i-heroicons-building-office-2',
      to: '/logistica/master-data/business-parties/',
      children: [
        {
          label: 'Contactos',
          icon: 'i-heroicons-users',
          to: '/logistica/master-data/contacts/'
        }
      ]
    },
    {
      label: 'Reportes',
      icon: 'i-heroicons-chart-bar',
      to: '/logistica/master-data/ReporteBipages/',
      children: [
        {
          label: 'Logistica trips BI',
          icon: 'i-heroicons-chart-bar',
          to: '/logistica/master-data/ReporteBipages/'
        }
      ]
    },
    {
      label: 'Configuraciones',
      icon: 'i-heroicons-cog-6-tooth',
      children: [
        {
          label: 'Documentacion de transporte',
          icon: 'i-heroicons-book-open',
          to: '/logistica/transport-document/'
        },
        {
          label: 'Tarifas',
          icon: 'i-heroicons-banknotes',
          to: '/logistica/master-data/tarifas/'
        }
      ]
    }
  ]
]
