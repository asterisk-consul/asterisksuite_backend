// compras.parser.ts
import { Parser, ParseResult } from '../../core/interfaces';
import {
  FacturaCompraRaw,
  facturaCompraSchema,
} from '../schemas/compras.schema';
import { ZodError } from 'zod';

type FacturaCompraRow = Record<string, unknown>;

/* =========================
   💰 PARSER DE DINERO PRO
========================= */
function parseMoney(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;

  // Si ya es número → confiar
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    let cleaned = value.trim();
    if (!cleaned) return null;

    const hasCommaDecimal = cleaned.includes(',');

    if (hasCommaDecimal) {
      // Formato europeo: 1.234.567,89
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato US: 1,234,567.89
      cleaned = cleaned.replace(/,/g, '');
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/* =========================
   📅 PARSER DE FECHAS
========================= */
function parseExcelDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    if (value <= 0) return null;

    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);

    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const numberValue = parseFloat(trimmed);
    if (!isNaN(numberValue) && trimmed.match(/^\d+(\.\d+)?$/)) {
      return parseExcelDate(numberValue);
    }

    let date = new Date(trimmed);

    if (isNaN(date.getTime())) {
      const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        date = new Date(
          parseInt(isoMatch[1]),
          parseInt(isoMatch[2]) - 1,
          parseInt(isoMatch[3]),
        );
      } else {
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

    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/* =========================
   🔄 NORMALIZADOR
========================= */
function normalizeRow(row: FacturaCompraRow): Record<string, unknown> {
  const monetaryFields = new Set([
    'IMP_GRAVADO',
    'IMP_IVA1',
    'IMP_IVA2',
    'IMP_IVA3',
    'COM_PERC_IVA',
    'COM_PERC_MUN',
    'COM_PERC_IIBB',
    'IMP_EXENTO',
    'IMP_TOTAL',
  ]);

  return Object.keys(row).reduce(
    (acc, key) => {
      const normalizedKey = key.toUpperCase().replace(/\s+/g, '_');
      const value = row[key];

      if (monetaryFields.has(normalizedKey)) {
        const parsed = parseMoney(value);

        if (parsed === null && value !== null && value !== '') {
          console.warn('⚠️ Error parseando dinero', {
            field: normalizedKey,
            value,
          });
        }

        acc[normalizedKey] = parsed;
      } else {
        acc[normalizedKey] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
}

/* =========================
   🧩 MAPPER
========================= */
function mapRow(normalized: Record<string, unknown>) {
  const fechaCarga = parseExcelDate(normalized.FECHA_CARGA);

  return facturaCompraSchema.parse({
    Comprobante: normalized.COMPROBANTE,
    Nombre: normalized.NOMBRE,
    Motivo_det: normalized.MOTIVO_DET,
    Concepto: normalized.CONCEPTO,
    fecha_carga: fechaCarga,
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

/* =========================
   🚀 PARSER
========================= */
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
