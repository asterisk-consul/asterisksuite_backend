<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/modulos/auth/auth.store'
import { schema, type Schema } from './schema/register.schema'
import { fields } from './fields'

definePageMeta({
  layout: 'auth',
  auth: false
})

const toast = useToast()
const auth = useAuthStore()

const errorMessage = ref('')
const showError = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    showError.value = false

    await auth.register({
      name: payload.data.name,
      email: payload.data.email,
      password: payload.data.password
    })

    toast.add({
      title: 'Registro exitoso',
      description: `Bienvenido ${auth.user?.name}`,
      color: 'success'
    })

    await navigateTo('/')
  } catch (err: any) {
    errorMessage.value =
      err?.message || err?.data?.message || 'Error al registrarse'

    showError.value = true
  }
}

function closeAlert() {
  showError.value = false
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    title="Crear cuenta"
    description="Registrate para comenzar"
    icon="i-lucide-user-plus"
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
        label="Registrarse"
        type="submit"
        class="w-full flex justify-center"
      />
    </template>

    <!-- Footer -->
    <template #footer>
      ¿Ya tenés cuenta?
      <ULink to="/login" class="text-primary font-medium">Ingresar</ULink>
    </template>
  </UAuthForm>
</template>
