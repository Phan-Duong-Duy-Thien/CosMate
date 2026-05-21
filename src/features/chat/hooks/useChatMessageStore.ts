import { useState, useEffect, useCallback } from "react"
import type { ChatMessage } from "../types"
import { normalizeChatMessage, normalizeChatMessages } from "../utils/normalizeChatMessage"

/**
 * Module-level message cache keyed by roomId.
 * Shared across ChatPopup, ChatPage, provider panels, etc.
 * Survives component remounts within the same page session.
 * On full browser reload, history is re-fetched from REST API.
 */
const messagesByRoom = new Map<number, ChatMessage[]>()
const listeners = new Set<() => void>()

let tempIdCounter = -1

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
}

function getRoomMessages(roomId: number | null): ChatMessage[] {
  if (roomId === null) return []
  return messagesByRoom.get(roomId) ?? []
}

function setRoomMessages(roomId: number, messages: ChatMessage[]): void {
  messagesByRoom.set(roomId, normalizeChatMessages(messages))
  notifyListeners()
}

export function useChatMessageStore(roomId: number | null) {
  const [, setVersion] = useState(0)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    listeners.add(bump)
    return () => {
      listeners.delete(bump)
    }
  }, [])

  const messages = getRoomMessages(roomId)

  const setMessages = useCallback(
    (incoming: ChatMessage[]) => {
      if (roomId === null) return
      setRoomMessages(roomId, incoming)
    },
    [roomId],
  )

  const mergeServerMessage = useCallback((msg: ChatMessage) => {
    const targetRoomId = msg.roomId
    if (!targetRoomId) return

    const enriched = normalizeChatMessage(msg)
    if (!enriched) return

    const prev = messagesByRoom.get(targetRoomId) ?? []

    const filteredPrev = prev.filter(
      (m) => m.id >= 0 || m.senderId !== enriched.senderId || m.content !== enriched.content,
    )

    if (enriched.id > 0 && filteredPrev.some((m) => m.id === enriched.id)) {
      return
    }

    if (
      enriched.id > 0 &&
      (enriched.messageType === "IMAGE" || enriched.content.startsWith("http")) &&
      filteredPrev.some(
        (m) => m.senderId === enriched.senderId && m.content === enriched.content && m.id > 0,
      )
    ) {
      return
    }

    messagesByRoom.set(targetRoomId, normalizeChatMessages([...filteredPrev, enriched]))
    notifyListeners()
  }, [])

  const addOptimisticMessage = useCallback(
    (msg: Omit<ChatMessage, "id">): number => {
      if (roomId === null) return 0
      const tempId = tempIdCounter--
      const optimisticMsg: ChatMessage = { ...msg, id: tempId, roomId: msg.roomId ?? roomId }
      const prev = messagesByRoom.get(roomId) ?? []
      messagesByRoom.set(roomId, normalizeChatMessages([...prev, optimisticMsg]))
      notifyListeners()
      return tempId
    },
    [roomId],
  )

  const removeOptimisticMessage = useCallback(
    (tempId: number) => {
      if (roomId === null) return
      const prev = messagesByRoom.get(roomId) ?? []
      messagesByRoom.set(
        roomId,
        prev.filter((m) => m.id !== tempId),
      )
      notifyListeners()
    },
    [roomId],
  )

  const clearMessages = useCallback(() => {
    if (roomId === null) return
    messagesByRoom.delete(roomId)
    notifyListeners()
  }, [roomId])

  return {
    messages,
    setMessages,
    mergeServerMessage,
    clearMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
  }
}
