<script setup lang="ts">
import { links as logistica } from '~/pages/logistica/logisticaNavigation'
import SidebarModules from '~/components/ui/SidebarModules.vue'

const { mainCollapsed } = useSidebarState()
const moduleCollapsed = ref(false)
const { items: breadcrumbs } = useBreadcrumbs()

provide('moduleSidebarCollapsed', moduleCollapsed)

const items = [
  {
    label: 'Crear Viaje',
    icon: 'i-lucide-plus',
    to: '/logistica/viajes/trips/create',
    kbds: ['meta', 'v'],
    onSelect() {
      navigateTo('/logistica/viajes/create')
    }
  },
  {
    label: 'Crear Orden de Despacho',
    icon: 'i-lucide-plus',
    to: '/logistica/transport/dispatch-orders/create',
    kbds: ['meta', 'd'],
    onSelect() {
      navigateTo('/logistica/viajes/dispatch-orders/create')
    }
  },
  {
    label: 'Crear un Corredor',
    icon: 'i-lucide-plus',
    to: '/logistica/viajes/corridors/create',
    kbds: ['meta', 'e'],
    onSelect() {
      navigateTo('/logistica/viajas/corridors/create')
    }
  }
]

defineShortcuts(extractShortcuts(items))
</script>

<template>
  <NuxtLayout name="default">
    <UDashboardPanel :ui="{ body: '!p-0' }">
      <!-- NAVBAR -->
      <template #header>
        <UDashboardNavbar title="Logística">
          <template #leading>
            <UButton
              icon="i-lucide-panel-left-close"
              variant="ghost"
              color="neutral"
              @click="mainCollapsed = !mainCollapsed"
            />
          </template>

          <template #right>
            <UDropdownMenu
              :items="items"
              :content="{
                align: 'start',
                side: 'left',
                sideOffset: 8
              }"
            >
              <UTooltip text="Crear">
                <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
              </UTooltip>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>

      <!-- BODY -->
      <template #body>
        <div class="flex h-full">
          <SidebarModules
            :links="logistica"
            v-model:collapsed="moduleCollapsed"
          />

          <main class="flex-1 flex flex-col">
            <UBreadcrumb :items="breadcrumbs" class="pl-6 pt-6" />

            <div class="flex-1 overflow-y-auto p-6">
              <slot />
            </div>
          </main>
        </div>
      </template>
    </UDashboardPanel>
  </NuxtLayout>
</template>
