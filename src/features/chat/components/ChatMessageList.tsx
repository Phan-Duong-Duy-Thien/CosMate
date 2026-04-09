import { useEffect, useRef, useMemo } from "react"
import { MessageCircle } from "lucide-react"
import { ChatMessageBubble } from "./ChatMessageBubble"
import type { ChatMessage } from "../types"

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: number | null;
}

/** Returns a label for the date group (e.g. "Today", "Yesterday", "Thứ 2", "28 Thg 3") */
function getDateLabel(date: Date): string {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "long" })
  return date.toLocaleDateString([], { day: "numeric", month: "long" })
}

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Only render messages that have a valid createdAt timestamp
  const validMessages = messages.filter((m) => m.createdAt && m.createdAt.trim() !== "")

  // Build list of (dateLabel, message) pairs with a flag for first-in-group
  const items = useMemo(() => {
    const result: { msg: ChatMessage; dateLabel: string; isFirstOfDay: boolean }[] = []
    let lastDateKey = ""

    for (const msg of validMessages) {
      const date = new Date(msg.createdAt)
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      const isFirstOfDay = dateKey !== lastDateKey
      if (isFirstOfDay) lastDateKey = dateKey
      result.push({ msg, dateLabel: getDateLabel(date), isFirstOfDay })
    }

    return result
  }, [validMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [items.length])

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
        {items.map(({ msg, dateLabel, isFirstOfDay }) => (
          <div key={msg.id}>
            {isFirstOfDay && (
              <div className="my-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] text-slate-400">{dateLabel}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            )}
            <ChatMessageBubble
              message={msg}
              isMine={msg.senderId === currentUserId}
            />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
