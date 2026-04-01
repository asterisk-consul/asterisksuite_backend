import { z } from 'zod';
export declare const facturaCompraSchema: z.ZodObject<{
    Comprobante: z.ZodString;
    Nombre: z.ZodString;
    Motivo_det: z.ZodOptional<z.ZodString>;
    Fecha: z.ZodCoercedDate<unknown>;
    Imp_total: z.ZodCoercedNumber<unknown>;
    Imp_gravado: z.ZodCoercedNumber<unknown>;
    Concepto: z.ZodString;
    Imp_IVA1: z.ZodCoercedNumber<unknown>;
    Imp_IVA2: z.ZodCoercedNumber<unknown>;
    Imp_IVA3: z.ZodCoercedNumber<unknown>;
    COM_perc_IIBB: z.ZodCoercedNumber<unknown>;
    COM_perc_Mun: z.ZodCoercedNumber<unknown>;
    COM_perc_IVA: z.ZodCoercedNumber<unknown>;
    Imp_Excento: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type FacturaCompraRaw = z.infer<typeof facturaCompraSchema>;
