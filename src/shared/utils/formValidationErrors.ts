import type { FormInstance } from "antd"
import axios from "axios"

export type FieldErrorsMap = Record<string, string>

export function extractFieldErrors(error: unknown): FieldErrorsMap | null {
  if (!axios.isAxiosError(error)) return null
  if (error.response?.status !== 400) return null

  const result = error.response?.data?.result
  if (!result || typeof result !== "object" || Array.isArray(result)) return null

  const entries = Object.entries(result as Record<string, unknown>)
  const fieldErrors: FieldErrorsMap = {}
  for (const [field, message] of entries) {
    if (typeof message === "string" && message.trim()) fieldErrors[field] = message
  }
  return Object.keys(fieldErrors).length ? fieldErrors : null
}

export function applyFieldErrors<T extends object>(form: FormInstance<T>, errors: FieldErrorsMap) {
  form.setFields(
    Object.entries(errors).map(([name, error]) => ({
      name,
      errors: [error],
    }))
  )
}
