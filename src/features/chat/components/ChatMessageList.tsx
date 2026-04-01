import { useEffect, useRef } from "react"
import { ChatMessageBubble } from "./ChatMessageBubble"
import type { ChatMessage } from "../types"

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: number | null;
}

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-slate-400">Chưa có tin nhắn nào. Hãy gửi lời chào!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
      {messages.map((msg) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          isMine={msg.senderId === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
