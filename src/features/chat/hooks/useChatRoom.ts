import { useState, useEffect, useCallback } from "react"
import { getOrCreateChatRoomService } from "../services/chat.service"
import type { ChatRoom } from "../types"

interface UseChatRoomResult {
  room: ChatRoom | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChatRoom(user1Id: number | null, user2Id: number | null): UseChatRoomResult {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (user1Id === null || user2Id === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrCreateChatRoomService(user1Id, user2Id);
      setRoom(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat room");
    } finally {
      setLoading(false);
    }
  }, [user1Id, user2Id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { room, loading, error, refetch: fetch };
}
