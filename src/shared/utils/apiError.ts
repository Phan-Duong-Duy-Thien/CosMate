import type { AxiosError } from "axios"

type ApiErrorPayload = {
  message?: string
  error?: string
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const apiMessage = axiosError?.response?.data?.message
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage
  }

  const apiError = axiosError?.response?.data?.error
  if (typeof apiError === "string" && apiError.trim()) {
    return apiError
  }

  const message = axiosError?.message
  if (typeof message === "string" && message.trim()) {
    return message
  }

  return fallback
}
