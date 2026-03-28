import { computed } from 'vue'
import type { Driver } from '~/modulos/logistica/transport/drivers/drivers.types'
import { getExpirationStatus } from '~/utils/expiration'

export interface SelectItem {
  label: string
  value: string
}

export function useDriverMetrics(drivers: Ref<Driver[]>) {
  const total = computed(() => drivers.value.length)

  const active = computed(() => drivers.value.filter((d) => d.active).length)

  const inactive = computed(() => drivers.value.filter((d) => !d.active).length)

  const items = computed<SelectItem[]>(() =>
    drivers.value.map((driver) => {
      const label = `${driver.first_name} ${driver.last_name}`

      return {
        label,
        value: driver.id
      }
    })
  )

  // const licenseExpired = computed(
  //   () =>
  //     drivers.value.filter(
  //       (d) => getExpirationStatus(d.license_expiration) === 'expired'
  //     ).length
  // )

  // const licenseExpiring = computed(
  //   () =>
  //     drivers.value.filter(
  //       (d) => getExpirationStatus(d.license_expiration) === 'warning'
  //     ).length
  // )

  // const licenseValid = computed(
  //   () =>
  //     drivers.value.filter(
  //       (d) => getExpirationStatus(d.license_expiration) === 'valid'
  //     ).length
  // )

  return {
    total,
    items,
    active,
    inactive
    // licenseExpired,
    // licenseExpiring,
    // licenseValid
  }
}
