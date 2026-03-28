interface Compra {
  id?: number
  clientid?: string | null
  clientname?: string | null
  referenciatexto?: string | null
  fecha?: string | null
  fechacompromiso?: string | null
  [key: string]: any // Campos dinámicos según backend
}

interface ImportesDistribuidos {
  totalimpuestos?: number | null
  totalprecio?: number | null
  varcn0?: number
  varcn1?: number
  varcn2?: number
  varcn3?: number
}

interface Distribucion {
  clasificacion: { label: string; value: string } | undefined
  porcentaje: number
  importes: ImportesDistribuidos
  bloqueada: boolean
}

interface ComprasState {
  comprasA: any[]
  comprasB: any[]
  loading: boolean
  loaded: boolean
  lastFetch: Date | null
  error: string | null
  comprasSeleccionadas: any[]
  clasificando: boolean
}
