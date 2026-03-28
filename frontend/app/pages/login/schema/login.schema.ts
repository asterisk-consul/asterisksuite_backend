import * as z from 'zod'
export const schema = z.object({
  username: z
    .string({
      required_error: 'Username requerido'
    })
    .min(3, 'Mínimo 3 caracteres'),

  password: z
    .string({
      required_error: 'Password requerido'
    })
    .min(4, 'Mínimo 4 caracteres')
})

export type Schema = z.output<typeof schema>
