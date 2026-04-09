import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { getAuth } from "@/features/auth/services/tokenStorage"
import type { SendMessagePayload, ChatMessage } from "../types"

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
const WS_ENDPOINT = `${WS_BASE_URL}/ws`
const SEND_DESTINATION = "/app/chat.sendMessage"

let stompClient: Client | null = null
let connectionCallbacks: Array<() => void> = []
let connectionListeners: Set<(connected: boolean) => void> = new Set()
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 3
// Module-level flag to prevent multiple concurrent connect attempts
let isConnecting = false

export function connectChatSocket(onConnected?: () => void): void {
  if (onConnected) {
    connectionCallbacks.push(onConnected)
  }

  // Already fully connected — fire callbacks immediately
  if (stompClient?.connected) {
    connectionCallbacks.forEach((cb) => cb())
    connectionCallbacks = []
    connectionListeners.forEach((cb) => cb(true))
    return
  }

  // A connection attempt is already in-flight — let it resolve
  if (isConnecting) return

  const token = getAuth()?.token
  if (!token) {
    console.warn("[chatSocket] No token found, cannot connect")
    connectionCallbacks = []
    return
  }

  const socketUrl = WS_ENDPOINT

  isConnecting = true
  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("[chatSocket] Connected")
      isConnecting = false
      reconnectAttempts = 0
      connectionCallbacks.forEach((cb) => cb())
      connectionCallbacks = []
      connectionListeners.forEach((cb) => cb(true))
    },
    onDisconnect: () => {
      console.log("[chatSocket] Disconnected")
      connectionListeners.forEach((cb) => cb(false))
    },
    onStompError: (frame) => {
      console.error("[chatSocket] STOMP error:", frame)
    },
    onWebSocketError: (event) => {
      console.error("[chatSocket] WebSocket error:", event)
    },
    onStompFrame: (frame) => {
      console.log("[chatSocket] STOMP frame:", frame.command)
    },
    reconnectDelay: 5000,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
  })

  stompClient.activate()
}

export function disconnectChatSocket(): void {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    isConnecting = false
    connectionCallbacks = []
    connectionListeners.forEach((cb) => cb(false))
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

  const subscription = stompClient.subscribe(
    `/topic/room/${roomId}`,
    (frame: IMessage) => {
      try {
        const message: ChatMessage = JSON.parse(frame.body)
        console.log("[chatSocket] Received message for room", roomId, ":", message)
        onMessage(message)
      } catch (err) {
        console.error("[chatSocket] Failed to parse message:", err)
      }
    }
  )

  return () => {
    subscription.unsubscribe()
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
