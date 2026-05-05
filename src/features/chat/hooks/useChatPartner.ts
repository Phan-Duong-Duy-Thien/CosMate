import { useState, useEffect, useCallback } from "react"
import { getChatPartnerService } from "../services/chat.service"
import type { ChatPartner } from "../types"

interface UseChatPartnerResult {
  partner: ChatPartner | null;
  loading: boolean;
  error: string | null;
}

export function useChatPartner(roomId: number | null, currentUserId: number | null): UseChatPartnerResult {
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (roomId === null || currentUserId === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getChatPartnerService(roomId, currentUserId);
      setPartner(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load partner info");
    } finally {
      setLoading(false);
    }
  }, [roomId, currentUserId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { partner, loading, error };
}
