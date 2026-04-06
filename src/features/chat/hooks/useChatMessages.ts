import { useState, useEffect, useCallback } from "react"
import { getChatMessagesService } from "../services/chat.service"
import type { ChatMessage } from "../types"

interface UseChatMessagesResult {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChatMessages(roomId: number | null): UseChatMessagesResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (roomId === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getChatMessagesService(roomId);
      setMessages(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { messages, loading, error, refetch: fetch };
}
