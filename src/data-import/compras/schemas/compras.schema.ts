// compras/schemas/compras.schema.ts
import { z } from 'zod';

// Maneja números argentinos: "413.547,75" → 413547.75
// compras/schemas/compras.schema.ts — volver a z.coerce.number()
export const facturaCompraSchema = z.object({
  Comprobante: z.string(),
  Nombre: z.string(),
  Motivo_det: z.string().optional(),
  fecha_carga: z.coerce.date(),
  Imp_total: z.coerce.number().default(0),
  Imp_gravado: z.coerce.number().default(0),
  Concepto: z.string(),
  Imp_IVA1: z.coerce.number().default(0),
  Imp_IVA2: z.coerce.number().default(0),
  Imp_IVA3: z.coerce.number().default(0),
  COM_perc_IIBB: z.coerce.number().default(0),
  COM_perc_Mun: z.coerce.number().default(0),
  COM_perc_IVA: z.coerce.number().default(0),
  Imp_Excento: z.coerce.number().default(0),
});

export type FacturaCompraRaw = z.infer<typeof facturaCompraSchema>;
