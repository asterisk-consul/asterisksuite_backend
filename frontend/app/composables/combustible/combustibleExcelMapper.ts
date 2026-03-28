import type { RegistroCombustible } from './useCombustibleImporter'
import type { CombustibleForm } from '@/components/combustible/combustibleForm'

export function mapRegistroToCombustibleForm(
  r: RegistroCombustible
): CombustibleForm {
  const isCarga = r.tipo === 'CARGA'

  return {
    fecha: r.fecha,

    tipoMovimiento: isCarga ? 'carga' : 'descarga',

    litros: r.litros,

    km: r.km,
    horas: r.horas,

    camionId: r.patente,

    // 🟡 DEBUG: pasar label tal cual viene del Excel
    choferId: isCarga
      ? {
          id: null,
          label: r.chofer
        }
      : undefined,

    // 🟡 DEBUG: usuario tal cual
    cargadorId: {
      id: null,
      label: r.usuario
    },

    // 🟡 DEBUG: estación tal cual
    estacion: !isCarga
      ? {
          id: null,
          label: r.clientName
        }
      : undefined
  }
}
