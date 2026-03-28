<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'changelog'
})

import rawVersions from '~~/versiones/versions.json'

const versions = rawVersions
  .slice()
  .reverse()
  .map((v) => ({
    tag: v.version,
    title: `v${v.version}`,
    date: v.date,
    markdown: generateMarkdown(v)
  }))

function generateMarkdown(v: any) {
  let md = ''

  // 🧠 NOTAS
  if (v.notes) {
    md += `${v.notes}\n\n`
  }

  // 🧩 CAMBIOS agrupados por tipo
  if (v.changes) {
    const grouped: Record<string, any[]> = {
      added: [],
      changed: [],
      fix: []
    }

    v.changes.forEach((c: any) => {
      if (!c.type) return
      grouped[c.type]?.push(c)
    })

    // Render dinámico
    Object.entries(grouped).forEach(([type, items]) => {
      if (!items.length) return

      const titleMap: Record<string, string> = {
        added: '🚀 Nuevas funcionalidades',
        changed: '✨ Mejoras',
        fix: '🐛 Correcciones'
      }

      md += `### ${titleMap[type]}\n\n`

      items.forEach((c: any) => {
        if (c.url) {
          md += `- [${c.id}](${c.url}) - ${c.title}\n`
        } else {
          md += `- ${c.title}\n`
        }
      })

      md += `\n`
    })
  }

  // 📦 MÓDULOS
  if (v.modules?.length) {
    md += `### Módulos\n\n`

    v.modules.forEach((m: any) => {
      md += `- **${m.name}**: ${m.version}\n`
    })
  }

  return md
}
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-6 sm:py-24 lg:py-32 w-full max-w-5xl mx-auto',
      indicator: 'inset-y-0'
    }"
  >
    <UChangelogVersion
      v-for="version in versions"
      :key="version.tag"
      v-bind="version"
      :ui="{
        root: 'flex items-start',
        container: 'flex-1 w-full',
        header: 'border-b border-default pb-4',
        title: 'text-3xl',
        date: 'text-xs/9 text-highlighted font-mono',
        indicator: 'sticky top-0 pt-16'
      }"
    >
      <template #body>
        <MDC v-if="version.markdown" :value="version.markdown" />
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
