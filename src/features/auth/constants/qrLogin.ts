/**
 * QR payload for mobile app scanner (luồng B — quét trong app).
 * sessionId from GET /api/auth/qr-generate; mobile approves via POST /api/auth/qr-approve.
 */
import { appendMobileSessionParams } from "@/shared/utils/mobileQrUrl"

const QR_BASE =
  import.meta.env.VITE_MOBILE_QR_LOGIN_BASE?.replace(/\/+$/, "") || "cosmate://qr-login"

export function buildQrLoginUrl(sessionId: string): string {
  const url = new URL(QR_BASE)
  appendMobileSessionParams(url, sessionId)
  return url.toString()
}
