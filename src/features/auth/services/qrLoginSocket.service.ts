import { Client } from "@stomp/stompjs"
import type { IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const WS_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
  /\/+$/,
  ""
)
const WS_ENDPOINT = `${WS_BASE_URL}/ws`

/** BE: convertAndSend("/topic/qr/" + sessionId, ...) */
export function qrLoginTopicForSession(sessionId: string): string {
  return `/topic/qr/${sessionId}`
}

/**
 * QR login STOMP — BE accepts QR_LOGIN_SESSION via:
 *   SockJS /ws?token={sessionId}
 *   CONNECT header Authorization: Bearer {sessionId}
 */
export function subscribeQrLoginSession(
  sessionId: string,
  onMessage: (body: string) => void,
  onConnected?: () => void,
  onConnectError?: () => void
): () => void {
  const encoded = encodeURIComponent(sessionId)
  const wsUrl = `${WS_ENDPOINT}?token=${encoded}&access_token=${encoded}`

  let unsubscribeTopic: (() => void) | undefined
  let disposed = false
  let connected = false

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    connectHeaders: {
      Authorization: `Bearer ${sessionId}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      connected = true
      onConnected?.()
      const subscription = client.subscribe(
        qrLoginTopicForSession(sessionId),
        (frame: IMessage) => {
          onMessage(frame.body)
        }
      )
      unsubscribeTopic = () => subscription.unsubscribe()
    },
    onStompError: (frame) => {
      console.error("[qrLoginSocket] STOMP error:", frame.headers?.message ?? frame)
      if (!disposed && !connected) onConnectError?.()
    },
    onWebSocketError: (event) => {
      console.error("[qrLoginSocket] WebSocket error:", event)
      if (!disposed && !connected) onConnectError?.()
    },
  })

  client.activate()

  return () => {
    disposed = true
    unsubscribeTopic?.()
    void client.deactivate()
  }
}
