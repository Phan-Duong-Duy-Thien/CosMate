import { useState, useCallback } from "react"
import type { ChatMessage } from "../types"

/** Shared message store: manages history + realtime updates.
 *
 *  Single source of truth for message ordering.
 *
 *  Flow:
 *    history load  → setMessages()        (replaces entire list, sorted ascending)
 *    websocket msg  → mergeServerMessage() (dedup by id + append, sorted ascending)
 *
 *  Sort key: createdAt (ISO string), ascending (oldest first → newest last).
 *  Deduplication: if a message with the same positive id is already in the list,
 *  it is skipped (prevents double-render when multiple subscribers receive the
 *  same broadcast).
 *  If createdAt is missing/null, falls back to client receive time so the
 *  message still renders and sorts to the bottom.
 */

export function useChatMessageStore(initialMessages: ChatMessage[] = []) {
  const [messages, setMessagesState] = useState<ChatMessage[]>(initialMessages)

  // ── Set full history (e.g. from REST API) ──────────────────────────────────
  const setMessages = useCallback((incoming: ChatMessage[]) => {
    setMessagesState([...incoming].sort(sortByCreatedAt))
  }, [])

  // ── Merge server message ───────────────────────────────────────────────────
  // Append + dedup by positive id.  If server sends null createdAt, fall back
  // to client receive time so the message still renders.
  const mergeServerMessage = useCallback((msg: ChatMessage) => {
    // Fall back to client time if server omits createdAt
    const enrichedMsg = !msg.createdAt
      ? { ...msg, createdAt: new Date().toISOString() }
      : msg

    console.log("[useChatMessageStore] mergeServerMessage called:", {
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      createdAt: enrichedMsg.createdAt,
      hadNullTimestamp: !msg.createdAt,
    })

    setMessagesState((prev) => {
      // Skip if a message with the same positive id is already in the list
      if (msg.id > 0 && prev.some((m) => m.id === msg.id)) {
        console.log("[useChatMessageStore] skipped duplicate id:", msg.id)
        return prev
      }
      const next = [...prev, enrichedMsg].sort(sortByCreatedAt)
      console.log("[useChatMessageStore] messages updated:", {
        before: prev.length,
        after: next.length,
        newMsg: { id: enrichedMsg.id, createdAt: enrichedMsg.createdAt },
      })
      return next
    })
  }, [])

  // ── Clear for room switch ───────────────────────────────────────────────────
  const clearMessages = useCallback(() => {
    setMessagesState([])
  }, [])

  return { messages, setMessages, mergeServerMessage, clearMessages }
}

// ── Sort helper ─────────────────────────────────────────────────────────────
function sortByCreatedAt(a: { createdAt?: string }, b: { createdAt?: string }): number {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
  return aTime - bTime
}
