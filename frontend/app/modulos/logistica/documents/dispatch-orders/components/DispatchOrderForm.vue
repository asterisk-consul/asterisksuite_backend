<script setup lang="ts">
import type { Corridor } from '~/modulos/logistica/transport/corridors/types/corridors.types'
import type { SelectMenuItem } from '~/modulos/logistica/transport/corridors/composables/useCorridors'

import { storeToRefs } from 'pinia'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'
//modal
import BusinessPartyModal from '~/modulos/logistica/master-data/bussiness-parties/components/BusinnesPartyModal.vue'
import CorridorFormModal from '~/modulos/logistica/transport/corridors/components/CorridorFormModal.vue'
//clientes
import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'
import { useBusinessParties } from '~/modulos/logistica/master-data/bussiness-parties/composable/useBusinessParties'
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'
import { useCorridorForm } from '~/modulos/logistica/transport/corridors/composables/useCorridors'
import { useTransferRatesStore } from '~/modulos/logistica/transport/transfer-rates/transfer-rates.store'
import { useTransferRate } from '~/modulos/logistica/transport/transfer-rates/useTransferRate'

import type {
  DispatchOrder,
  CreateDispatchOrderDto,
  DispatchStatus
} from '~/modulos/logistica/documents/dispatch-orders/types/dispatch-orders.types'
import type { BusinessParty } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
import type { ChipProps } from '@nuxt/ui'

const props = defineProps<{
  dispatch_order?: DispatchOrder
}>()

const emit = defineEmits<{
  submit: [dto: CreateDispatchOrderDto]
  cancel: []
}>()

const showBusinessPartiesModal = ref(false)
const selectedBusinessParty = ref<BusinessParty | undefined>(undefined)

// STORES
const businessPartiesStore = useBusinessPartiesStore()
const locationsStore = useLocationsStore()
const corridorsStore = useCorridorsStore()
const transferRatesStore = useTransferRatesStore()

const { items: businessParties } = storeToRefs(businessPartiesStore)
const { items: locations } = storeToRefs(locationsStore)
const { corridors } = storeToRefs(corridorsStore)
const { items: transferRates } = storeToRefs(transferRatesStore)

const { items } = useBusinessParties(businessParties)

const { items: transferRatesItems } = useTransferRate(transferRates)

const { items: corridorsItems } = useCorridorForm(undefined, corridors)

const showCorridorModal = ref(false)
const selectedCorridor = ref<Corridor | undefined>(undefined)

const onEditCorridor = () => {
  if (!form.corridor_id) return
  const corridor = corridors.value.find((c) => c.id === form.corridor_id)
  if (!corridor) return
  selectedCorridor.value = corridor
  showCorridorModal.value = true
}

const onCorridorSaved = async (corridor: Corridor) => {
  await corridorsStore.fetchCorridors()
  form.corridor_id = corridor.id
  selectedCorridor.value = undefined
}
const onCorridorSelect = (item: any) => {
  form.corridor_id = item?.value ?? undefined
}

const isEdit = computed(() => !!props.dispatch_order)

const { items: allLocationItems } = useLocations(locations)

const originItems = computed(() => {
  // sin corredor → comportamiento normal
  if (!selectedCorridorData.value) {
    return allLocationItems.value.filter(
      (item) => item.value !== form.destination_location_id
    )
  }

  return allLocationItems.value.filter(
    (item) =>
      corridorLocationIds.value.includes(item.value) &&
      item.value !== form.destination_location_id
  )
})

const destinationItems = computed(() => {
  if (!selectedCorridorData.value) {
    return allLocationItems.value.filter(
      (item) => item.value !== form.origin_location_id
    )
  }

  return allLocationItems.value.filter(
    (item) =>
      corridorLocationIds.value.includes(item.value) &&
      item.value !== form.origin_location_id
  )
})

const corridorLocationIds = computed(() => {
  const corridor = selectedCorridorData.value
  if (!corridor) return []

  const stopIds = corridor.corridorStops?.map((s) => s.location_id) ?? []

  return [
    corridor.origin_location_id,
    ...stopIds,
    corridor.destination_location_id
  ].filter(Boolean)
})

