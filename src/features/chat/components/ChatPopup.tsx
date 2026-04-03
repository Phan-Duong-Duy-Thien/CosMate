import { useState, useEffect, useRef } from "react"
import { X, Send } from "lucide-react"
import { useChatPopup } from "./ChatPopupContext"
import { useChatPartner } from "../hooks/useChatPartner"
import { useChatMessages } from "../hooks/useChatMessages"
import { useChatSocket } from "../hooks/useChatSocket"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { cn } from "@/lib/utils"

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ChatPopup() {
  const { isOpen, roomId, partnerId, partnerName, closeChat } = useChatPopup()
  const currentUserId = getUserId()
  const currentUserIdNum = currentUserId ?? null

  const [inputValue, setInputValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { partner, loading: partnerLoading } = useChatPartner(roomId, currentUserIdNum)
  const { messages: historyMessages } = useChatMessages(roomId)
  const { isConnected, messages: realtimeMessages, sendMessage } = useChatSocket(roomId, currentUserIdNum)

  const resolvedPartner = partnerName ? { fullName: partnerName, avatarUrl: null } : (partner ? { fullName: partner.fullName, avatarUrl: partner.avatarUrl } : null)

  const allMessages = [
    ...historyMessages,
    ...realtimeMessages.filter((rm) => !historyMessages.some((hm) => hm.id === rm.id)),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages.length])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue.trim())
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  const displayName = resolvedPartner?.fullName ?? (partnerLoading ? "Loading..." : "Chat")
  const avatar = resolvedPartner?.avatarUrl

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200 text-sm font-semibold text-pink-600 shadow-sm ring-2 ring-white">
                {computeInitials(displayName)}
              </div>
            )}
            <span className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              isConnected ? "bg-green-400" : "bg-slate-300"
            )} />
          </div>

          {/* Name + status */}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">{isConnected ? "Online" : "Offline"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeChat}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
        {allMessages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-400">No messages yet. Say hi!</p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[320px] flex-col gap-2 p-3">
            {allMessages.map((msg) => {
              const isMine = msg.senderId === currentUserIdNum
              const time = new Date(msg.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
              return (
                <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                      isMine
                        ? "rounded-br-sm bg-gradient-to-br from-pink-400 to-pink-500 text-white"
                        : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={cn("mt-0.5 text-[10px]", isMine ? "text-pink-200" : "text-slate-400")}>
                      {time}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:bg-pink-50/50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
              inputValue.trim() && isConnected
                ? "bg-pink-400 text-white hover:bg-pink-500"
                : "bg-slate-100 text-slate-300"
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
