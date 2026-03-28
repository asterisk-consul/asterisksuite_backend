import { z } from 'zod'

export const warehouseSchema = z.object({
  companyId: z.string().uuid('Company inválido'),

  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'Máximo 255 caracteres'),

  code: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),

  locationId: z.string().uuid('Location inválida').optional().or(z.literal('')),

  active: z.boolean().optional()
})

export type WarehouseForm = z.infer<typeof warehouseSchema>
