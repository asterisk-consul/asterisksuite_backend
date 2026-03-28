import type { NavigationMenuItem } from '@nuxt/ui'

export const navigationLinks = [
  [
    {
      label: 'Inicio',
      icon: 'i-lucide-house',
      to: '/'
    },

    {
      label: 'Kilometros',
      icon: 'i-lucide-truck',
      to: '/VKilomentros'
    },
    {
      label: 'Compras',
      icon: 'i-lucide-folder-closed',
      defaultOpen: false,
      children: [
        { label: 'Compras', to: '/Vcompras' },
        {
          label: 'Clasificaciones',
          to: 'https://reportes.flowsma.com/reportes/flow.html?reportUnit=%2F2_DON_ANDRES%2Fclasificador_compras&_flowId=viewReportFlow&decorate=no&j_username=donandres&j_password=donandres',
          target: '_blank'
        },
        {
          label: 'Importador',
          to: 'https://maxipedano.github.io/Asterisk_truck/',
          target: '_blank'
        }
      ]
    },
    {
      label: 'Combustible',
      to: '/combustible',
      icon: 'i-lucide-fuel',
      defaultOpen: false
    },
    {
      label: 'logistica',
      to: '/logistica',
      icon: 'i-lucide-truck'
      // defaultOpen: false,
      // children: [{ label: 'Demostracion', to: '/logistica/operaciones' }]
    },
    {
      label: 'Ajustes',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: false,
      type: 'trigger',
      children: [
        { label: 'General', to: '/settings', exact: true },
        { label: 'Miembros', to: '/settings/members' },
        { label: 'Notificaciones', to: '/settings/notifications' },
        { label: 'Seguridad', to: '/settings/security' }
      ]
    }
  ],
  [
    {
      label: 'Documentacion',
      icon: 'i-lucide-book-text',
      to: 'https://asterisk-consul.github.io/donandresdoc/',
      target: '_blank'
    }
    // {
    //   label: 'Ayuda',
    //   icon: 'i-lucide-info',
    //   to: '/changelog/',
    //   target: '_blank'
    // }
  ]
] as NavigationMenuItem[][]
