// compras.parser.ts
import { Parser, ParseResult } from '../../core/interfaces';
import {
  FacturaCompraRaw,
  facturaCompraSchema,
} from '../schemas/compras.schema';
import { ZodError } from 'zod';

type FacturaCompraRow = Record<string, unknown>;

function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  // caso Excel number (serial date)
  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const ms = value * 86400000;
    return new Date(excelEpoch.getTime() + ms);
  }

  // caso string
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
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
  return facturaCompraSchema.parse({
    Comprobante: normalized.COMPROBANTE,
    Nombre: normalized.NOMBRE, // ← corregido (era DESCRIP)
    Motivo_det: normalized.MOTIVO_DET,
    Concepto: normalized.CONCEPTO,
    Fecha: parseExcelDate(normalized.FECHA),
    Imp_gravado: normalized.IMP_GRAVADO, // ← capitalización correcta
    Imp_total: normalized.IMP_TOTAL,
    Imp_IVA1: normalized.IMP_IVA1,
    Imp_IVA2: normalized.IMP_IVA2,
    Imp_IVA3: normalized.IMP_IVA3,
    Imp_Excento: normalized.IMP_EXENTO, // ← nombre correcto del schema
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
