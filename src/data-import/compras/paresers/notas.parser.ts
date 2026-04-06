// compras/parsers/nota.parser.ts
import { Parser, ParseResult } from '../../core/interfaces';
import { NotaRaw, notaSchema } from '../schemas/notas.schema';
import { z, ZodError } from 'zod';

type Row = Record<string, unknown>;

function parseExcelDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;

  // Si es número (formato fecha de Excel)
  if (typeof value === 'number') {
    if (value <= 0) return null;

    // Excel cuenta desde 1900-01-01, pero tiene un bug que considera 1900 como año bisiesto
    // Por eso se ajusta con 1899-12-30
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);

    // Validar que la fecha sea válida
    if (!isNaN(date.getTime())) {
      return date;
    }
    return null;
  }

  // Si es string
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Verificar si es un número dentro de un string (formato Excel a veces viene así)
    const numberValue = parseFloat(trimmed);
    if (!isNaN(numberValue) && trimmed.match(/^\d+(\.\d+)?$/)) {
      return parseExcelDate(numberValue);
    }

    // Intentar parsear la fecha
    let date = new Date(trimmed);

    // Si la fecha no es válida, intentar con formato DD/MM/YYYY o MM/DD/YYYY
    if (isNaN(date.getTime())) {
      // Intentar con formato YYYY-MM-DD (ISO)
      const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        date = new Date(
          parseInt(isoMatch[1]),
          parseInt(isoMatch[2]) - 1,
          parseInt(isoMatch[3]),
        );
      } else {
        // Intentar con formato DD/MM/YYYY
        const dmYMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dmYMatch) {
          date = new Date(
            parseInt(dmYMatch[3]),
            parseInt(dmYMatch[2]) - 1,
            parseInt(dmYMatch[1]),
          );
        }
      }
    }

    // Validar si la fecha es válida
    if (!isNaN(date.getTime())) {
      return date;
    }

    // Si llegamos aquí, la fecha no es válida
    return null;
  }

  return null;
}

function normalizeRow(row: Row): Record<string, unknown> {
  return Object.keys(row).reduce(
    (acc, key) => {
      acc[key.toUpperCase().replace(/\s+/g, '_')] = row[key];
      return acc;
    },
    {} as Record<string, unknown>,
  );
}
const excelDate = z.preprocess(
  (value) => parseExcelDate(value),
  z.date().nullable().optional(),
);

function mapRow(n: Record<string, unknown>): NotaRaw {
  return notaSchema.parse({
    Fec_Vto: excelDate.parse(n.FEC_VTO),
    Nombre: n.NOMBRE,
    Direccion: n.DIRECCION,
    Localidad: n.LOCALIDAD,
    Imp_Gravado: n.IMP_GRAVADO,
    Imp_Exento: n.IMP_EXENTO,
    Imp_IVA1: n.IMP_IVA1,
    COM_Perc_IIBB: n.COM_PERC_IIBB,
    COM_Perc_Mun: n.COM_PERC_MUN,
    COM_Perc_IVA: n.COM_PERC_IVA,
    Imp_Total: n.IMP_TOTAL,
    Estado: n.ESTADO,
    Unidades: n.UNIDADES,
    // opcionales que puede traer FC también
    Comprobante: n.COMPROBANTE,
    Concepto: n.CONCEPTO,
    fecha_carga: parseExcelDate(n.FECHA_CARGA),
  });
}

export class NotaParser implements Parser<NotaRaw> {
  parse(raw: unknown[]): NotaRaw[] {
    return raw.map((row) => mapRow(normalizeRow(row as Row)));
  }

  parseWithErrors(raw: unknown[]): ParseResult<NotaRaw> {
    const success: NotaRaw[] = [];
    const errors: ParseResult<NotaRaw>['errors'] = [];

    raw.forEach((row, index) => {
      try {
        success.push(mapRow(normalizeRow(row as Row)));
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push({
            row: index + 2,
            data: row,
            errors: error.issues.map(
              (e) => `${e.path.join('.')}: ${e.message}`,
            ),
          });
        } else {
          errors.push({
            row: index + 2,
            data: row,
            errors: ['Error desconocido'],
          });
        }
      }
    });

    return { success, errors };
  }
}
