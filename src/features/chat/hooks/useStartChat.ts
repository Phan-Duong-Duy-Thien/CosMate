/**
 * useStartChat
 *
 * Hook to initiate a chat with a provider by creating (or reusing) a chat room
 * and opening the chat popup.
 */
import { useState, useCallback } from "react"
import { message } from "antd"
import { getOrCreateChatRoomService } from "../services/chat.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatPopup } from "../components/ChatPopupContext"

interface UseStartChatResult {
  startChat: (providerId: number, providerName?: string) => Promise<void>
  loading: boolean
  error: string | null
}

export function useStartChat(): UseStartChatResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { openChat } = useChatPopup()

  const startChat = useCallback(
    async (providerId: number, providerName?: string) => {
      const currentUserId = getUserId()

      if (!currentUserId) {
        message.warning("Please log in to start chatting")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const room = await getOrCreateChatRoomService(currentUserId, providerId)
        openChat(room.id, providerId, providerName)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to open chat"
        setError(msg)
        message.error(msg)
      } finally {
        setLoading(false)
      }
    },
    [openChat]
  )

  return { startChat, loading, error }
}
