<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const collapsed = defineModel<boolean>('collapsed')

defineProps<{
  links: NavigationMenuItem[][]
}>()
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    v-model:collapsed="collapsed"
    class="border-r border-default"
  >
    <template #default="{ collapsed }">
      <template v-for="(group, index) in links" :key="index">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="group"
          orientation="vertical"
          tooltip
        />
      </template>
    </template>
  </UDashboardSidebar>
</template>
