import { useState, useEffect, useCallback, useRef } from "react"
import {
  connectChatSocket,
  disconnectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
} from "../services/chatSocket.service"
import type { ChatMessage, SendMessagePayload } from "../types"

interface UseChatSocketResult {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
}

export function useChatSocket(roomId: number | null, senderId: number | null): UseChatSocketResult {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }, []);

  const connect = useCallback(() => {
    connectChatSocket(() => {
      setIsConnected(true);
    });
  }, []);

  const disconnect = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    disconnectChatSocket();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (!isConnected || roomId === null) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    unsubscribeRef.current = subscribeChatRoom(roomId, handleIncomingMessage);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isConnected, roomId, handleIncomingMessage]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || roomId === null || senderId === null) return;
      const payload: SendMessagePayload = { roomId, senderId, content: content.trim() };
      sendChatMessage(payload);
    },
    [roomId, senderId]
  );

  return { isConnected, messages, sendMessage };
}
