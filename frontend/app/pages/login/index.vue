<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/modulos/auth/auth.store'
import { schema } from './schema/login.schema'
import type { Schema } from './schema/login.schema'
import { fields } from './fields'

definePageMeta({
  layout: 'public',
  auth: false
})

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const errorMessage = ref('')
const showError = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    showError.value = false

    await auth.login(payload.data.username, payload.data.password)

    toast.add({
      title: 'Ingreso exitoso',
      description: `Bienvenido ${auth.user?.name}`,
      color: 'success'
    })

    await navigateTo('/')
  } catch (err: any) {
    errorMessage.value =
      err?.message || err?.data?.message || 'Usuario o contraseña incorrectos'

    showError.value = true
  }
}

// Cerrar alerta
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
        title="Bienvenido"
        description="Ingresa usuario y contraseña"
        icon="i-lucide-user"
        @submit="onSubmit"
      >
        <template #description>
          No tienes una cuenta?
          <ULink to="/register" class="text-primary font-medium">
            Registrate
          </ULink>
          .
        </template>
        <template #password-hint>
          <ULink
            to="/change-password"
            class="text-primary font-medium"
            tabindex="-1"
          >
            Olvidaste tu contraseña?
          </ULink>
        </template>

        <!-- Error dinámico -->
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
        <template #submit>
          <UButton
            label="Ingresar"
            type="submit"
            class="w-full flex justify-center"
          />
        </template>

        <template #footer>
          Al ingresar, aceptas nuestros
          <ULink to="#" class="text-primary font-medium">Términos de uso</ULink>
          .
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
