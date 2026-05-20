import { useEffect, useState } from "react"
import { getAllChatMessagesService } from "../services/chat.service"

/**
 * Loads full chat history for a room from REST (all pages).
 * Does not clear the store before fetch — avoids empty flash on reload.
 */
export function useLoadChatHistory(
  roomId: number | null,
  setMessages: (messages: import("../types").ChatMessage[]) => void,
): boolean {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (roomId === null) return

    let cancelled = false
    setLoading(true)

    getAllChatMessagesService(roomId)
      .then((history) => {
        if (!cancelled) {
          setMessages(history)
        }
      })
      .catch(() => {
        // Keep cached messages on failure (e.g. network error after reload)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [roomId, setMessages])

  return loading
}
