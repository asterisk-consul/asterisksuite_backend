import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export type SupportedFileType = 'excel' | 'csv' | 'json'

export interface ParseResult<T = any> {
  rows: T[]
  meta: {
    type: SupportedFileType
    totalRows: number
    sheetName?: string
  }
}

export class FileParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileParseError'
  }
}

export function useFileParser() {
  /* =========================
   * Detectar tipo de archivo
   * ========================= */
  const detectFileType = (file: File): SupportedFileType => {
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (!ext) {
      throw new FileParseError('Archivo sin extensión')
    }

    if (['xls', 'xlsx'].includes(ext)) return 'excel'
    if (ext === 'csv') return 'csv'
    if (ext === 'json') return 'json'

    throw new FileParseError(`Tipo de archivo no soportado: .${ext}`)
  }

  /* =========================
   * API pública
   * ========================= */
  const parseFile = async (file: File): Promise<ParseResult> => {
    const type = detectFileType(file)

    if (type === 'excel') return parseExcel(file)
    if (type === 'csv') return parseCSV(file)
    if (type === 'json') return parseJSON(file)

    throw new FileParseError('Tipo de archivo no soportado')
  }

  /* =========================
   * Excel → SOLO Hoja 1
   * ========================= */
  const parseExcel = (file: File): Promise<ParseResult<any[]>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        try {
          if (!reader.result) {
            throw new FileParseError('No se pudo leer el archivo Excel')
          }

          const data = new Uint8Array(reader.result as ArrayBuffer)
          const workbook = XLSX.read(data, {
            type: 'array',
            cellDates: true
          })

          const sheetName = workbook.SheetNames[0]
          if (!sheetName) {
            throw new FileParseError('El Excel no contiene hojas')
          }

          const worksheet = workbook.Sheets[sheetName]
          if (!worksheet) {
            throw new FileParseError('No se pudo acceder a la Hoja 1')
          }

          const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, {
            header: 1,
            defval: null,
            blankrows: false
          })

          // ⬅️ FILTRADO DEFENSIVO: solo filas que sean arrays
          const rows = rawRows.filter(
            (row) => Array.isArray(row) && row.length > 0
          )

          resolve({
            rows,
            meta: {
              type: 'excel',
              totalRows: rows.length,
              sheetName
            }
          })
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () =>
        reject(new FileParseError('Error leyendo el archivo Excel'))

      reader.readAsArrayBuffer(file)
    })
  }

  /* =========================
   * CSV → matriz de filas
   * ========================= */
  const parseCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false, // ⬅️ CLAVE: siempre filas
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          if (!Array.isArray(results.data)) {
            reject(new FileParseError('Formato CSV inválido'))
            return
          }

          resolve({
            rows: results.data as any[][],
            meta: {
              type: 'csv',
              totalRows: results.data.length
            }
          })
        },
        error: () => reject(new FileParseError('Error parseando archivo CSV'))
      })
    })
  }

  /* =========================
   * JSON → normalizado a filas
   * ========================= */
  const parseJSON = async (file: File): Promise<ParseResult> => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!Array.isArray(data)) {
        throw new FileParseError('El JSON debe ser un array')
      }

      // Si viene como array de objetos → convertir a matriz
      const rows: any[][] = data.map((item) =>
        Array.isArray(item) ? item : Object.values(item)
      )

      return {
        rows,
        meta: {
          type: 'json',
          totalRows: rows.length
        }
      }
    } catch (err) {
      if (err instanceof FileParseError) throw err
      throw new FileParseError('Error leyendo archivo JSON')
    }
  }

  return {
    parseFile,
    detectFileType
  }
}
