import { useState, useCallback, useRef } from "react"
import type { ChatMessage } from "../types"

/** Shared message store: manages history + realtime updates.
 *
 *  Single source of truth for message ordering.
 *
 *  State is module-level (via useRef) so it persists across component
 *  remounts — critical for page reload scenarios.
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
  // Module-level ref — persists across component remounts (e.g., page reload).
  // Initial value is seeded once; subsequent calls get the existing state.
  const stateRef = useRef<{ messages: ChatMessage[] } | null>(null)
  if (!stateRef.current) {
    stateRef.current = { messages: initialMessages }
  }

  // ── Force re-render when messages change ──────────────────────────────────
  const [, setVersion] = useState(0)
  const bump = useCallback(() => setVersion((v) => v + 1), [])

  // ── Set full history (e.g. from REST API) ──────────────────────────────────
  const setMessages = useCallback((incoming: ChatMessage[]) => {
    if (!stateRef.current) return
    stateRef.current.messages = [...incoming].sort(sortByCreatedAt)
    bump()
  }, [bump])

  // ── Merge server message ───────────────────────────────────────────────────
  // Append + dedup by positive id.  If server sends null createdAt, fall back
  // to client receive time so the message still renders.
  const mergeServerMessage = useCallback((msg: ChatMessage) => {
    if (!stateRef.current) return

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

    const prev = stateRef.current.messages

    // Skip if a message with the same positive id is already in the list
    // (prevents double-render when multiple subscribers receive the same broadcast).
    // Only dedup positive ids — id=0 or negative ids are real messages from the server
    // that must not be dropped (they may be pre-existing history or server-assigned ids).
    if (msg.id > 0 && prev.some((m) => m.id === msg.id)) {
      console.log("[useChatMessageStore] skipped duplicate id:", msg.id)
      return
    }

    stateRef.current.messages = [...prev, enrichedMsg].sort(sortByCreatedAt)
    console.log("[useChatMessageStore] messages updated:", {
      before: prev.length,
      after: stateRef.current.messages.length,
      newMsg: { id: enrichedMsg.id, createdAt: enrichedMsg.createdAt },
    })
    bump()
  }, [bump])

  // ── Clear for room switch ───────────────────────────────────────────────────
  const clearMessages = useCallback(() => {
    if (!stateRef.current) return
    stateRef.current.messages = []
    bump()
  }, [bump])

  // Expose a stable reference to the current messages array
  const messages = stateRef.current.messages

  return { messages, setMessages, mergeServerMessage, clearMessages }
}

// ── Sort helper ─────────────────────────────────────────────────────────────
function sortByCreatedAt(a: { createdAt?: string }, b: { createdAt?: string }): number {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
  return aTime - bTime
}
