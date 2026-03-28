<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'Changelog'
const description = 'Historial de cambios del sistema'

useSeoMeta({
  title,
  description
})
</script>

<template>
  <div class="min-h-screen xl:grid xl:grid-cols-2">
    <!-- LADO IZQUIERDO -->
    <UPageSection
      title="Changelog"
      description="Historial de cambios del sistema"
      orientation="vertical"
      :links="[
        {
          label: 'Volver',
          icon: 'i-lucide-arrow-left',
          variant: 'ghost',
          size: 'md',
          to: '/'
        }
      ]"
      :ui="{
        root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
        container: 'h-full items-center justify-center',
        wrapper: 'flex flex-col',
        title: 'text-left text-4xl',
        description: 'text-left max-w-lg'
      }"
    >
      <template #top>
        <SkyBg />
        <div
          class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2"
        />
      </template>

      <!-- <template #headline>
          <AppLogo class="w-auto h-6 text-highlighted" />
        </template> -->
    </UPageSection>

    <!-- CONTENIDO DINÁMICO -->
    <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
      <UColorModeButton class="fixed top-4 right-4 z-10" />

      <slot />
      <!-- 🔥 clave -->
    </section>
  </div>
</template>
