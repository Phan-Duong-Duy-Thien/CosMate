import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types"

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function ChatMessageBubble({ message, isMine }: ChatMessageBubbleProps) {
  const time = !message.createdAt
    ? ""
    : (() => {
        const date = new Date(message.createdAt)
        return isNaN(date.getTime())
          ? ""
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      })()

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "group relative max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all overflow-hidden",
          isMine
            ? "rounded-br-sm bg-linear-to-br from-pink-400 to-pink-500 text-white"
            : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
        )}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-[10px]",
            isMine ? "justify-end text-pink-200" : "text-slate-400"
          )}
        >
          {!isMine && (
            <svg className="h-3 w-3 text-pink-300 opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
          )}
          {time}
        </p>
      </div>
    </div>
  )
}
