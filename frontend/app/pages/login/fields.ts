import type { AuthFormField } from '@nuxt/ui'
export const fields: AuthFormField[] = [
  {
    name: 'username', // <-- cambió de email a username
    type: 'text', // ya no es email
    label: 'Usuario',
    placeholder: 'Ingresa tu usuario',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Ingresa tu contraseña',
    required: true
  },
  {
    name: 'remember',
    label: 'Recordarme',
    type: 'checkbox'
  }
]
