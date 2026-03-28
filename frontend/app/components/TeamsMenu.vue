<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{ collapsed?: boolean }>()

const teams = [
  {
    label: 'Don Andres',
    avatar: { src: '/img/donandres.webp', alt: 'Don Andres' }
  },
  {
    label: 'Flowid',
    avatar: { src: '/img/LogoFlows.png', alt: 'flows' },
    url: 'https://flowsma.com/donandres/#/workspace'
  }
]

const selectedTeam = useState('selectedTeam', () => teams[0])

const items = computed<DropdownMenuItem[][]>(() => [
  teams.map(team => ({
    ...team,
    onSelect() {
      selectedTeam.value = team
    }
  }))
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
  </UDropdownMenu>
</template>
