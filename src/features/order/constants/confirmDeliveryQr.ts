/**
 * QR payload for mobile app scanner (luồng B).
 * BE will issue sessionToken; until then FE generates a provisional token for display.
 */
const QR_BASE =
  import.meta.env.VITE_MOBILE_CONFIRM_DELIVERY_QR_BASE?.replace(/\/+$/, "") ||
  "https://cosmate.vn/app/confirm-delivery"

export function buildConfirmDeliveryQrUrl(sessionToken: string, orderId: number): string {
  const url = new URL(QR_BASE)
  url.searchParams.set("token", sessionToken)
  url.searchParams.set("orderId", String(orderId))
  return url.toString()
}