const isValidCorridorLocation = (id?: string) => {
  if (!selectedCorridorData.value) return true
  return corridorLocationIds.value.includes(id!)
}

//FORM

const form = reactive<CreateDispatchOrderDto>({
  order_number: props.dispatch_order?.order_number ?? '',

  status: props.dispatch_order?.status ?? 'PENDING',

  requires_stock: props.dispatch_order?.requires_stock ?? false,

  customer_id: props.dispatch_order?.customer_id ?? undefined,

  origin_location_id: props.dispatch_order?.origin_location_id ?? undefined,

  destination_location_id:
    props.dispatch_order?.destination_location_id ?? undefined,

  corridor_id: props.dispatch_order?.corridor_id ?? undefined,

  planned_date: props.dispatch_order?.planned_date
    ? props.dispatch_order.planned_date.slice(0, 10)
    : undefined,

  // 🔥 map desde backend → DTO input
  rates:
    props.dispatch_order?.dispatch_rates?.map((r) => ({
      rate_id: r.rate_id,
      value: Number(r.value)
    })) ?? []
})

const selectedStatus = computed<StatusOption | undefined>({
  get: () => statusOptions.find((i) => i.value === form.status),
  set: (option) => {
    if (!option) return
    form.status = option.value
  }
})

const selectedCustomer = computed({
  get: () => items.value.find((i) => i.value === form.customer_id),
  set: (option) => {
    form.customer_id = option?.value
  }
})

const statusOptions = [
  { label: 'Pendiente', value: 'PENDING', chip: { color: 'neutral' } },
  { label: 'Asignado', value: 'ASSIGNED', chip: { color: 'warning' } },
  { label: 'En progreso', value: 'IN_PROGRESS', chip: { color: 'secondary' } },
  { label: 'Completado', value: 'COMPLETED', chip: { color: 'success' } },
  { label: 'Cancelado', value: 'CANCELLED', chip: { color: 'error' } }
] satisfies (SelectMenuItem & {
  value: DispatchStatus
  chip?: ChipProps
})[]

type StatusOption = (typeof statusOptions)[number]

// COMPUTED
const selectedCorridorData = computed(() =>
  corridors.value.find((c) => c.id === form.corridor_id)
)
const selectedCorridorItem = computed({
  get: () => corridorsItems.value.find((c) => c.value === form.corridor_id),
  set: (item) => {
    form.corridor_id = item?.value ?? undefined
  }
})
const selectedTransferRateItem = computed({
  get: () =>
    transferRatesItems.value.find(
      (item) => item.value === form.rates?.[0]?.rate_id
    ),

  set: (item) => {
    if (!item) {
      form.rates = []
      return
    }

    form.rates = [
      {
        rate_id: item.value,
        value: form.rates?.[0]?.value ?? 0
      }
    ]
  }
})

onMounted(async () => {
  await transferRatesStore.fetchAll()
  await corridorsStore.fetchCorridors()
  await businessPartiesStore.fetchAll()
  await locationsStore.fetchAll()
})
const onEditBussinessParty = () => {
  if (!selectedCustomer.value?.value) {
    return
  }
  const customer = businessParties.value.find(
    (c) => c.id === selectedCustomer.value?.value
  )
  if (!customer) {
    return
  }
  selectedBusinessParty.value = customer
  showBusinessPartiesModal.value = true
}
const addRate = () => {
  form.rates = form.rates ?? []

  form.rates.push({
    rate_id: '',
    value: 0
  })
}

const removeRate = (index: number) => {
  form.rates?.splice(index, 1)
}

const submit = () => {
  const dto: CreateDispatchOrderDto = {
    ...form,

    planned_date: form.planned_date
      ? new Date(form.planned_date).toISOString()
      : undefined,

    rates:
      form.rates?.map((r) => ({
        rate_id: r.rate_id,
        value: Number(r.value)
      })) ?? []
  }

  console.log('DTO limpio', dto)

  emit('submit', dto)
}
watch(
  () => form.corridor_id,
  () => {
    form.origin_location_id = undefined
    form.destination_location_id = undefined
  }
)
</script>

