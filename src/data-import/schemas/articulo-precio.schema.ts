import { z } from 'zod';

export const ArticuloPrecioSchema = z.object({
  codigo: z.string(),
  precio: z.coerce.number(),
});

export type ArticuloPrecioRaw = z.infer<typeof ArticuloPrecioSchema>;
