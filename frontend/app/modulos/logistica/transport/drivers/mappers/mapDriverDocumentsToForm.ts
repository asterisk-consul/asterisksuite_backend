import { parseDate, CalendarDate } from '@internationalized/date'
import type { Driver } from '~/modulos/logistica/transport/drivers/drivers.types'

function toCalendarDate(value?: string | null): CalendarDate | null {
  if (!value) return null

  try {
    return parseDate(value.slice(0, 10)) // YYYY-MM-DD
  } catch {
    return null
  }
}

export function mapDriverDocumentsToForm(driver: Driver) {
  const mapped: Record<string, any> = {}

  driver.driverDocuments?.forEach((doc, index) => {
    const i = index + 1

    mapped[`doc${i}Type`] = doc.document_type_id

    mapped[`doc${i}Expiration`] = toCalendarDate(doc.expiration_date)
  })

  return mapped
}
