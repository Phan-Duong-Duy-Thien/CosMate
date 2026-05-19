export const TOKEN_INSUFFICIENT_EVENT = "token:insufficient"

export function isInsufficientTokenError(error: unknown): boolean {
  const anyError = error as {
    response?: { status?: number; data?: { code?: number; message?: string } }
    code?: number
    message?: string
  }

  const responseCode = anyError?.response?.data?.code
  const httpStatus = anyError?.response?.status
  const message = `${anyError?.response?.data?.message ?? anyError?.message ?? ""}`.toLowerCase()

  return (
    responseCode === 4001 ||
    httpStatus === 402 ||
    (httpStatus === 403 && message.includes("token")) ||
    message.includes("không đủ số dư token") ||
    message.includes("khong du so du token") ||
    message.includes("insufficient token")
  )
}
