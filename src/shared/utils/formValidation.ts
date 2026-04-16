import type { FormInstance } from 'antd'

type BackendFieldErrors = Record<string, string | string[] | undefined> | undefined | null

function normalizeMessage(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value[0]
  return value
}

export function applyFormValidationErrors(form: FormInstance, error: unknown): boolean {
  const response = error as {
    response?: {
      status?: number
      data?: {
        result?: BackendFieldErrors
        message?: string
      }
    }
  }

  if (response?.response?.status !== 400) return false

  const fieldErrors = response.response.data?.result
  if (!fieldErrors || typeof fieldErrors !== 'object') return false

  const mapped = Object.entries(fieldErrors)
    .map(([name, value]) => ({ name, errors: [normalizeMessage(value) ?? 'Dữ liệu không hợp lệ'] }))
    .filter((item) => item.name)

  if (mapped.length === 0) return false

  form.setFields(mapped)
  return true
}
