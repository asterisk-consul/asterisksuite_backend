// src/composables/useCombustibleImporter.ts

export interface RegistroCombustible {
  fecha: string
  chofer: string
  estacion: string
  tipo: 'CARGA' | 'DESCARGA'
  patente: string
  litros: number

  km: number | null
  horas: number | null

  usuario: string
  clientName: string

  _key: string
  _rowIndex: number
}

interface ImportResult {
  valid: RegistroCombustible[]
  duplicated: RegistroCombustible[]
  invalid: RegistroCombustible[]
  summary: {
    total: number
    valid: number
    duplicated: number
    invalid: number
  }
}

export function useCombustibleImporter(
  getTipoCamion: (patente: string) => 'TRACTOR' | 'SEMI' | null
) {
  /* =========================
   * Normalización
   * ========================= */

  const normalizeText = (value: any) =>
    String(value ?? '')
      .trim()
      .toUpperCase()

  const normalizeDate = (value: any) => String(value ?? '').trim()

  const normalizeNumber = (value: any) => {
    const n = Number(String(value ?? '0').replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }

  /* =========================
   * Key compuesta
   * ========================= */

  const buildKey = (
    fecha: string,
    clientName: string,
    patente: string,
    litros: number
  ) => `${fecha}|${clientName}|${patente}|${litros}`

  /* =========================
   * Resolver clientName
   * ========================= */

  const resolveClientName = (
    tipo: 'CARGA' | 'DESCARGA',
    chofer: string,
    estacion: string
  ) => (tipo === 'DESCARGA' ? estacion : chofer)

  /* =========================
   * Procesar filas
   * ========================= */

  const processRows = (
    rows: any[][],
    existingKeys: Set<string> = new Set()
  ): ImportResult => {
    const valid: RegistroCombustible[] = []
    const duplicated: RegistroCombustible[] = []
    const invalid: RegistroCombustible[] = []

    const seen = new Set<string>()

    rows.forEach((row, index) => {
      // header
      if (index === 0 && typeof row[0] === 'string') return

      const fecha = normalizeDate(row[0])
      const chofer = normalizeText(row[1])
      const tipo = normalizeText(row[2]) as 'CARGA' | 'DESCARGA'
      const patente = normalizeText(row[3])
      const estacion = normalizeText(row[4])

      const litros = normalizeNumber(row[5])
      const valorFH = normalizeNumber(row[6])
      const usuario = normalizeText(row[7])

      const clientName = resolveClientName(tipo, chofer, estacion)

      let km: number | null = null
      let horas: number | null = null

      /* =========================
       * Reglas por tipo
       * ========================= */

      if (tipo === 'CARGA') {
        const tipoCamion = getTipoCamion(patente)

        if (!tipoCamion) {
          invalid.push({
            fecha,
            chofer,
            estacion,
            tipo,
            patente,
            litros,
            km: null,
            horas: null,
            usuario,
            clientName,
            _key: '',
            _rowIndex: index + 1
          })
          return
        }

        if (tipoCamion === 'TRACTOR') km = valorFH
        if (tipoCamion === 'SEMI') horas = valorFH
      }

      /* =========================
       * Validaciones generales
       * ========================= */

      if (
        !fecha ||
        !clientName ||
        !patente ||
        !['CARGA', 'DESCARGA'].includes(tipo) ||
        litros <= 0
      ) {
        invalid.push({
          fecha,
          chofer,
          estacion,
          tipo,
          patente,
          litros,
          km,
          horas,
          usuario,
          clientName,
          _key: '',
          _rowIndex: index + 1
        })
        return
      }

      const key = buildKey(fecha, clientName, patente, litros)

      if (seen.has(key) || existingKeys.has(key)) {
        duplicated.push({
          fecha,
          chofer,
          estacion,
          tipo,
          patente,
          litros,
          km,
          horas,
          usuario,
          clientName,
          _key: key,
          _rowIndex: index + 1
        })
        return
      }

      seen.add(key)

      valid.push({
        fecha,
        chofer,
        estacion,
        tipo,
        patente,
        litros,
        km,
        horas,
        usuario,
        clientName,
        _key: key,
        _rowIndex: index + 1
      })
    })

    return {
      valid,
      duplicated,
      invalid,
      summary: {
        total: rows.length - 1,
        valid: valid.length,
        duplicated: duplicated.length,
        invalid: invalid.length
      }
    }
  }

  return {
    processRows
  }
}
