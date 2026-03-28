export function parseNumberSafe(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0

  const str = String(value).trim().replace(/\s+/g, '')

  // Si no hay separadores, retornar directamente
  if (!/[,.]/.test(str)) {
    const n = parseFloat(str)
    return Number.isFinite(n) ? n : 0
  }

  const lastComma = str.lastIndexOf(',')
  const lastDot = str.lastIndexOf('.')

  let cleanStr = str

  // Caso 1: Solo tiene comas o solo tiene puntos
  if (lastComma === -1) {
    // Solo puntos
    const dotCount = (str.match(/\./g) || []).length
    if (dotCount > 1) {
      cleanStr = str.replace(/\./g, '')
    } else {
      const afterDot = str.substring(lastDot + 1)
      cleanStr =
        afterDot.length === 3 && /^\d{3}$/.test(afterDot)
          ? str.replace(/\./g, '')
          : str
    }
  } else if (lastDot === -1) {
    // Solo comas
    const commaCount = (str.match(/,/g) || []).length
    if (commaCount > 1) {
      cleanStr = str.replace(/,/g, '')
    } else {
      const afterComma = str.substring(lastComma + 1)
      cleanStr =
        afterComma.length === 3 && /^\d{3}$/.test(afterComma)
          ? str.replace(/,/g, '')
          : str.replace(',', '.')
    }
  } else {
    // Ambos separadores
    cleanStr =
      lastComma > lastDot
        ? str.replace(/\./g, '').replace(',', '.')
        : str.replace(/,/g, '')
  }

  const n = parseFloat(cleanStr)
  return Number.isFinite(n) ? n : 0
}
