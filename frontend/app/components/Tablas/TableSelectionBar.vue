<script setup lang="ts">
const props = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  'open-delete': []
}>()
</script>

<template>
  <div
    v-if="count > 0"
    class="flex items-center justify-between px-4 py-1 border-red-200 dark:border-red-950 rounded-lg border-2"
  >
    <span class="text-sm font-medium text-red-700 dark:text-red-400">
      {{ count }} fila{{ count !== 1 ? 's' : '' }} seleccionada{{
        count !== 1 ? 's' : ''
      }}
    </span>

    <UButton
      color="error"
      variant="soft"
      icon="i-lucide-trash-2"
      size="sm"
      @click="emit('open-delete')"
    >
      Eliminar selección
    </UButton>
  </div>
</template>
