<script setup lang="ts">
import { ref, computed, watch } from 'vue'

withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 0
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const open = ref(false)
const loading = ref(false)

const confirmWord = ref('')
const userInput = ref('')

function generateWord() {
  const random = Math.floor(100 + Math.random() * 900)
  confirmWord.value = `ELIMINAR-${random}`
}

watch(open, (value) => {
  if (value) {
    generateWord()
    userInput.value = ''
  }
})

const isValid = computed(() => userInput.value === confirmWord.value)

async function onSubmit() {
  if (!isValid.value) return

  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  loading.value = false
  open.value = false
  emit('confirm')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Eliminar ${count} registro${count > 1 ? 's' : ''}`"
    :description="`¿Estás seguro de eliminar ${count} registro${count > 1 ? 's' : ''}? Esta acción no se puede deshacer.`"
  >
    <slot />

    <template #body>
      <div class="space-y-4">
        <!-- Instrucción -->
        <div class="text-sm text-gray-500">
          Para confirmar, escribí exactamente:
          <span class="font-mono font-semibold text-red-600">
            {{ confirmWord }}
          </span>
        </div>

        <!-- Input -->
        <UInput
          v-model="userInput"
          placeholder="Escribí la palabra de confirmación"
          :color="userInput && !isValid ? 'error' : 'primary'"
        />

        <!-- Acciones -->
        <div class="flex justify-end gap-2 pt-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />

          <UButton
            label="Eliminar"
            color="error"
            variant="solid"
            :disabled="!isValid"
            :loading="loading"
            @click="onSubmit"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
