import type { LoginResult } from "../types"

/**
 * BE payload: { "event": "qr_approved", "accessToken": "<jwt>" }
 */
export function parseQrLoginWsPayload(body: string): LoginResult | null {
  const trimmed = body.trim()
  if (!trimmed) return null

  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>

    if (data.event === "qr_approved" || data.event === "QR_APPROVED") {
      const accessToken =
        (typeof data.accessToken === "string" && data.accessToken) ||
        (typeof data.token === "string" && data.token) ||
        null
      if (accessToken) {
        return { token: accessToken, tokenType: "Bearer" }
      }
    }

    const nested = data.result as LoginResult | undefined
    if (nested?.token) {
      return { token: nested.token, tokenType: nested.tokenType || "Bearer" }
    }

    const token =
      (typeof data.token === "string" && data.token) ||
      (typeof data.accessToken === "string" && data.accessToken) ||
      null

    if (token) {
      return {
        token,
        tokenType: (typeof data.tokenType === "string" && data.tokenType) || "Bearer",
      }
    }
  } catch {
    if (trimmed.split(".").length === 3) {
      return { token: trimmed, tokenType: "Bearer" }
    }
  }

  return null
}
