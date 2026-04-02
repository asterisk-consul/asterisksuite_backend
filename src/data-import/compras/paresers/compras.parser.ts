// compras.parser.ts
import { Parser, ParseResult } from '../../core/interfaces';
import {
  FacturaCompraRaw,
  facturaCompraSchema,
} from '../schemas/compras.schema';
import { z, ZodError } from 'zod';

type FacturaCompraRow = Record<string, unknown>;

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

function normalizeRow(row: FacturaCompraRow): Record<string, unknown> {
  return Object.keys(row).reduce(
    (acc, key) => {
      acc[key.toUpperCase().replace(/\s+/g, '_')] = row[key];
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

// Función auxiliar para no repetir el mapeo en parse y parseWithErrors
function mapRow(normalized: Record<string, unknown>) {
  const fecha = parseExcelDate(normalized.FECHA);

  return facturaCompraSchema.parse({
    Comprobante: normalized.COMPROBANTE,
    Nombre: normalized.NOMBRE,
    Motivo_det: normalized.MOTIVO_DET,
    Concepto: normalized.CONCEPTO,
    Fecha: fecha,
    Imp_gravado: normalized.IMP_GRAVADO,
    Imp_total: normalized.IMP_TOTAL,
    Imp_IVA1: normalized.IMP_IVA1,
    Imp_IVA2: normalized.IMP_IVA2,
    Imp_IVA3: normalized.IMP_IVA3,
    Imp_Excento: normalized.IMP_EXENTO,
    COM_perc_IIBB: normalized.COM_PERC_IIBB,
    COM_perc_Mun: normalized.COM_PERC_MUN,
    COM_perc_IVA: normalized.COM_PERC_IVA,
  });
}

export class FacturaCompraParser implements Parser<FacturaCompraRaw> {
  parse(raw: unknown[]): FacturaCompraRaw[] {
    return raw.map((row) => mapRow(normalizeRow(row as FacturaCompraRow)));
  }

  parseWithErrors(raw: unknown[]): ParseResult<FacturaCompraRaw> {
    const success: FacturaCompraRaw[] = [];
    const errors: ParseResult<FacturaCompraRaw>['errors'] = [];

    raw.forEach((row, index) => {
      try {
        success.push(mapRow(normalizeRow(row as FacturaCompraRow)));
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
