/**
 * QR payload for mobile app scanner (luồng B — quét trong app).
 * sessionToken is generated on web (UUID); BE only needs approve + status/WS.
 */
const QR_BASE =
  import.meta.env.VITE_MOBILE_QR_LOGIN_BASE?.replace(/\/+$/, "") || "cosmate://qr-login"

export function buildQrLoginUrl(sessionToken: string): string {
  const url = new URL(QR_BASE)
  url.searchParams.set("sessionToken", sessionToken)
  // Alias for clients that read `token` (same as confirm-delivery QR)
  url.searchParams.set("token", sessionToken)
  return url.toString()
}
