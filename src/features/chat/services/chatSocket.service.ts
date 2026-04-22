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
// Tracks whether an async deactivate() is currently in-flight
let isDisconnecting = false
// Tracks how many consumers currently hold the connection.
// Only actually disconnect when the last consumer releases.
let refCount = 0

/**
 * Connect the shared STOMP socket.
 *
 * Multiple components (ChatPopup, ProviderChatPanel, ProviderMessagesPage) can
 * call this concurrently.  The socket is a singleton — only the first call
 * creates a new Client.  Subsequent calls just register their callback and
 * bump the refCount.
 *
 * Returns a cleanup function that decrements refCount and only truly
 * disconnects when no consumers remain.
 */
export function connectChatSocket(onConnected?: () => void): () => void {
  refCount++

  console.log("[chatSocket] WS STATE", {
    refCount,
    isConnecting,
    isDisconnecting,
    connected: stompClient?.connected,
  })

  if (onConnected) {
    connectionCallbacks.push(onConnected)
  }

  // Already fully connected — fire callbacks immediately
  if (stompClient?.connected) {
    console.log("[chatSocket] Already connected, firing callbacks immediately")
    connectionCallbacks.forEach((cb) => cb())
    connectionCallbacks = []
    connectionListeners.forEach((cb) => cb(true))
    return createReleaseHandle()
  }

  // A connection attempt is already in-flight — let it resolve.
  // The callback was already pushed above, so it will fire once connected.
  if (isConnecting) {
    console.log("[chatSocket] Connection already in-flight, waiting...")
    return createReleaseHandle()
  }

  // A previous disconnect is still in-flight (deactivate() is async).
  // Don't try to activate now — the callback is already queued and
  // will fire if/when a subsequent connect creates a fresh client.
  if (isDisconnecting) {
    console.log("[chatSocket] Waiting for disconnect to finish...")
    return createReleaseHandle()
  }

  const token = getAuth()?.token
  if (!token) {
    console.warn("[chatSocket] No token found, cannot connect")
    connectionCallbacks = []
    refCount-- // undo the increment since we're bailing
    return () => {}
  }

  console.log("WS INIT", { token: token.slice(0, 20) + "...", wsEndpoint: WS_ENDPOINT })

  isConnecting = true
  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("WS CONNECTED")
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
      isConnecting = false
    },
    onWebSocketError: (event) => {
      console.error("[chatSocket] WebSocket error:", event)
      isConnecting = false
    },
    reconnectDelay: 5000,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
  })

  console.log("WS CONNECT — activating STOMP client")
  stompClient.activate()

  return createReleaseHandle()
}

/**
 * Build a one-shot release handle.  Each consumer receives its own handle;
 * calling it decrements refCount.  The actual socket is only torn down when
 * every consumer has released AND no new consumers have attached.
 *
 * A 300ms delay is added before teardown to survive React StrictMode's
 * unmount→remount cycle: the remount re-increments refCount before the
 * timeout fires, so the connection stays alive.
 */
function createReleaseHandle(): () => void {
  let released = false
  return () => {
    if (released) return
    released = true
    refCount--
    console.log("[chatSocket] Release handle called, refCount:", refCount)
    if (refCount <= 0) {
      refCount = 0
      // Delay teardown so StrictMode's immediate re-mount can reclaim the
      // connection before it is destroyed.
      setTimeout(() => {
        if (refCount <= 0) {
          forceDisconnect()
        }
      }, 300)
    }
  }
}

/**
 * Forcefully disconnect and tear down the STOMP client.
 * Called only when refCount reaches 0 or when the user logs out.
 *
 * Async-safe: awaits deactivate() and uses the isDisconnecting flag so
 * concurrent connect attempts know not to race against the teardown.
 */
async function forceDisconnect(): Promise<void> {
  if (!stompClient || isDisconnecting) return

  isDisconnecting = true
  console.log("[chatSocket] forceDisconnect — deactivating client")

  try {
    await stompClient.deactivate()
  } finally {
    stompClient = null
    isConnecting = false
    isDisconnecting = false
    connectionCallbacks = []
    connectionListeners.forEach((cb) => cb(false))
  }
}

/**
 * Disconnect the chat socket.  Public API kept for backward compatibility.
 * Calling this always forces a full disconnect regardless of refCount.
 */
export function disconnectChatSocket(): void {
  refCount = 0
  forceDisconnect()
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

/**
 * Register a listener that fires whenever the connection state changes.
 * Returns an unsubscribe function.
 */
export function onConnectionChange(listener: (connected: boolean) => void): () => void {
  connectionListeners.add(listener)
  return () => {
    connectionListeners.delete(listener)
  }
}
