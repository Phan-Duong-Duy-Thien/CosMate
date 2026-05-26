import { COSTUME_ORDER_STATUS_UI } from "@/features/admin/utils/orderStatus"
import { ORDER_STATUS_UI } from "@/constants/orderStatus"
import { VI } from "@/shared/i18n/vi"

/**
 * Display-only labels for order status codes embedded in notification copy.
 * Does not mutate API payloads — use formatNotificationDisplayText() at render time.
 */
function buildOrderStatusLabelMap(): Record<string, string> {
  const labels: Record<string, string> = {}

  for (const [code, cfg] of Object.entries(COSTUME_ORDER_STATUS_UI)) {
    labels[code] = cfg.label
  }

  for (const [code, cfg] of Object.entries(ORDER_STATUS_UI)) {
    if (!labels[code]) labels[code] = cfg.label
  }

  const trackingStages = VI.order.detail.trackingStageLabels as Record<string, string>
  for (const [code, label] of Object.entries(trackingStages)) {
    if (!labels[code]) labels[code] = label
  }

  const profileOrders = VI.profile.orders
  labels.UNPAID ??= profileOrders.statusUnpaid
  labels.SHIPPING_OUT ??= profileOrders.statusShippingOut
  labels.DELIVERING_OUT ??= profileOrders.statusDeliveringOut
  labels.DELIVERY_OUT ??= profileOrders.statusDeliveryOut
  labels.SHIPPING_BACK ??= profileOrders.statusShippingBack

  const serviceOrders = VI.profile.serviceOrders
  labels.UNCONFIRM ??= serviceOrders.statusUnconfirm
  labels.UNPAID ??= serviceOrders.statusUnpaid
  labels.PAID ??= serviceOrders.statusPaid
  labels.WAITING_SERVICE_DATE ??= serviceOrders.statusWaitingServiceDate
  labels.IN_SERVICE ??= serviceOrders.statusInService
  labels.COMPLETED ??= serviceOrders.statusCompleted
  labels.DISPUTE ??= serviceOrders.statusDispute
  labels.CANCELLED ??= serviceOrders.statusCancelled

  labels.PENDING_COMPLETION ??= "Chờ hoàn tất"

  return labels
}

const ORDER_STATUS_LABELS = buildOrderStatusLabelMap()

const STATUS_CODES_BY_LENGTH = Object.keys(ORDER_STATUS_LABELS).sort(
  (a, b) => b.length - a.length
)

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Single status code → Vietnamese label (unknown codes returned as-is). */
export function getOrderStatusDisplayLabel(statusCode: string): string {
  const key = statusCode.trim().toUpperCase()
  return ORDER_STATUS_LABELS[key] ?? statusCode
}

/** Display-only VND format, e.g. 3000000 → "3.000.000đ" */
export function formatVndForNotification(amount: number): string {
  if (!Number.isFinite(amount)) return String(amount)
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`
}

const PRICE_CONTEXT_PATTERN =
  /(?:giá|tổng|tiền|cọc|phí|thanh toán|hoàn|amount|price)\s*[:：]?\s*$/i

const ORDER_ID_CONTEXT_PATTERN =
  /(?:đơn(?:\s+hàng)?|order|mã(?:\s+đơn)?|#)\s*$/i

/** Standalone currency đ only — not the đ in đã, đơn, được, … */
const CURRENCY_D_SUFFIX = /\s+đ(?=\s|$|[.,!?;:)\]}])/i

const MONEY_TOKEN_PATTERN =
  /\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:\.\d{1,2})?(?:\s*(?:VND|VNĐ|vnd|₫))?/gi

function parseMoneyToken(token: string): number | null {
  const stripped = token
    .replace(/\s*(?:VND|VNĐ|vnd|₫)\s*$/i, "")
    .replace(CURRENCY_D_SUFFIX, "")
    .trim()
  if (!stripped) return null

  const viThousands = /^(\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?$/.exec(stripped)
  if (viThousands) {
    const decimals = viThousands[2] ? `.${viThousands[2]}` : ""
    return Number(viThousands[1].replace(/\./g, "") + decimals)
  }

  const commaThousands = /^(\d{1,3}(?:,\d{3})+)(?:\.(\d{1,2}))?$/.exec(stripped)
  if (commaThousands) {
    const decimals = commaThousands[2] ? `.${commaThousands[2]}` : ""
    return Number(commaThousands[1].replace(/,/g, "") + decimals)
  }

  if (/^\d+(\.\d{1,2})?$/.test(stripped)) {
    return Number(stripped)
  }

  return null
}

function shouldFormatMoneyToken(
  value: number,
  token: string,
  segment: string,
  indexInSegment: number
): boolean {
  if (!Number.isFinite(value) || value < 1_000) return false

  const hasCurrencySuffix =
    /(?:VND|VNĐ|vnd|₫)\s*$/i.test(token) || CURRENCY_D_SUFFIX.test(token)
  const hasGroupedDigits = /\d{1,3}[.,]\d{3}/.test(token)
  const hasDecimalPart = /\.\d{1,2}(?:\s*(?:VND|VNĐ|vnd|₫))?\s*$/i.test(token)

  const before = segment.slice(Math.max(0, indexInSegment - 32), indexInSegment)

  if (hasCurrencySuffix || hasGroupedDigits || hasDecimalPart) return true
  if (value >= 100_000) {
    if (ORDER_ID_CONTEXT_PATTERN.test(before)) return false
    return true
  }

  return PRICE_CONTEXT_PATTERN.test(before)
}

/** đ + vowel right after amount (e.g. 1110000đã) — insert space before the word */
const GLUED_VI_WORD_AFTER_AMOUNT = /^đ[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i

function formatMoneyTokensInSegment(segment: string): string {
  return segment.replace(MONEY_TOKEN_PATTERN, (token, offset) => {
    const amount = parseMoneyToken(token)
    if (amount == null || !shouldFormatMoneyToken(amount, token, segment, offset)) {
      return token
    }
    let formatted = formatVndForNotification(amount)
    const after = segment.slice(offset + token.length)
    if (GLUED_VI_WORD_AFTER_AMOUNT.test(after)) {
      formatted += " "
    }
    return formatted
  })
}

function formatPricesInNotificationText(text: string): string {
  const urlPattern = /https?:\/\/[^\s<>]+/gi
  let result = ""
  let lastIndex = 0

  for (const match of text.matchAll(urlPattern)) {
    const start = match.index ?? 0
    result += formatMoneyTokensInSegment(text.slice(lastIndex, start))
    result += match[0]
    lastIndex = start + match[0].length
  }

  result += formatMoneyTokensInSegment(text.slice(lastIndex))
  return result
}

/**
 * Replaces known order status tokens inside notification body text for display.
 * Original notification.content / links / logic must stay unchanged upstream.
 */
export function formatNotificationDisplayText(text: string): string {
  if (!text?.trim()) return text

  let formatted = text
  for (const code of STATUS_CODES_BY_LENGTH) {
    const label = ORDER_STATUS_LABELS[code]
    const pattern = new RegExp(`\\b${escapeRegExp(code)}\\b`, "g")
    formatted = formatted.replace(pattern, label)
  }
  const withPrices = formatPricesInNotificationText(formatted)
  // Repair glued "đã" after a formatted amount (e.g. 1.110.000đã → 1.110.000đ đã)
  return withPrices.replace(/(\d{1,3}(?:\.\d{3})+)đã/g, "$1đ đã")
}
