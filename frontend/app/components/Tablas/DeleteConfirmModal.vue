<script setup lang="ts">
const props = defineProps<{
  open: boolean
  count: number
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const deleteConfirmText = ref('')

const canDelete = computed(() => deleteConfirmText.value === 'eliminar')

function onConfirm() {
  if (!canDelete.value) return
  emit('confirm')
  deleteConfirmText.value = ''
}

function onClose() {
  deleteConfirmText.value = ''
  emit('cancel')
}
</script>

<template>
  <UModal :open="open" @update:open="onClose">
    <template #content>
      <div class="p-6 space-y-4">
        <!-- Header -->
        <div class="flex items-start gap-3">
          <div
            class="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-triangle-alert"
              class="text-red-600 dark:text-red-400 text-lg"
            />
          </div>

          <div>
            <h3 class="text-base font-semibold text-highlighted">
              ¿Eliminar {{ count }} fila{{ count !== 1 ? 's' : '' }}?
            </h3>

            <p class="text-sm text-muted mt-0.5">
              Esta acción es
              <strong class="text-red-600 dark:text-red-400">
                permanente e irreversible
              </strong>
              . Los datos eliminados no podrán recuperarse.
            </p>
          </div>
        </div>

        <!-- Warning -->
        <div
          class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3"
        >
          <p class="text-sm text-red-700 dark:text-red-300 font-medium">
            ⚠️ No hay vuelta atrás. Esta operación no puede deshacerse.
          </p>
        </div>

        <!-- Text confirm -->
        <div class="space-y-1.5">
          <label class="text-sm text-default">
            Para confirmar, escribe
            <code
              class="font-mono font-semibold bg-muted px-1.5 py-0.5 rounded text-red-600 dark:text-red-400"
            >
              eliminar
            </code>
            :
          </label>

          <UInput
            v-model="deleteConfirmText"
            placeholder="eliminar"
            :color="deleteConfirmText && !canDelete ? 'error' : 'neutral'"
            autofocus
            @keydown.enter="onConfirm"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-1">
          <UButton variant="ghost" @click="onClose">Cancelar</UButton>

          <UButton
            color="error"
            icon="i-lucide-trash-2"
            :disabled="!canDelete"
            @click="onConfirm"
          >
            Eliminar definitivamente
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
