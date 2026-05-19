import {
  connectChatSocket,
  subscribeStompTopic,
} from "@/features/chat/services/chatSocket.service"

export function wsImageTopicForSession(sessionToken: string): string {
  return `/topic/ws-image/${sessionToken}`
}

/**
 * Listen for mobile uploads on BE topic `/topic/ws-image/{sessionId}`.
 * Message body: `/ws-image/view/{imageId}` (see WsImageController).
 */
export function subscribeWsImageSession(
  sessionToken: string,
  onViewPath: (body: string) => void
): () => void {
  let releaseConnection: (() => void) | undefined
  let unsubscribeTopic: (() => void) | undefined

  releaseConnection = connectChatSocket(() => {
    unsubscribeTopic = subscribeStompTopic(
      wsImageTopicForSession(sessionToken),
      onViewPath
    )
  })

  return () => {
    unsubscribeTopic?.()
    releaseConnection?.()
  }
}
