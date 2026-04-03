import type { AuthFormField } from '@nuxt/ui'

export const fields: AuthFormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Nombre',
    placeholder: 'Tu nombre'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'correo@email.com'
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: '******'
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmar contraseña',
    placeholder: '******'
  }
]
