<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'changelog'
})

import type { ChangelogVersion } from '~~/server/api/changelog'

const { data: versions } = await useFetch<ChangelogVersion[]>('/api/changelog')
const safeVersions = computed(() => versions.value || [])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-4 sm:py-22 lg:py-30 w-full max-w-5xl mx-auto',
      indicator: 'inset-y-0'
    }"
  >
    <UChangelogVersion
      v-for="version in safeVersions"
      :key="version.tag"
      :title="version.title"
      :date="formatDate(version.date)"
      :ui="{
        root: 'flex items-start py-2',
        container: 'flex-1 w-full',
        header: 'border-b border-default pb-2', // antes era pb-4
        title: 'text-xl font-semibold', // antes text-3xl
        date: 'text-xs/9 text-toned whitespace-nowrap',
        indicator: 'sticky top-0 pt-2'
      }"
    >
      <template #body>
        <MDCRenderer v-if="version.body" :body="version.body" />
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
