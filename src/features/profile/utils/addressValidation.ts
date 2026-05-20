import { VI } from "@/shared/i18n/vi"

export const VN_PHONE_LENGTH = 10
export const VN_PHONE_REGEX = /^\d{10}$/

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, VN_PHONE_LENGTH)
}

export function getPhoneValidationError(phone: string): string | undefined {
  const digits = phone.trim()
  if (!digits) return VI.profile.address.validation.required
  if (!VN_PHONE_REGEX.test(digits)) return VI.profile.address.validation.invalidPhone
  return undefined
}
