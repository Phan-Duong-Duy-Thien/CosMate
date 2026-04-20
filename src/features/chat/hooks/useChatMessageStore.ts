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
 *    optimistic msg  → addOptimisticMessage() (preview before server confirms)
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
  // Also removes any optimistic placeholder with matching tempId.
  const mergeServerMessage = useCallback((msg: ChatMessage) => {
    if (!stateRef.current) return

    // Fall back to client time if server omits createdAt
    const enrichedMsg = !msg.createdAt
      ? { ...msg, createdAt: new Date().toISOString() }
      : msg

    // Ensure content is never null/undefined to avoid crashes
    if (enrichedMsg.content == null) {
      console.warn("[useChatMessageStore] Skipping message with null content:", msg)
      return
    }

    console.log("[useChatMessageStore] mergeServerMessage called:", {
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      createdAt: enrichedMsg.createdAt,
      hadNullTimestamp: !msg.createdAt,
    })

    const prev = stateRef.current.messages

    // Remove optimistic placeholder BEFORE dedup check. Match by negative id so
    // we remove exactly the placeholder we added (not any message with same content).
    const filteredPrev = prev.filter((m) => m.id >= 0 || m.senderId !== enrichedMsg.senderId || m.content !== enrichedMsg.content)

    // Skip if a message with the same positive id is already in the list
    // (prevents double-render when multiple subscribers receive the same broadcast).
    if (msg.id > 0 && filteredPrev.some((m) => m.id === msg.id)) {
      console.log("[useChatMessageStore] skipped duplicate id:", msg.id)
      return
    }

    // Only skip IMAGE messages with null/placeholder content that were sent
    // BEFORE the server confirmed with a real id (id > 0).  Once server confirms,
    // we always render it — even if another IMAGE with the same URL arrives later.
    if (
      msg.id > 0 &&
      (msg.messageType === "IMAGE" || (enrichedMsg.content ?? "").startsWith("http")) &&
      filteredPrev.some((m) => m.senderId === enrichedMsg.senderId && m.content === enrichedMsg.content && m.id > 0)
    ) {
      console.log("[useChatMessageStore] skipped duplicate IMAGE with real server id:", msg.content)
      return
    }

    stateRef.current.messages = [...filteredPrev, enrichedMsg].sort(sortByCreatedAt)
    console.log("[useChatMessageStore] messages updated:", {
      before: prev.length,
      after: stateRef.current.messages.length,
      newMsg: { id: enrichedMsg.id, createdAt: enrichedMsg.createdAt },
    })
    bump()
  }, [bump])

  // ── Add optimistic preview ─────────────────────────────────────────────────
  // Stable module-level counter — NOT inside useCallback so it persists stably.
  const tempIdRef = useRef(-1)
  const addOptimisticMessage = useCallback((msg: Omit<ChatMessage, "id">): number => {
    if (!stateRef.current) return 0
    const tempId = tempIdRef.current--
    const optimisticMsg: ChatMessage = { ...msg, id: tempId }
    stateRef.current.messages = [...stateRef.current.messages, optimisticMsg].sort(sortByCreatedAt)
    bump()
    return tempId
  }, [bump])

  // ── Remove optimistic preview by tempId ───────────────────────────────────
  const removeOptimisticMessage = useCallback((tempId: number) => {
    if (!stateRef.current) return
    stateRef.current.messages = stateRef.current.messages.filter((m) => m.id !== tempId)
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

  return { messages, setMessages, mergeServerMessage, clearMessages, addOptimisticMessage, removeOptimisticMessage }
}

// ── Sort helper ─────────────────────────────────────────────────────────────
function sortByCreatedAt(a: { createdAt?: string }, b: { createdAt?: string }): number {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
  return aTime - bTime
}
