import { z } from 'zod'

export const distribucionSchema = z.object({
  clasificacion: z.object({
    label: z.string().min(1, 'Debe seleccionar una clasificación'),
    value: z.string().min(1, 'Debe seleccionar una clasificación')
  }),
  porcentaje: z
    .number()
    .min(0.0001, 'El porcentaje debe ser mayor a 0')
    .max(1, 'El porcentaje no puede superar 100%'),
  importes: z.object({
    totalimpuestos: z.number(),
    totalprecio: z.number(),
    varcn0: z.number(),
    varcn1: z.number(),
    varcn2: z.number(),
    varcn3: z.number()
  })
})

export const distribucionesSchema = z
  .array(distribucionSchema)
  .min(1, 'Debe agregar al menos una distribución')
