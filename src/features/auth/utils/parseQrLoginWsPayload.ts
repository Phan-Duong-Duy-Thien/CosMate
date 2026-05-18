import type { LoginResult } from "../types"

/**
 * BE may send JSON LoginResult or nested { token, tokenType } / { accessToken }.
 */
export function parseQrLoginWsPayload(body: string): LoginResult | null {
  const trimmed = body.trim()
  if (!trimmed) return null

  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>

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
    // Raw JWT string
    if (trimmed.split(".").length === 3) {
      return { token: trimmed, tokenType: "Bearer" }
    }
  }

  return null
}
