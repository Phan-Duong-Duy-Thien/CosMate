/**
 * QR payload for mobile app scanner (luồng B).
 * sessionId from GET /api/auth/qr-generate (same pool BE uses for /ws-image/upload).
 */
import { appendMobileSessionParams } from "@/shared/utils/mobileQrUrl"

const QR_BASE =
  import.meta.env.VITE_MOBILE_CONFIRM_DELIVERY_QR_BASE?.replace(/\/+$/, "") ||
  "https://cosmate.vn/app/confirm-delivery"

export function buildConfirmDeliveryQrUrl(sessionId: string, orderId: number): string {
  const url = new URL(QR_BASE)
  appendMobileSessionParams(url, sessionId)
  url.searchParams.set("orderId", String(orderId))
  return url.toString()
}
