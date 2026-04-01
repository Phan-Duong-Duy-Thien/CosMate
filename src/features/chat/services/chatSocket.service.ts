import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { getAuth } from "@/features/auth/services/tokenStorage"
import type { SendMessagePayload, ChatMessage } from "../types"

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
const WS_ENDPOINT = `${WS_BASE_URL}/ws`
const SEND_DESTINATION = "/app/chat.sendMessage"

let stompClient: Client | null = null
const messageListeners: Set<(message: ChatMessage) => void> = new Set()

export function connectChatSocket(onConnected?: () => void): void {
  if (stompClient?.connected) {
    onConnected?.()
    return
  }

  const token = getAuth()?.token
  if (!token) {
    console.warn("[chatSocket] No token found, cannot connect")
    return
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("[chatSocket] Connected")
      onConnected?.()
    },
    onDisconnect: () => {
      console.log("[chatSocket] Disconnected")
    },
    onStompError: (frame) => {
      console.error("[chatSocket] STOMP error:", frame)
    },
    onWebSocketError: (event) => {
      console.error("[chatSocket] WebSocket error:", event)
    },
  })

  stompClient.activate()
}

export function disconnectChatSocket(): void {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    messageListeners.clear()
  }
}

export function subscribeChatRoom(
  roomId: number,
  onMessage: (message: ChatMessage) => void
): () => void {
  if (!stompClient?.connected) {
    console.warn("[chatSocket] Not connected, cannot subscribe")
    return () => {}
  }

  messageListeners.add(onMessage)

  const subscription = stompClient.subscribe(
    `/topic/room/${roomId}`,
    (frame: IMessage) => {
      try {
        const message: ChatMessage = JSON.parse(frame.body)
        console.log("[chatSocket] Received message:", message)
        messageListeners.forEach((listener) => listener(message))
      } catch (err) {
        console.error("[chatSocket] Failed to parse message:", err)
      }
    }
  )

  return () => {
    subscription.unsubscribe()
    messageListeners.delete(onMessage)
  }
}

export function sendChatMessage(payload: SendMessagePayload): void {
  if (!stompClient?.connected) {
    console.warn("[chatSocket] Not connected, cannot send message")
    return
  }

  stompClient.publish({
    destination: SEND_DESTINATION,
    body: JSON.stringify(payload),
  })
}
