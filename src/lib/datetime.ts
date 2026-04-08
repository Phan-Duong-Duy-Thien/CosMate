/**
 * Format a timestamp for display in chat message bubbles.
 * - Same day: show time only (e.g. "3:00")
 * - Yesterday: show "Yesterday"
 * - Within last 7 days: show weekday (e.g. "T2", "T3")
 * - Older: show date (e.g. "28 Thg 3")
 */
export function formatChatTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

/**
 * Format a timestamp for the chat room list (last message preview).
 * Same logic as formatChatTime but always shows something compact.
 */
export function formatRoomTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}
