import { useState, useEffect, useCallback, useRef } from "react"
import { getUserChatRoomsService } from "../services/chat.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { onRoomListRefresh, notifyRoomListRefresh } from "../services/chatSocket.service"
import type { ChatMessage, ChatRoomListItem } from "../types"

interface UseChatRoomsResult {
  rooms: ChatRoomListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function sortRoomsByLastMessage(rooms: ChatRoomListItem[]): ChatRoomListItem[] {
  return [...rooms].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  )
}

function bumpRoomTimestamp(
  rooms: ChatRoomListItem[],
  roomId: number,
  createdAt: string,
): ChatRoomListItem[] {
  const idx = rooms.findIndex((r) => r.roomId === roomId)
  if (idx === -1) return rooms

  const updated = { ...rooms[idx], lastMessageAt: createdAt }
  const next = [...rooms]
  next.splice(idx, 1)
  return sortRoomsByLastMessage([updated, ...next])
}

export function useChatRooms(): UseChatRoomsResult {
  const [rooms, setRooms] = useState<ChatRoomListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchCalled = useRef(false)
  const roomsRef = useRef(rooms)
  roomsRef.current = rooms

  const fetch = useCallback(async () => {
    const userId = getUserId()
    if (userId === null) return

    setLoading(true)
    setError(null)
    try {
      const data = await getUserChatRoomsService(userId)
      setRooms(sortRoomsByLastMessage(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat rooms")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRoomListRefresh = useCallback(
    (hint: ChatMessage | null) => {
      if (getUserId() === null) return

      const roomId = hint?.roomId
      const createdAt = hint?.createdAt

      if (
        roomId !== undefined &&
        createdAt &&
        roomsRef.current.some((r) => r.roomId === roomId)
      ) {
        setRooms((prev) => bumpRoomTimestamp(prev, roomId, createdAt))
        return
      }

      fetch()
    },
    [fetch],
  )

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
        fetchCalled.current = false
        setRooms([])
        setError(null)
      }
    }
    window.addEventListener("auth:changed", handleAuthChange)
    return () => window.removeEventListener("auth:changed", handleAuthChange)
  }, [fetch])

  // Refresh inbox when WebSocket sends/receives a message (new room or new activity)
  useEffect(() => {
    return onRoomListRefresh(handleRoomListRefresh)
  }, [handleRoomListRefresh])

  return { rooms, loading, error, refetch: fetch }
}

/** Call after REST create/get room so sidebar picks up the new partner without reload. */
export function refreshChatRoomsList(): void {
  notifyRoomListRefresh(null)
}
