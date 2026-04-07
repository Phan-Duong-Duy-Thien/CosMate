import { useEffect, useRef } from "react"
import { MessageCircle } from "lucide-react"
import { ChatMessageBubble } from "./ChatMessageBubble"
import type { ChatMessage } from "../types"

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: number | null;
}

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Only render messages that have a valid createdAt timestamp
  const validMessages = messages.filter((m) => m.createdAt && m.createdAt.trim() !== "")

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [validMessages.length])

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
        <MessageCircle className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium">No messages yet</p>
        <p className="text-xs">Send a message to start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {validMessages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
