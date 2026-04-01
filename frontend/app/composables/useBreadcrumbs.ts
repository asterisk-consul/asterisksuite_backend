import { useRoute } from 'vue-router'

export const useBreadcrumbs = () => {
  const route = useRoute()

  const items = computed(() => {
    // 👉 override manual desde páginas (edit, create, etc.)
    if (route.meta.breadcrumb) {
      return route.meta.breadcrumb as any[]
    }

    const segments = route.path.split('/').filter(Boolean)

    return segments
      .map((segment, index) => {
        const config = breadcrumbMap[segment]

        // 👉 label base
        let label = config?.label || formatLabel(segment)

        // 👉 si no hay label (ej: oculto), skip
        if (!label) return null

        return {
          label,

          ...(config?.clickable !== false && {
            to: config?.to ?? '/' + segments.slice(0, index + 1).join('/')
          })
        }
      })
      .filter(Boolean)
  })

  return { items }
}

//
// 🔥 MAPA CENTRAL
//
const breadcrumbMap: Record<
  string,
  { label: string; to?: string; clickable?: boolean }
> = {
  // módulos
  logistica: { label: 'Logística', to: '/logistica' },

  // agrupadores
  transport: { label: 'Transporte', clickable: false },
  'master-data': { label: 'Datos Maestros', clickable: false },

  // entidades
  trips: { label: 'Viajes', to: '/logistica/transport/trips' },
  'dispatch-orders': {
    label: 'Órdenes de despacho',
    to: '/logistica/viajes/dispatch-orders'
  },
  corridors: { label: 'Corredores' },
  drivers: { label: 'Choferes' },
  vehicles: { label: 'Vehículos' },
  'vehicle-combinations': { label: 'Flota' },
  warehouse: { label: 'Depósitos' },

  // master data
  'business-parties': { label: 'Partes Interesadas' },
  locations: { label: 'Ubicaciones' },

  // acciones
  create: { label: 'Crear', clickable: false },
  edit: { label: 'Editar', clickable: false }
}

//
// 🔧 FORMAT LABEL (con UUID smart)
//
function formatLabel(segment: string): string | null {
  // 👉 UUID → mostrar corto
  if (/^[0-9a-f-]{36}$/.test(segment)) {
    return segment.split('-')[0] ?? null // e7450c8c
  }

  // 👉 si es número puro (id incremental), ocultar
  if (/^\d+$/.test(segment)) {
    return null
  }

  // 👉 fallback normal
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}
