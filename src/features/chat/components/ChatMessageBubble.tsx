import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types"

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function ChatMessageBubble({ message, isMine }: ChatMessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
          isMine
            ? "rounded-br-md bg-pink-400 text-white"
            : "rounded-bl-md bg-white text-slate-800 shadow-sm border border-slate-100"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            "mt-1 text-[10px]",
            isMine ? "text-pink-100" : "text-slate-400"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
