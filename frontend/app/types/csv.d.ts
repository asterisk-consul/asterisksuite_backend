// types/csv.d.ts
declare global {
  interface CSVRow extends Array<string | number | null | undefined> {}

  interface PairDetected {
    fechaRowIndex: number
    kmRowIndex: number
    camion: string
    patente: string
  }

  interface TransformedRow {
    id: number
    descripcion: string
    fecha: string
    kilometros: number
    patente?: string
  }

  interface SaveResult {
    exitosos: TransformedRow[]
    fallidos: (TransformedRow & { error: string })[]
    total: number
  }

  type DataRow = {
    id: number | string
    descripcion: string
    fecha: string
    kilometros: number
    rowNumber?: number
  }
}

export {}
