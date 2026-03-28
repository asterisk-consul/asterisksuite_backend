<script setup lang="ts">
import { navigationLinks } from '~/data/navigation'
import { useVersion } from '~/composables/useVersion'
import MainSidebar from '~/components/ui/MainSidebar.vue'
const { mainCollapsed } = useSidebarState()
const open = ref(false)

const versions = useVersion()
const route = useRoute()
const toast = useToast()

const links = navigationLinks

const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: links.flat()
  },
  {
    id: 'code',
    label: 'Code',
    items: [
      {
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${
          route.path === '/' ? '/index' : route.path
        }.vue`,
        target: '_blank'
      }
    ]
  }
])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'Este sitio utiliza cookies',
    duration: 0,
    close: false,
    actions: [
      {
        label: 'Aceptar',
        color: 'neutral',
        variant: 'outline',
        onClick: () => {
          cookie.value = 'accepted'
        }
      },
      {
        label: 'Rechazar',
        color: 'neutral',
        variant: 'ghost'
      }
    ]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <MainSidebar
      id="default"
      v-model:open="open"
      v-model:collapsed="mainCollapsed"
      resizable
      with-footer
    />

    <UDashboardSearch :groups="groups" />
    <slot />
    <NotificationsSlideover />
  </UDashboardGroup>
</template>
