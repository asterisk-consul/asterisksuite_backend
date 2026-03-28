// compras.schema.ts
import { z } from 'zod';

export const facturaCompraSchema = z.object({
  Comprobante: z.string(), // ← era z.number(), ahora string
  Nombre: z.string(),
  Motivo_det: z.string().optional(),
  Fecha: z.coerce.date(),
  Imp_total: z.coerce.number(),
  Imp_gravado: z.coerce.number(),
  Concepto: z.string(),
  Imp_IVA1: z.coerce.number(),
  Imp_IVA2: z.coerce.number(),
  Imp_IVA3: z.coerce.number(),
  COM_perc_IIBB: z.coerce.number(),
  COM_perc_Mun: z.coerce.number(),
  COM_perc_IVA: z.coerce.number(),
  Imp_Excento: z.coerce.number(),
});

export type FacturaCompraRaw = z.infer<typeof facturaCompraSchema>;
