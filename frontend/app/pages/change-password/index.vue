<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/modulos/auth/auth.store'
import { schema } from './schema/change-password.schema'
import type { Schema } from './schema/change-password.schema'
import { fields } from './fields'

definePageMeta({
  layout: 'auth',
  auth: true
})

const toast = useToast()
const auth = useAuthStore()

const errorMessage = ref('')
const showError = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    showError.value = false

    await auth.changePassword({
      currentPassword: payload.data.currentPassword,
      newPassword: payload.data.newPassword
    })

    toast.add({
      title: 'Contraseña actualizada',
      description: 'Se cerraron todas las sesiones por seguridad',
      color: 'success'
    })

    // opcional: redirigir al login porque el backend revoca sesiones
    await navigateTo('/login')
  } catch (err: any) {
    errorMessage.value =
      err?.message || err?.data?.message || 'Error al cambiar contraseña'

    showError.value = true
  }
}

function closeAlert() {
  showError.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center mx-auto h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Cambiar contraseña"
        description="Actualizá tu contraseña de forma segura"
        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <!-- Error -->
        <template #validation>
          <UAlert
            v-if="showError"
            :title="errorMessage"
            color="error"
            icon="i-lucide-info"
            dismissible
            @close="closeAlert"
          />
        </template>

        <!-- Submit -->
        <template #submit>
          <UButton
            label="Actualizar contraseña"
            type="submit"
            class="w-full flex justify-center"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
