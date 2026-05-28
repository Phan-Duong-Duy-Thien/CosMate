/**
 * Shared query params for mobile deep-link QR payloads.
 * Mobile may read sessionId, sessionToken, or token — all map to the same BE session.
 * apiBase tells the app which server issued the session (must match web VITE_API_BASE_URL).
 */
export function getMobileApiBase(): string {
  return (
    import.meta.env.VITE_MOBILE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.cosmate.site"
  ).replace(/\/+$/, "")
}

export function appendMobileSessionParams(url: URL, sessionId: string): void {
  url.searchParams.set("sessionId", sessionId)
  url.searchParams.set("sessionToken", sessionId)
  url.searchParams.set("token", sessionId)
  url.searchParams.set("apiBase", getMobileApiBase())
}

export function qrPayloadMatchesCurrentApi(qrValue: string): boolean {
  if (!qrValue) return false
  const expected = getMobileApiBase()
  try {
    const url = new URL(qrValue)
    const apiBase = url.searchParams.get("apiBase")
    return apiBase === expected
  } catch {
    return qrValue.includes(encodeURIComponent(expected))
  }
}

/** Read `userId` from confirm-delivery (or similar) QR deep links. */
export function parseUserIdFromQrPayload(qrValue: string): number | null {
  if (!qrValue) return null
  try {
    const url = new URL(qrValue)
    const raw = url.searchParams.get("userId")
    if (!raw) return null
    const id = parseInt(raw, 10)
    return Number.isFinite(id) && id > 0 ? id : null
  } catch {
    const match = qrValue.match(/[?&]userId=(\d+)/)
    if (!match) return null
    const id = parseInt(match[1], 10)
    return Number.isFinite(id) && id > 0 ? id : null
  }
}

/** QR must target this API and the web user who created the session. */
export function qrPayloadMatchesCurrentUser(qrValue: string, userId: number): boolean {
  if (!userId) return false
  return parseUserIdFromQrPayload(qrValue) === userId
}
