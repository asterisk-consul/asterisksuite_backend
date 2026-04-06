// compras/schemas/compras.schema.ts
import { z } from 'zod';

// Maneja números argentinos: "413.547,75" → 413547.75
const argNumber = z.preprocess((val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.trim().replace(/\./g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return val;
}, z.number().default(0));

export const facturaCompraSchema = z.object({
  Comprobante: z.string(),
  Nombre: z.string(),
  Motivo_det: z.string().optional(),
  Fecha: z.coerce.date(),
  Imp_total: argNumber,
  Imp_gravado: argNumber,
  Concepto: z.string(),
  Imp_IVA1: argNumber,
  Imp_IVA2: argNumber,
  Imp_IVA3: argNumber,
  COM_perc_IIBB: argNumber,
  COM_perc_Mun: argNumber,
  COM_perc_IVA: argNumber,
  Imp_Excento: argNumber,
});

export type FacturaCompraRaw = z.infer<typeof facturaCompraSchema>;
