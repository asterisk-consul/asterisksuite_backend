import type { CombustibleForm } from '@/components/combustible/combustibleForm'
import { COMBUSTIBLE_FLOW } from './combustibleFlowMap'

// -------------------------
// Resolver configuración
// -------------------------
export function resolveFlowConfig(form: CombustibleForm) {
  if (form.tipoMovimiento === 'ajuste') {
    return COMBUSTIBLE_FLOW.ajuste[form.ajusteSigno ?? 'plus']
  }

  return COMBUSTIBLE_FLOW[form.tipoMovimiento]
}

// -------------------------
// Cabecera
// -------------------------
export function buildCabecera(form: CombustibleForm, cfg: any) {
  return {
    id: -1,
    flowid: cfg.flowId,
    statusid: cfg.statusId,
    fecha: form.fecha,
    referenciatexto: buildReferencia(form),
    descrip: buildReferencia(form),
    clientname:
      form.tipoMovimiento === 'ajuste'
        ? null
        : form.estacion || form.choferId?.label,
    clientid:
      form.tipoMovimiento === 'ajuste'
        ? null
        : form.estacion || form.choferId?.id,
    vendedorid: form.cargadorId,
    varcn1: form.tipoMovimiento === 'carga' ? form.km : null,
    varcn2: form.tipoMovimiento === 'carga' ? form.horas : null
  }
}

// -------------------------
// Cuerpo
// -------------------------
export function buildCuerpo(
  form: CombustibleForm,
  cfg: any,
  cabeceraId: number
) {
  return {
    id: -1,
    presupcabid: cabeceraId,
    articulo: 'Diesel',
    articulodepositoid: 2887,
    cuerpoflowid: cfg.flowId,
    cuerpostatusid: cfg.statusId,
    cantidad: form.litros,
    xlatitud: -32.4072861,
    xlongitud: -63.2430002
  }
}

// -------------------------
// Helpers
// -------------------------
function buildReferencia(form: CombustibleForm) {
  if (form.tipoMovimiento === 'carga') {
    return form.camionId
  }

  if (form.tipoMovimiento === 'descarga') {
    return 'CISTERNA'
  }

  return `AJUSTE ${form.fecha}`
}
