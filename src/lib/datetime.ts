/**
 * Format a timestamp for display in chat message bubbles.
 * - Same day: show time only (e.g. "3:00")
 * - Yesterday: show "Yesterday"
 * - Within last 7 days: show weekday (e.g. "T2", "T3")
 * - Older: show date (e.g. "28 Thg 3")
 */
export function toUtcSafeDate(isoString: string): Date {
  if (!isoString) return new Date()
  let sanitized = isoString.trim()
  if (
    sanitized.includes("T") &&
    !sanitized.endsWith("Z") &&
    !/[+-]\d{2}:?\d{2}$/.test(sanitized)
  ) {
    sanitized += "Z"
  }
  return new Date(sanitized)
}

export function formatChatTime(isoString: string): string {
  const date = toUtcSafeDate(isoString)
  if (isNaN(date.getTime())) return ""

  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })
}

/**
 * Format a timestamp for the chat room list (last message preview).
 * Same logic as formatChatTime but always shows something compact.
 */
export function formatRoomTime(isoString: string): string {
  const date = toUtcSafeDate(isoString)
  if (isNaN(date.getTime())) return ""

  // Convert both dates to Ho Chi Minh timezone representation to compute diffDays accurately
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
  
  const nowParts = formatter.formatToParts(new Date())
  const dateParts = formatter.formatToParts(date)
  
  const getPartVal = (parts: Intl.DateTimeFormatPart[], type: string) => 
    Number(parts.find(p => p.type === type)?.value)
    
  const nowVN = new Date(getPartVal(nowParts, "year"), getPartVal(nowParts, "month") - 1, getPartVal(nowParts, "day"))
  const dateVN = new Date(getPartVal(dateParts, "year"), getPartVal(dateParts, "month") - 1, getPartVal(dateParts, "day"))
  
  const diffDays = Math.round((nowVN.getTime() - dateVN.getTime()) / (24 * 60 * 60 * 1000))

  if (diffDays === 0) {
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return date.toLocaleDateString("vi-VN", { weekday: "short", timeZone: "Asia/Ho_Chi_Minh" })
  }
  return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric", timeZone: "Asia/Ho_Chi_Minh" })
}
