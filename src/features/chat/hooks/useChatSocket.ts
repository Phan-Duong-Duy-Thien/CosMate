import { useState, useEffect, useCallback, useRef } from "react"
import {
  connectChatSocket,
  disconnectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
} from "../services/chatSocket.service"
import type { ChatMessage, SendMessagePayload } from "../types"
import { useChatMessageStore } from "./useChatMessageStore"

interface UseChatSocketResult {
  isConnected: boolean
  messages: ChatMessage[]
  sendMessage: (content: string) => void
}

export function useChatSocket(
  roomId: number | null,
  senderId: number | null
): UseChatSocketResult {
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const { messages, mergeServerMessage } = useChatMessageStore()

  // ── Connect socket on mount, disconnect on unmount ───────────────────────
  useEffect(() => {
    connectChatSocket(() => setIsConnected(true))
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      disconnectChatSocket()
      setIsConnected(false)
    }
  }, [])

  // ── Subscribe to room when roomId or connection changes ──────────────────
  useEffect(() => {
    if (!isConnected || roomId === null) return

    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    unsubscribeRef.current = subscribeChatRoom(roomId, (msg: ChatMessage) => {
      console.log("[useChatSocket] Server message:", msg)
      mergeServerMessage(msg)
    })
  }, [isConnected, roomId, mergeServerMessage])

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || roomId === null || senderId === null) return

      console.log("[useChatSocket] Sending:", content.trim())

      const payload: SendMessagePayload = { roomId, senderId, content: content.trim() }
      sendChatMessage(payload)
    },
    [roomId, senderId]
  )

  return { isConnected, messages, sendMessage }
}
