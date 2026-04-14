import { useState, useEffect, useRef } from "react"
import { X, Send, MessageCircle } from "lucide-react"
import { useChatPopup } from "./ChatPopupContext"
import { useChatRooms } from "../hooks/useChatRooms"
import { getChatMessagesService, markRoomAsReadService } from "../services/chat.service"
import { useUnreadCount } from "../hooks/useUnreadCount"
import { ChatRoomList } from "./ChatRoomList"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
  disconnectChatSocket,
} from "../services/chatSocket.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import { cn } from "@/lib/utils"
import type { ChatMessage, ChatRoomListItem } from "../types"

interface ActiveRoom {
  roomId: number
  partnerId: number
  partnerName: string | null
  partnerAvatar: string | null
}

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function formatMessageTime(isoString: string): string {
  if (!isoString) return ""
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function ChatPopup() {
  const {
    isOpen,
    roomId: initialRoomId,
    partnerId: initialPartnerId,
    partnerName: initialPartnerName,
    closeChat,
  } = useChatPopup()
  const { rooms, loading: roomsLoading } = useChatRooms()
  const currentUserId = getUserId()
  const { refetch: refetchUnread } = useUnreadCount(currentUserId)

  // Refetch unread count when popup opens
  useEffect(() => {
    if (isOpen) {
      refetchUnread()
    }
  }, [isOpen, refetchUnread])

  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null)

  useEffect(() => {
    if (initialRoomId !== null && initialPartnerId !== null) {
      setActiveRoom({
        roomId: initialRoomId,
        partnerId: initialPartnerId,
        partnerName: initialPartnerName,
        partnerAvatar: null,
      })
    }
  }, [initialRoomId, initialPartnerId, initialPartnerName])

  const { messages, setMessages, mergeServerMessage, clearMessages } = useChatMessageStore()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load history when room changes
  useEffect(() => {
    if (activeRoom === null) return
    setIsLoadingHistory(true)
    clearMessages()
    getChatMessagesService(activeRoom.roomId)
      .then((data) => setMessages(data?.content ?? []))
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingHistory(false))
  }, [activeRoom?.roomId, setMessages, clearMessages])

  // Mark room as read when user opens it
  useEffect(() => {
    if (activeRoom === null || currentUserId === null) return
    markRoomAsReadService(activeRoom.roomId, currentUserId).then(refetchUnread)
  }, [activeRoom?.roomId, currentUserId, refetchUnread])

  // Connect socket
  useEffect(() => {
    connectChatSocket(() => setIsConnected(true))
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      disconnectChatSocket()
    }
  }, [])

  // Subscribe to room channel
  useEffect(() => {
    if (!isConnected || activeRoom === null) return
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    unsubscribeRef.current = subscribeChatRoom(activeRoom.roomId, (msg: ChatMessage) => {
      mergeServerMessage(msg)
    })
  }, [isConnected, activeRoom?.roomId, mergeServerMessage])

  // Clear input on room change
  useEffect(() => {
    if (activeRoom !== null) setInputValue("")
  }, [activeRoom?.roomId])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSend = () => {
    if (!inputValue.trim() || activeRoom === null) return
    const senderId = getUserId()
    if (senderId === null) return
    sendChatMessage({ roomId: activeRoom.roomId, senderId, content: inputValue.trim() })
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectRoom = (room: ChatRoomListItem) => {
    setActiveRoom({
      roomId: room.roomId,
      partnerId: room.partnerId,
      partnerName: room.partnerName,
      partnerAvatar: room.partnerAvatar,
    })
  }

  if (!isOpen) return null

  const displayName = activeRoom?.partnerName ?? "Chat"
  const avatar = activeRoom?.partnerAvatar
  const validMessages = messages.filter((m) => m.createdAt && m.createdAt.trim() !== "")

  return (
    // Outer: fixed position, full height, ROW layout (sidebar | chat)
    <div className="fixed bottom-4 right-4 z-50 flex h-[500px] w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

      {/* ── LEFT SIDEBAR (fixed width, full height, scrollable list) ── */}
      <div className="flex h-full w-[112px] shrink-0 flex-col border-r border-slate-100">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-center border-b border-slate-100">
          <p className="truncate px-1 text-xs font-semibold text-slate-500">Messages</p>
        </div>
        {/* Room list — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
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
            <ChatRoomList
              rooms={rooms}
              activeRoomId={activeRoom?.roomId ?? null}
              onSelectRoom={handleSelectRoom}
            />
          )}
        </div>
      </div>

      {/* ── RIGHT CHAT AREA (fills remaining width) ── */}
      <div className="flex h-full min-w-0 flex-1 flex-col">

        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-xs font-semibold text-pink-600 shadow-sm ring-2 ring-white">
                  {computeInitials(displayName)}
                </div>
              )}
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                  isConnected ? "bg-green-400" : "bg-slate-300"
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
              <p className="text-xs text-slate-400">{isConnected ? "Online" : "Offline"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeChat}
            className="ml-2 shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message area — flex-1, scrolls independently */}
        <div className="flex-1 overflow-hidden">
          {!activeRoom ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
              <MessageCircle className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs">Choose a chat from the left</p>
            </div>
          ) : isLoadingHistory || validMessages.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
              {isLoadingHistory ? (
                <>
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-pink-400" />
                  <p className="text-sm font-medium">Loading...</p>
                </>
              ) : (
                <>
                  <MessageCircle className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs">Say hi to start the conversation!</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col overflow-y-auto px-3 py-2">
              {/* Messages anchored to bottom */}
              <div className="mt-auto flex flex-col gap-2">
                {validMessages.map((msg) => {
                  const isMine = currentUserId !== null ? msg.senderId === currentUserId : false
                  const time = formatMessageTime(msg.createdAt)
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                          isMine
                            ? "rounded-br-sm bg-linear-to-br from-pink-400 to-pink-500 text-white"
                            : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        {time && (
                          <p className={cn("mt-0.5 text-[10px]", isMine ? "text-pink-200" : "text-slate-400")}>
                            {time}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Footer input — fixed height, always visible */}
        <div className="flex h-[60px] shrink-0 items-start gap-2 border-t border-slate-200 bg-white px-3 py-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeRoom ? "Type a message..." : "Select a room"}
            disabled={!activeRoom || !isConnected}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus:border-pink-300 focus:bg-pink-50/50"
            )}
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
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}