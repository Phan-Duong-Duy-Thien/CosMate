import { useState, useEffect, useCallback, useRef } from "react"
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
  const fetchCalled = useRef(false)

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

  // Fetch on mount if already logged in
  useEffect(() => {
    if (fetchCalled.current) return
    if (getUserId() === null) return

    fetchCalled.current = true
    fetch()
  }, [fetch])

  // Re-fetch when auth changes (login / logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const userId = getUserId()
      if (userId !== null) {
        fetchCalled.current = true
        fetch()
      } else {
        // Logged out — clear rooms
        fetchCalled.current = false
        setRooms([])
        setError(null)
      }
    }
    window.addEventListener("auth:changed", handleAuthChange)
    return () => window.removeEventListener("auth:changed", handleAuthChange)
  }, [fetch])

  return { rooms, loading, error, refetch: fetch }
}
