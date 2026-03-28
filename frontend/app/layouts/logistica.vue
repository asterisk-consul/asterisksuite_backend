<script setup lang="ts">
import { links as logistica } from '~/pages/logistica/logisticaNavigation'
import SidebarModules from '~/components/ui/SidebarModules.vue'

const { mainCollapsed } = useSidebarState()
const moduleCollapsed = ref(false)

provide('moduleSidebarCollapsed', moduleCollapsed)
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
        </UDashboardNavbar>
      </template>

      <!-- BODY -->
      <template #body>
        <div class="flex h-full">
          <!-- SIDEBAR DE MÓDULO -->
          <SidebarModules
            :links="logistica"
            v-model:collapsed="moduleCollapsed"
          />

          <!-- CONTENIDO -->
          <main class="flex-1 overflow-hidden">
            <div class="h-full overflow-y-auto p-6">
              <slot />
            </div>
          </main>
        </div>
      </template>
    </UDashboardPanel>
  </NuxtLayout>
</template>
