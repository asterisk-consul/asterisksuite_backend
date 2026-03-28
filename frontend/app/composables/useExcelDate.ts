// ==============================
// Excel date helpers
// ==============================

// Convierte número serial de Excel a Date (corrige zona horaria)
const excelSerialToDate = (serial: number): Date => {
  const utcDays = Math.floor(serial - 25569)
  const utcMs = utcDays * 86400 * 1000
  return new Date(utcMs + new Date().getTimezoneOffset() * 60000)
}

// Mapa de meses en español
const monthMap: Record<string, number> = {
  ENE: 0,
  FEB: 1,
  MAR: 2,
  ABR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DIC: 11
}

// Parsea cualquier formato razonable proveniente de Excel
export const parseExcelDate = (value: unknown): Date | null => {
  if (!value) return null

  // Date real
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value
  }

  // Serial Excel (número)
  if (typeof value === 'number') {
    return excelSerialToDate(value)
  }

  // String
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    // Intento estándar (YYYY-MM-DD, ISO, etc.)
    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) return d

    // Formato tipo: 12-ENE
    const match = trimmed.match(/^(\d{1,2})[-/ ]([A-Z]{3})$/i)
    if (match) {
      const day = Number(match[1])
      const mon = match[2].toUpperCase()
      const month = monthMap[mon]

      if (month !== undefined) {
        return new Date(new Date().getFullYear(), month, day)
      }
    }
  }

  return null
}

// ==============================
// Normalizadores
// ==============================

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
