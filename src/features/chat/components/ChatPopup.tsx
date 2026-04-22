import { useState, useEffect, useRef } from "react"
import { X, Send, MessageCircle, Search, User, Image } from "lucide-react"
import { useChatPopup } from "./ChatPopupContext"
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
import { useUserSearch } from "../hooks/useUserSearch"
import type { SearchUserResult } from "../services/user.service"
import { getOrCreateChatRoomService } from "../services/chat.service"
import { message } from "antd"
import { cn } from "@/lib/utils"
import { resolveImageUrl } from "@/constants/images"
import type { ChatMessage, ChatRoomListItem } from "../types"
import cosmateLogo from "@/assets/logo.png"

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

function formatDateSeparator(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  if (isSameDay(date, today)) return "Hôm nay"
  if (isSameDay(date, yesterday)) return "Hôm qua"

  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${dayName}, ${day} tháng ${month}`
}

function getDateKey(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
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

  // ── Search state ──
  const [searchMode, setSearchMode] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const { users, loading: searchLoading } = useUserSearch(searchKeyword)

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

  const { messages, setMessages, mergeServerMessage, clearMessages, addOptimisticMessage, removeOptimisticMessage } = useChatMessageStore()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
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

    const content = inputValue.trim()
    if (!content) return
    sendChatMessage({ roomId: activeRoom.roomId, senderId, content, messageType: 'TEXT' })
    setInputValue("")
  }

  const handleSendImage = async (file: File) => {
    if (activeRoom === null) return
    const senderId = getUserId()
    if (senderId === null) return

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

      if (!url) {
        removeOptimisticMessage(tempId)
        return
      }

      sendChatMessage({ roomId: activeRoom.roomId, senderId, content: url, messageType: "IMAGE" })
      removeOptimisticMessage(tempId)
    } catch {
      message.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectRoom = (room: ChatRoomListItem) => {
    setSearchMode(false)
    setSearchKeyword("")
    setActiveRoom({
      roomId: room.roomId,
      partnerId: room.partnerId,
      partnerName: room.partnerName,
      partnerAvatar: room.partnerAvatar,
    })
  }

  const handleSelectUser = async (user: SearchUserResult) => {
    if (!currentUserId) {
      message.warning("Please log in to start chatting")
      return
    }

    // 1. Check if room already exists with this user
    const existingRoom = rooms.find((r) =>
      r.partnerId === user.id
    )

    if (existingRoom) {
      setSearchMode(false)
      setSearchKeyword("")
      setActiveRoom({
        roomId: existingRoom.roomId,
        partnerId: existingRoom.partnerId,
        partnerName: existingRoom.partnerName,
        partnerAvatar: existingRoom.partnerAvatar,
      })
      return
    }

    // 2. Create new room
    try {
      const newRoom = await getOrCreateChatRoomService(currentUserId, user.id)
      setSearchMode(false)
      setSearchKeyword("")
      setActiveRoom({
        roomId: newRoom.id,
        partnerId: user.id,
        partnerName: user.fullName,
        partnerAvatar: user.avatarUrl,
      })
    } catch (err) {
      message.error("Failed to start chat")
    }
  }

  if (!isOpen) return null

  const displayName = activeRoom?.partnerName ?? "Chat"
  const avatar = activeRoom?.partnerAvatar
  const validMessages = messages.filter((m) => m.createdAt && m.createdAt.trim() !== "")

  return (
    // Outer: fixed position, full height, ROW layout (sidebar | chat)
    <div className="fixed bottom-4 right-4 z-50 flex h-[500px] w-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

      {/* ── LEFT SIDEBAR (fixed width, full height, scrollable list) ── */}
      <div className="flex h-full w-[140px] shrink-0 flex-col border-r border-slate-100">
        {/* Header: logo + search */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-2">
          <img src={cosmateLogo} alt="Cosmate" className="h-6 w-auto object-contain" />
          <button
            type="button"
            onClick={() => {
              setSearchMode(true)
              setSearchKeyword("")
            }}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
              searchMode
                ? "bg-pink-100 text-pink-500"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
            aria-label="Search users"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search input — only shown in search mode */}
        {searchMode && (
          <div className="shrink-0 border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search users..."
                className="h-8 w-full rounded-full border border-slate-200 bg-slate-50 pl-7 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchKeyword("")
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Search results */}
          {searchMode ? (
            searchLoading ? (
              <div className="flex flex-col gap-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                      <div className="h-2 w-1/2 rounded bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="flex w-full flex-col gap-0.5 p-1.5">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="group relative flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-pink-50"
                  >
                    {/* Avatar with hover tooltip */}
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-[10px] font-semibold text-pink-600">
                          {computeInitials(user.fullName)}
                        </div>
                      )}
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-lg opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                        <span className="block font-medium">{user.fullName}</span>
                        <span className="block text-slate-400">@{user.username}</span>
                        <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-full rotate-45 border-b border-r border-slate-100 bg-white" />
                      </div>
                    </div>
                    {/* Name + role */}
                    <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
                      <span className="truncate text-xs font-medium text-slate-700">{user.fullName}</span>
                      <span className="truncate text-[10px] text-slate-400">{user.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchKeyword.trim() ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-slate-400">
                <User className="h-6 w-6 text-slate-300" />
                <p className="text-xs">No users found</p>
              </div>
            ) : null
          ) : roomsLoading ? (
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

        {/* Search mode exit hint */}
        {searchMode && (
          <div className="shrink-0 border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={() => {
                setSearchMode(false)
                setSearchKeyword("")
              }}
              className="flex w-full items-center justify-center gap-1 rounded-lg py-1 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
              Exit search
            </button>
          </div>
        )}
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
            <div className="min-w-0 flex items-center">
              <p className="truncate text-sm font-semibold leading-tight text-slate-800">{displayName}</p>
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
                {validMessages.map((msg, idx) => {
                  const isMine = currentUserId !== null ? msg.senderId === currentUserId : false
                  const time = formatMessageTime(msg.createdAt)
                  const dateKey = getDateKey(msg.createdAt)
                  const prevDateKey = idx > 0 ? getDateKey(validMessages[idx - 1].createdAt) : null
                  const showDateSeparator = idx === 0 || dateKey !== prevDateKey
                  return (
                    <>
                      {showDateSeparator && (
                        <div key={`date-${dateKey}`} className="flex items-center gap-2 my-3">
                          <div className="h-px flex-1 bg-slate-200" />
                          <span className="text-[10px] text-slate-400 font-medium px-2 whitespace-nowrap">
                            {formatDateSeparator(msg.createdAt)}
                          </span>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>
                      )}
                      <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm overflow-hidden",
                            isMine
                              ? "rounded-br-sm"
                              : "rounded-bl-sm"
                          )}
                          style={isMine ? { background: "linear-gradient(135deg, #f472b6, #ec4899)" } : {}}
                        >
                          {(msg.messageType === "IMAGE" || (msg.content ?? "").startsWith("http")) ? (() => {
                            const imgSrc = resolveImageUrl(msg.content ?? "")
                            return (
                              <img
                                src={imgSrc}
                                alt="Shared image"
                                className="block max-w-full cursor-pointer object-cover"
                                style={{ maxHeight: "250px", maxWidth: "200px" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                }}
                              />
                            )
                          })() : (
                            <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                          )}
                          {time && (
                            <p className={cn("mt-0.5 text-[10px]", isMine ? "text-pink-200" : "text-slate-400")}>
                              {time}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Footer input — fixed height, always visible */}
        <div className="flex h-[60px] shrink-0 items-start gap-2 border-t border-slate-200 bg-white px-3 py-2">
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
            placeholder={activeRoom ? "Type a message..." : "Select a room"}
            disabled={!activeRoom || !isConnected}
            rows={1}
            style={{ resize: "none" }}
            className={cn(
              "max-h-24 flex-1 resize-none overflow-hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400",
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