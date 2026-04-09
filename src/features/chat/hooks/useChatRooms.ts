import { useState, useEffect, useCallback } from "react"
import { getUserChatRoomsService } from "../services/chat.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import type { ChatRoomListItem } from "../types"

interface UseChatRoomsResult {
  rooms: ChatRoomListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChatRooms(): UseChatRoomsResult {
  const [rooms, setRooms] = useState<ChatRoomListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    const userId = getUserId()
    if (userId === null) return

    setLoading(true)
    setError(null)
    try {
      const data = await getUserChatRoomsService(userId)
      setRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat rooms")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { rooms, loading, error, refetch: fetch }
}
