import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const obtenerFechaServidor = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

export const formatearFecha = (fechaString: unknown): string => {
  const formatos: string[] = [
    'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD',
    'DD/MM/YYYY', 'D/M/YYYY', 'DD-MM-YYYY', 'D-M-YYYY',
    'MM-DD-YYYY', 'MM/DD/YYYY', 'DD.MM.YYYY',
    'YYYY-MM-DDTHH:mm:ss', 'DD/MM/YYYY HH:mm:ss', 'MM/DD/YYYY HH:mm:ss',
    // Años con 2 dígitos
    'DD/MM/YY', 'D/M/YY', 'DD-MM-YY', 'D-M-YY',
    'MM/DD/YY', 'MM-DD-YY', 'DD.MM.YY'
  ]

  if (fechaString === null || fechaString === undefined) {
    return obtenerFechaServidor()
  }

  const limpio = String(fechaString).trim()

  if (limpio === '') {
    return obtenerFechaServidor()
  }

  // Si ya está en formato YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(limpio)) {
    const [y, m, d] = limpio.split('-')
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  // Intentar con los formatos previstos
  for (const fmt of formatos) {
    const parsed = dayjs(limpio, fmt, true)
    if (parsed.isValid()) {
      return parsed.format('YYYY-MM-DD')
    }
  }

  // Intento final automático
  const ultimoIntento = dayjs(limpio)
  if (ultimoIntento.isValid()) {
    return ultimoIntento.format('YYYY-MM-DD')
  }

  return obtenerFechaServidor()
}

export default formatearFecha
