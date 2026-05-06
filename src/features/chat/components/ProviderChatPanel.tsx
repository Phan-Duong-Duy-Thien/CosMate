import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, Image } from "lucide-react"
import { useChatRooms } from "../hooks/useChatRooms"
import { getChatMessagesService, markRoomAsReadService, uploadImageService } from "../services/chat.service"
import { useUnreadCount } from "../hooks/useUnreadCount"
import { ChatRoomList } from "./ChatRoomList"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
} from "../services/chatSocket.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import { cn } from "@/lib/utils"
import { resolveImageUrl } from "@/constants/images"
import type { ChatRoomListItem, ChatMessage } from "../types"

function computeInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?"
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ProviderChatPanel() {
  const { rooms, loading: roomsLoading } = useChatRooms()
  const [activeRoom, setActiveRoom] = useState<ChatRoomListItem | null>(null)
  const [inputValue, setInputValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const currentUserId = getUserId()
  const { refetch: refetchUnread } = useUnreadCount(currentUserId)

  // ── Message store (single source of truth) ────────────────────────────
  const { messages, setMessages, mergeServerMessage, clearMessages, addOptimisticMessage, removeOptimisticMessage } = useChatMessageStore()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load history from REST API when room changes
  useEffect(() => {
    if (activeRoom?.roomId == null) return
    setIsLoadingHistory(true)
    clearMessages()
    getChatMessagesService(activeRoom.roomId)
      .then((data) => setMessages(data?.content ?? []))
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingHistory(false))
  }, [activeRoom?.roomId, setMessages, clearMessages])

  // Mark room as read when user opens it
  useEffect(() => {
    if (activeRoom?.roomId == null || currentUserId === null) return
    markRoomAsReadService(activeRoom.roomId, currentUserId).then(refetchUnread)
  }, [activeRoom?.roomId, currentUserId, refetchUnread])

  // Connect socket
  useEffect(() => {
    const release = connectChatSocket(() => setIsConnected(true))
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      release()
    }
  }, [])

  // Subscribe to room channel
  useEffect(() => {
    if (!isConnected || activeRoom?.roomId == null) return
    if (unsubscribeRef.current) unsubscribeRef.current()

    unsubscribeRef.current = subscribeChatRoom(activeRoom.roomId, (msg: ChatMessage) => {
      mergeServerMessage(msg)
    })
  }, [isConnected, activeRoom?.roomId, mergeServerMessage])

  // Scroll to bottom
  useEffect(() => {
    if (activeRoom !== null) setInputValue("")
  }, [activeRoom])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // ── Select room ────────────────────────────────────────────────────────
  const handleSelectRoom = (room: ChatRoomListItem) => {
    setActiveRoom(room)
  }

  // ── Send message ──────────────────────────────────────────────────────
  const handleSend = () => {
    if (!inputValue.trim() || activeRoom?.roomId == null) return
    const senderId = currentUserId
    if (senderId === null) return

    const content = inputValue.trim()
    if (!content) {
      console.error("[SEND TEXT] Message content is empty")
      return
    }

    console.log("[SEND TEXT]", content)
    sendChatMessage({ roomId: activeRoom.roomId, senderId, content, messageType: 'TEXT' })
    setInputValue("")
  }

  const handleSendImage = async (file: File) => {
    if (activeRoom?.roomId == null) return
    const senderId = currentUserId
    if (senderId === null) return

    console.log("[SEND IMAGE]", file)

    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) return

    setIsUploading(true)
    try {
      const objectUrl = URL.createObjectURL(file)
      const tempId = addOptimisticMessage({
        roomId: activeRoom.roomId,
        senderId,
        content: objectUrl,
        messageType: "IMAGE",
        createdAt: new Date().toISOString(),
        isRead: true,
      })

      const url = await uploadImageService(activeRoom.roomId, file)
      URL.revokeObjectURL(objectUrl)

      console.log("[UPLOAD IMAGE RESULT]", url)

      if (!url) {
        console.error("[SEND IMAGE] No image URL returned")
        removeOptimisticMessage(tempId)
        return
      }

      console.log("[SEND IMAGE MESSAGE]", { roomId: activeRoom.roomId, content: url, messageType: 'IMAGE' })
      sendChatMessage({ roomId: activeRoom.roomId, senderId, content: url, messageType: "IMAGE" })
      removeOptimisticMessage(tempId)
    } catch {
      // handled silently
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const displayName = activeRoom?.partnerName ?? "Chat"
  const avatar = activeRoom?.partnerAvatar ?? null

  return (
    <div className="flex h-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* LEFT: Room List Sidebar */}
      <div className="flex w-48 shrink-0 flex-col border-r border-slate-100">
        <div className="flex h-11 shrink-0 items-center justify-center border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-500">Messages</p>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
          {roomsLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                    <div className="h-2 w-1/2 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatRoomList rooms={rooms} activeRoomId={activeRoom?.roomId ?? null} onSelectRoom={handleSelectRoom} />
          )}
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="flex flex-1 min-h-0 flex-col">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center border-b border-slate-100 bg-white px-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar || undefined}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-xs font-semibold text-pink-600 shadow-sm ring-2 ring-white">
                  {computeInitials(displayName)}
                </div>
              )}
              <span className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                isConnected ? "bg-green-400" : "bg-slate-300"
              )} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {!activeRoom ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
              <MessageCircle className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs">Choose a chat from the left</p>
            </div>
          ) : isLoadingHistory ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-pink-400" />
              <p className="text-sm font-medium">Loading...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
              <MessageCircle className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Say hi to start the conversation!</p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
              <div className="flex flex-col gap-2">
                {messages
                  .filter((msg) => msg.createdAt && msg.createdAt.trim() !== "")
                  .map((msg) => {
                  const isMine = currentUserId !== null ? msg.senderId === currentUserId : false
                  const time = !msg.createdAt
                    ? ""
                    : (() => {
                        const msgDate = new Date(msg.createdAt)
                        return isNaN(msgDate.getTime())
                          ? ""
                          : msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      })()
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm overflow-hidden",
                          isMine ? "rounded-br-sm" : "rounded-bl-sm"
                        )}
                        style={isMine ? { background: "var(--gradient-chat-mine)" } : {}}
                      >
                        {msg.messageType === "IMAGE" || (msg.content ?? "").startsWith("http") ? (() => {
                          const imgSrc = resolveImageUrl(msg.content ?? "")
                          console.log("[ProviderChatPanel] IMAGE:", { content: msg.content, resolved: imgSrc })
                          return (
                            <img
                              src={imgSrc}
                              alt="Shared image"
                              className="block max-w-full cursor-pointer object-cover"
                              style={{ maxHeight: "250px", maxWidth: "200px" }}
                              onError={(e) => {
                                console.error("[ProviderChatPanel] Image load failed:", imgSrc)
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          )
                        })() : (
                          <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                        )}
                        <p className={cn("mt-0.5 text-[10px]", isMine ? "text-pink-200" : "text-slate-400")}>
                          {time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-start gap-2 border-t border-slate-200 bg-white px-4 py-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSendImage(file)
              e.target.value = ""
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!activeRoom || !isConnected || isUploading}
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
              activeRoom && isConnected && !isUploading
                ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                : "text-slate-300"
            )}
            aria-label="Attach image"
          >
            <Image className="h-4 w-4" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeRoom ? "Type a message..." : "Select a room to chat"}
            disabled={!activeRoom || !isConnected}
            rows={1}
            className="flex-1 resize-none rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 focus:border-pink-300 focus:bg-pink-50/50 overflow-y-auto whitespace-pre-wrap wrap-break-word"
            style={{ maxHeight: "120px" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || !activeRoom || !isConnected}
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
              inputValue.trim() && activeRoom && isConnected
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
