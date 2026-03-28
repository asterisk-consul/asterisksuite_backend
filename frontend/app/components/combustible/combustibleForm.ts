export type TipoMovimiento = 'carga' | 'descarga' | 'ajuste'
export type AjusteSigno = 'plus' | 'minus'

export interface CombustibleForm {
  tipoMovimiento: TipoMovimiento
  fecha: string

  auditor?: string
  camionId?: string
  choferId?: { id: number | null; label: string }
  cargadorId?: { id: number | null; label?: string }

  litros: number | null
  km?: number | null
  horas?: number | null

  estacion?: { id: number | null; label: string }
  ajusteSigno?: AjusteSigno
}
