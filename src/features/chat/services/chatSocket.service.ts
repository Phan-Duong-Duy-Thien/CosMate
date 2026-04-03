import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { getAuth } from "@/features/auth/services/tokenStorage"
import type { SendMessagePayload, ChatMessage } from "../types"

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
const WS_ENDPOINT = `${WS_BASE_URL}/ws`
const SEND_DESTINATION = "/app/chat.sendMessage"

let stompClient: Client | null = null
let connectionCallbacks: Array<() => void> = []
const messageListeners: Set<(message: ChatMessage) => void> = new Set()
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 3

export function connectChatSocket(onConnected?: () => void): void {
  if (onConnected) {
    connectionCallbacks.push(onConnected)
  }

  if (stompClient?.connected) {
    connectionCallbacks.forEach((cb) => cb())
    connectionCallbacks = []
    return
  }

  const token = getAuth()?.token
  if (!token) {
    console.warn("[chatSocket] No token found, cannot connect")
    connectionCallbacks = []
    return
  }

  // Pass token as query param (SockJS handshake ignores Authorization headers)
  const socketUrl = `${WS_ENDPOINT}?token=${encodeURIComponent(token)}`

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("[chatSocket] Connected")
      reconnectAttempts = 0
      connectionCallbacks.forEach((cb) => cb())
      connectionCallbacks = []
    },
    onDisconnect: () => {
      console.log("[chatSocket] Disconnected")
    },
    onStompError: (frame) => {
      console.error("[chatSocket] STOMP error:", frame)
    },
    onWebSocketError: (event) => {
      console.error("[chatSocket] WebSocket error:", event)
      reconnectAttempts++
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn(`[chatSocket] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached, stopping`)
        disconnectChatSocket()
      }
    },
    reconnectDelay: 5000,
  })

  stompClient.activate()
}

export function disconnectChatSocket(): void {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    connectionCallbacks = []
    messageListeners.clear()
  }
}

export function subscribeChatRoom(
  roomId: number,
  onMessage: (message: ChatMessage) => void
): () => void {
  if (!stompClient?.connected) {
    console.warn("[chatSocket] Not connected, cannot subscribe to room", roomId)
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

  console.log("[chatSocket] Sending message:", payload)
  stompClient.publish({
    destination: SEND_DESTINATION,
    body: JSON.stringify(payload),
  })
}
