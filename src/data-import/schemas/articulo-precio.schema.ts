import { z } from 'zod';

export const ArticuloPrecioSchema = z.object({
  codigo: z.string(),
  precio: z.coerce.number(),
  proveedor: z.string(),
});

export type ArticuloPrecioRaw = z.infer<typeof ArticuloPrecioSchema>;
