import type { AuthFormField } from '@nuxt/ui'

export const fields: AuthFormField[] = [
  {
    name: 'currentPassword',
    type: 'password',
    label: 'Contraseña actual',
    placeholder: '******'
  },
  {
    name: 'newPassword',
    type: 'password',
    label: 'Nueva contraseña',
    placeholder: '******'
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmar nueva contraseña',
    placeholder: '******'
  }
]
