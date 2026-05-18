import { Client } from "@stomp/stompjs"
import type { IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const WS_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
  /\/+$/,
  ""
)
const WS_ENDPOINT = `${WS_BASE_URL}/ws`

export function qrLoginTopicForSession(sessionToken: string): string {
  return `/topic/qr-login/${sessionToken}`
}

/**
 * Anonymous STOMP for /login — no JWT. BE should allow SockJS with ?sessionToken=...
 * and publish approved JWT to `/topic/qr-login/{sessionToken}`.
 */
export function subscribeQrLoginSession(
  sessionToken: string,
  onMessage: (body: string) => void
): () => void {
  const encoded = encodeURIComponent(sessionToken)
  const wsUrl = `${WS_ENDPOINT}?sessionToken=${encoded}`

  let unsubscribeTopic: (() => void) | undefined

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 5000,
    onConnect: () => {
      const subscription = client.subscribe(
        qrLoginTopicForSession(sessionToken),
        (frame: IMessage) => {
          onMessage(frame.body)
        }
      )
      unsubscribeTopic = () => subscription.unsubscribe()
    },
    onStompError: (frame) => {
      console.error("[qrLoginSocket] STOMP error:", frame)
    },
    onWebSocketError: (event) => {
      console.error("[qrLoginSocket] WebSocket error:", event)
    },
  })

  client.activate()

  return () => {
    unsubscribeTopic?.()
    void client.deactivate()
  }
}
