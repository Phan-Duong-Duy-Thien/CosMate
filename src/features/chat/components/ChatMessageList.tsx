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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <MessageCircle className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-base font-medium text-slate-400">No messages yet</p>
          <p className="mt-1 text-sm text-slate-400">Send a message to start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === currentUserId}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
