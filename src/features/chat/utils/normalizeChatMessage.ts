import type { ChatMessage } from "../types"

/** Ensure messages from REST/WS always have fields required for UI + sorting. */
export function normalizeChatMessage(msg: ChatMessage): ChatMessage | null {
  if (msg.content == null || String(msg.content).trim() === "") {
    return null
  }

  const createdAt =
    msg.createdAt && String(msg.createdAt).trim() !== ""
      ? msg.createdAt
      : new Date().toISOString()

  return {
    ...msg,
    createdAt,
    messageType: msg.messageType ?? "TEXT",
    isRead: msg.isRead ?? false,
  }
}

export function normalizeChatMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .map(normalizeChatMessage)
    .filter((m): m is ChatMessage => m !== null)
    .sort(sortByCreatedAt)
}

function sortByCreatedAt(a: ChatMessage, b: ChatMessage): number {
  const aTime = new Date(a.createdAt).getTime()
  const bTime = new Date(b.createdAt).getTime()
  return aTime - bTime
}
