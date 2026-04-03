import { z } from 'zod'

export const schema = z
  .object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export type Schema = z.output<typeof schema>
