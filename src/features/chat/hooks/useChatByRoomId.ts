import { useState, useEffect, useCallback } from "react"
import { getChatMessagesService, getChatPartnerService } from "../services/chat.service"
import type { ChatMessage, ChatPartner } from "../types"

interface UseChatByRoomIdResult {
  messages: ChatMessage[];
  partner: ChatPartner | null;
  loading: boolean;
  error: string | null;
}

export function useChatByRoomId(
  roomId: number | null,
  currentUserId: number | null
): UseChatByRoomIdResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [partner, setPartner] = useState<ChatPartner | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (roomId === null || currentUserId === null) return
    setLoading(true)
    setError(null)
    try {
      const [msgs, partnerData] = await Promise.all([
        getChatMessagesService(roomId),
        getChatPartnerService(roomId, currentUserId),
      ])
      setMessages(msgs?.content ?? [])
      setPartner(partnerData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat")
    } finally {
      setLoading(false)
    }
  }, [roomId, currentUserId])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { messages, partner, loading, error }
}
