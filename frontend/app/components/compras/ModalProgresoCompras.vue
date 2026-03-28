<template>
  <div class="p-4">
    <h2 class="font-bold text-lg">Procesando registros…</h2>

    <p class="mt-2 text-gray-600">
      {{ mensaje }}
    </p>

    <div class="mt-4 w-full bg-gray-200 h-3 rounded">
      <div
        class="bg-primary h-3 rounded transition-all"
        :style="{ width: progreso + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  mensaje: String,
  progreso: Number
})
</script>
