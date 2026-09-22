<template>
  <div class="min-h-screen bg-default">
    <header
      class="flex items-center gap-2 border-b border-default px-6 py-4"
    >
      <UIcon name="i-lucide-upload" class="size-5 text-primary" />
      <span class="font-semibold">Importador de precios</span>
    </header>

    <main class="px-6 py-4">
      <slot />
    </main>
  </div>
</template>