<template>
  <UForm @submit="submit" class="space-y-6">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Datos básicos</h3>

          <UFormField
            label="Estado"
            name="status"
            orientation="horizontal"
            class="flex items-center gap-2"
          >
            <USelectMenu v-model="selectedStatus" :items="statusOptions">
              <template #leading="{ modelValue, ui }">
                <UChip
                  v-if="modelValue?.chip"
                  v-bind="modelValue.chip"
                  inset
                  standalone
                  :size="ui.itemLeadingChipSize() as ChipProps['size']"
                  :class="ui.itemLeadingChip()"
                />
              </template>
            </USelectMenu>
          </UFormField>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Numero de orden" class="w-full">
          <UInput
            v-model="form.order_number"
            placeholder="ORD-001"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Fecha planificada" class="w-full">
          <UInput v-model="form.planned_date" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Cliente" class="col-span-2">
          <div class="flex w-full gap-2">
            <USelectMenu
              v-model="selectedCustomer"
              :items="items"
              clear
              class="w-full"
            />

            <UButton
              icon="i-lucide-plus"
              variant="outline"
              @click="showBusinessPartiesModal = true"
            />

            <UButton
              icon="i-lucide-pencil"
              variant="outline"
              :disabled="!selectedCustomer"
              @click="onEditBussinessParty"
            />
          </div>
        </UFormField>
        <UFormField label="Corredor" class="col-span-2">
          <div class="flex w-full gap-2">
            <USelectMenu
              v-model="selectedCorridorItem"
              :items="corridorsItems"
              option-attribute="label"
              value-attribute="value"
              class="flex-1"
              clear
            />
            <UButton
              icon="i-lucide-plus"
              variant="outline"
              @click="showCorridorModal = true"
            />
            <UButton
              icon="i-lucide-pencil"
              variant="outline"
              :disabled="!form.corridor_id"
              @click="onEditCorridor"
            />
          </div>
        </UFormField>

        <UFormField label="Origen" class="w-full">
          <USelect
            class="w-full"
            v-model="form.origin_location_id"
            :items="originItems"
            placeholder="Seleccionar origen"
          />
        </UFormField>

        <UFormField label="Destino" class="w-full">
          <USelect
            class="w-full"
            v-model="form.destination_location_id"
            :items="destinationItems"
            placeholder="Seleccionar destino"
          />
        </UFormField>
        <div
          class="flex flex-col gap-3 col-span-2 p-4 border-2 border-gray-200 rounded-xl dark:border-neutral-800"
        >
          <h3 class="font-semibold">Tarifas</h3>
          <!-- LISTA -->
          <div
            v-for="(rate, index) in form.rates"
            :key="index"
            class="flex gap-2 items-center"
          >
            <USelectMenu
              v-model="selectedTransferRateItem"
              :items="transferRatesItems"
              value-attribute="value"
              option-attribute="label"
              class="w-full"
            />
            <UFormField label="Valor" orientation="horizontal">
              <UInput
                v-model.number="rate.value"
                type="number"
                placeholder="Valor"
                class="w-32"
              />
            </UFormField>

            <UButton
              @click="removeRate(index)"
              icon="i-lucide-trash"
              variant="ghost"
              color="error"
            />
          </div>

          <!-- BOTÓN -->
          <div>
            <UButton @click="addRate" icon="i-lucide-plus" variant="outline">
              Agregar tarifa
            </UButton>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="emit('cancel')">Cancelar</UButton>
          <UButton type="submit">
            {{ isEdit ? 'Guardar cambios' : 'Crear Orden' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UForm>

  <BusinessPartyModal
    v-model:open="showBusinessPartiesModal"
    v-model:business-party="selectedBusinessParty"
  />
  <CorridorFormModal
    v-model:open="showCorridorModal"
    :corridor="selectedCorridor"
    @success="onCorridorSaved"
  />
</template>
