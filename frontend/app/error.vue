<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Paguina no encontrada',
  description: 'Lo sentimos, la página que estás buscando no existe.'
})

useHead({
  htmlAttrs: {
    lang: 'es'
  }
})
</script>

<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>
