import { z } from 'zod';
export declare const ArticuloPrecioSchema: z.ZodObject<{
    codigo: z.ZodString;
    precio: z.ZodCoercedNumber<unknown>;
    proveedor: z.ZodString;
}, z.core.$strip>;
export type ArticuloPrecioRaw = z.infer<typeof ArticuloPrecioSchema>;
