<!-- components/ui/MainSidebar.vue -->
<script setup lang="ts">
import { navigationLinks } from '~/data/navigation'
import { useVersion } from '~/composables/useVersion'

const props = defineProps<{
  open?: boolean
  resizable?: boolean
  withFooter?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:collapsed': [value: boolean]
}>()

const versions = useVersion()
</script>

<template>
  <UDashboardSidebar
    collapsible
    :resizable="resizable"
    :open="open"
    class="bg-elevated/25"
    :ui="withFooter ? { footer: 'lg:border-t lg:border-default' } : {}"
    @update:open="emit('update:open', $event)"
    @update:collapsed="emit('update:collapsed', $event)"
  >
    <template #header="{ collapsed }">
      <TeamsMenu :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UDashboardSearchButton
        :collapsed="collapsed"
        class="bg-transparent ring-default"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationLinks[0]"
        orientation="vertical"
        tooltip
        popover
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationLinks[1]"
        orientation="vertical"
        tooltip
        class="mt-auto"
      />
    </template>

    <template v-if="withFooter" #footer="{ collapsed }">
      <div class="flex flex-col w-full">
        <UserMenu :collapsed="collapsed" />

        <div class="py-3 flex justify-center">
          <NuxtLink
            to="/changelog/"
            class="flex items-center text-xs text-muted hover:text-foreground transition-colors"
          >
            <span class="font-medium">v{{ versions.version }}</span>

            <UBadge
              v-if="versions.stage && !collapsed"
              size="xs"
              variant="soft"
              color="neutral"
              class="ml-2 capitalize"
            >
              {{ versions.stage }}
            </UBadge>
          </NuxtLink>
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>
