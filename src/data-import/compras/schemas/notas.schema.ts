// compras/schemas/notas.schema.ts
import { z } from 'zod';

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

export const notaSchema = z.object({
  Fec_Vto: z.coerce.date().optional(),
  Clie_Prov: z.string().optional(),
  Nombre: z.string(),
  Direccion: z.string().optional(),
  Localidad: z.string().optional(),
  Imp_Gravado: argNumber,
  Imp_Exento: argNumber,
  Imp_IVA1: argNumber,
  COM_Perc_IIBB: argNumber,
  COM_Perc_Mun: argNumber,
  COM_Perc_IVA: argNumber,
  Imp_Total: argNumber,
  Estado: z.string().optional(),
  Unidades: argNumber,
  Comprobante: z.string().optional(),
  Concepto: z.string().optional(),
  Fecha: z.coerce.date().optional(),
});

export type NotaRaw = z.infer<typeof notaSchema>;
