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
