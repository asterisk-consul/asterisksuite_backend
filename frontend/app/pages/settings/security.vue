<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/modulos/auth/auth.store'

const auth = useAuthStore()
const toast = useToast()

// ✅ Schema con confirmación
const passwordSchema = z
  .object({
    current: z.string().min(8, 'Mínimo 8 caracteres'),
    new: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string().min(8, 'Mínimo 8 caracteres')
  })
  .refine((data) => data.new === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm']
  })

type PasswordSchema = z.output<typeof passwordSchema>

// ✅ Estado
const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
  confirm: undefined
})

// ✅ Validación adicional
const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []

  if (state.current && state.new && state.current === state.new) {
    errors.push({
      name: 'new',
      message: 'La nueva contraseña debe ser diferente'
    })
  }

  return errors
}

// ✅ Submit real
async function onSubmit(event: FormSubmitEvent<PasswordSchema>) {
  try {
    await auth.changePassword({
      currentPassword: event.data.current,
      newPassword: event.data.new
    })

    toast.add({
      title: 'Contraseña actualizada',
      description: 'Se cerraron todas las sesiones',
      color: 'success'
    })

    await navigateTo('/login')
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description:
        err?.message || err?.data?.message || 'No se pudo actualizar',
      color: 'error'
    })
  }
}
</script>

<template>
  <UPageCard
    title="Password"
    description="Confirmá tu contraseña actual antes de cambiarla."
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      @submit="onSubmit"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Contraseña actual"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="Nueva contraseña"
          class="w-full"
        />
      </UFormField>

      <UFormField name="confirm">
        <UInput
          v-model="password.confirm"
          type="password"
          placeholder="Confirmar contraseña"
          class="w-full"
        />
      </UFormField>

      <UButton label="Actualizar" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="Account"
    description="Si ya no querés usar el servicio, podés eliminar tu cuenta. Esta acción es irreversible."
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="Eliminar cuenta" color="error" />
    </template>
  </UPageCard>
</template>
