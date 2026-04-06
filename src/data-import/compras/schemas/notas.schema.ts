// compras/schemas/notas.schema.ts
import { z } from 'zod';

// compras/schemas/notas.schema.ts — ídem
export const notaSchema = z.object({
  Fec_Vto: z.coerce.date().optional(),
  Clie_Prov: z.string().optional(),
  Nombre: z.string(),
  Direccion: z.string().optional(),
  Localidad: z.string().optional(),
  Imp_Gravado: z.coerce.number().default(0),
  Imp_Exento: z.coerce.number().default(0),
  Imp_IVA1: z.coerce.number().default(0),
  COM_Perc_IIBB: z.coerce.number().default(0),
  COM_Perc_Mun: z.coerce.number().default(0),
  COM_Perc_IVA: z.coerce.number().default(0),
  Imp_Total: z.coerce.number().default(0),
  Estado: z.string().optional(),
  Unidades: z.coerce.number().default(0),
  Comprobante: z.string().optional(),
  Concepto: z.string().optional(),
  fecha_carga: z.coerce.date().optional(),
});

export type NotaRaw = z.infer<typeof notaSchema>;
