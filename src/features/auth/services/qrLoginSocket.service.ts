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

type ConnectMode = "query-token" | "query-session-id" | "header-session-id"

function buildWsUrl(sessionId: string, mode: ConnectMode): string {
  const encoded = encodeURIComponent(sessionId)
  if (mode === "query-session-id") {
    return `${WS_ENDPOINT}?sessionId=${encoded}`
  }
  return `${WS_ENDPOINT}?token=${encoded}&access_token=${encoded}`
}

function buildConnectHeaders(
  sessionId: string,
  mode: ConnectMode
): Record<string, string> | undefined {
  if (mode === "header-session-id") {
    return { sessionId }
  }
  return undefined
}

/**
 * QR login STOMP — sessionId is UUID in Tokens (QR_LOGIN_SESSION), not user JWT.
 * Do not send Authorization: Bearer {uuid} — Spring JWT filter rejects it.
 */
export function subscribeQrLoginSession(
  sessionId: string,
  onMessage: (body: string) => void,
  onConnectError?: () => void
): () => void {
  const modes: ConnectMode[] = ["query-token", "query-session-id", "header-session-id"]
  let modeIndex = 0
  let activeClient: Client | null = null
  let unsubscribeTopic: (() => void) | undefined
  let disposed = false
  let connected = false
  let errorReported = false

  const cleanup = () => {
    unsubscribeTopic?.()
    unsubscribeTopic = undefined
    if (activeClient) {
      void activeClient.deactivate()
      activeClient = null
    }
  }

  const tryNext = () => {
    if (disposed || connected) return
    cleanup()

    if (modeIndex >= modes.length) {
      if (!errorReported) {
        errorReported = true
        onConnectError?.()
      }
      return
    }

    const mode = modes[modeIndex]
    modeIndex += 1

    const client = new Client({
      webSocketFactory: () => new SockJS(buildWsUrl(sessionId, mode)),
      connectHeaders: buildConnectHeaders(sessionId, mode),
      reconnectDelay: 0,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        connected = true
        const subscription = client.subscribe(
          qrLoginTopicForSession(sessionId),
          (frame: IMessage) => {
            onMessage(frame.body)
          }
        )
        unsubscribeTopic = () => subscription.unsubscribe()
      },
      onStompError: () => {
        if (!connected) tryNext()
        else void client.deactivate()
      },
      onWebSocketError: () => {
        if (!connected) tryNext()
      },
    })

    activeClient = client
    client.activate()
  }

  tryNext()

  return () => {
    disposed = true
    cleanup()
  }
}
