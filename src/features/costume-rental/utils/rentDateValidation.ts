import { VI } from "@/shared/i18n/vi"

const RENT_LEAD_DAYS = 3

export function getMinRentStartDateString(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + RENT_LEAD_DAYS)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function getRentStartDateValidationError(dateString: string): string | undefined {
  if (!dateString.trim()) {
    return VI.costumeRental.validation.missingRentStart
  }

  const [year, month, day] = dateString.split("-").map(Number)
  if (!year || !month || !day) {
    return VI.costumeRental.validation.invalidRentStart
  }

  const selected = new Date(year, month - 1, day)
  selected.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + RENT_LEAD_DAYS)

  if (selected < minDate) {
    return VI.costumeRental.validation.rentStartTooSoon
  }

  return undefined
}
