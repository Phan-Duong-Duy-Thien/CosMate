import { useState, useEffect, useRef, Fragment } from "react"
import { X, Send, MessageCircle, Image } from "lucide-react"
import { useChatPopup } from "./ChatPopupContext"
import { useChatRooms, refreshChatRoomsList } from "../hooks/useChatRooms"
import {
  getOrCreateChatRoomService,
  markRoomAsReadService,
  uploadImageService,
} from "../services/chat.service"
import { useUnreadCount } from "../hooks/useUnreadCount"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
} from "../services/chatSocket.service"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import { useLoadChatHistory } from "../hooks/useLoadChatHistory"
import type { SearchUserResult } from "../services/user.service"
import { message } from "antd"
import { cn } from "@/lib/utils"
import { resolveImageUrl } from "@/constants/images"
import type { ChatMessage, ChatRoomListItem } from "../types"
import cosmateLogo from "@/assets/logo.png"
import { VI } from "@/shared/i18n/vi"
import { ChatInboxSidebar } from "./ChatInboxSidebar"
import { CHAT_UI } from "../constants/chatUi"

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
  const [currentUserId, setCurrentUserId] = useState<number | null>(getUserId())

  // Keep currentUserId in sync with auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => setCurrentUserId(getUserId())
    window.addEventListener("auth:changed", handleAuthChange)
    return () => window.removeEventListener("auth:changed", handleAuthChange)
  }, [])
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

  const roomId = activeRoom?.roomId ?? null
  const { messages, setMessages, mergeServerMessage, addOptimisticMessage, removeOptimisticMessage } =
    useChatMessageStore(roomId)
  const isLoadingHistory = useLoadChatHistory(roomId, setMessages)
  const showHistoryLoader = isLoadingHistory && messages.length === 0
  const [isConnected, setIsConnected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Mark room as read when user opens it
  useEffect(() => {
    if (activeRoom === null || currentUserId === null) return
    markRoomAsReadService(activeRoom.roomId, currentUserId).then(refetchUnread)
  }, [activeRoom?.roomId, currentUserId, refetchUnread])

  // Connect socket — re-run when user logs in / out
  useEffect(() => {
    if (currentUserId === null) return          // not logged in yet
    const release = connectChatSocket(() => setIsConnected(true))
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      release()
      setIsConnected(false)
    }
  }, [currentUserId])

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
    setActiveRoom({
      roomId: room.roomId,
      partnerId: room.partnerId,
      partnerName: room.partnerName,
      partnerAvatar: room.partnerAvatar,
    })
  }

  const handlePickUser = async (user: SearchUserResult) => {
    if (!currentUserId) {
      message.warning(VI.common.messages.chatNeedLogin)
      throw new Error("not logged in")
    }

    const existingRoom = rooms.find((r) => r.partnerId === user.id)
    if (existingRoom) {
      setActiveRoom({
        roomId: existingRoom.roomId,
        partnerId: existingRoom.partnerId,
        partnerName: existingRoom.partnerName,
        partnerAvatar: existingRoom.partnerAvatar,
      })
      return
    }

    try {
      const newRoom = await getOrCreateChatRoomService(currentUserId, user.id)
      refreshChatRoomsList()
      setActiveRoom({
        roomId: newRoom.id,
        partnerId: user.id,
        partnerName: user.fullName,
        partnerAvatar: user.avatarUrl,
      })
    } catch {
      message.error(VI.common.messages.chatStartFailed)
      throw new Error("create room failed")
    }
  }

  if (!isOpen) return null

  const displayName = activeRoom?.partnerName ?? "Chat"
  const avatar = activeRoom?.partnerAvatar
  return (
    <div className={CHAT_UI.popupShell}>

      <ChatInboxSidebar
        variant="compact"
        headerStart={<img src={cosmateLogo} alt="Cosmate" className="h-6 w-auto object-contain" />}
        rooms={rooms}
        roomsLoading={roomsLoading}
        activeRoomId={activeRoom?.roomId ?? null}
        onSelectRoom={handleSelectRoom}
        currentUserId={currentUserId}
        onPickUser={handlePickUser}
      />

      {/* ── RIGHT CHAT AREA (fills remaining width) ── */}
      <div className="flex h-full min-w-0 flex-1 flex-col">

        {/* Header */}
        <div className={CHAT_UI.popupHeader}>
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className={cn(CHAT_UI.avatarMd, CHAT_UI.avatarRing, "object-cover")}
                />
              ) : (
                <div className={cn(CHAT_UI.avatarFallbackMd, CHAT_UI.avatarRing)}>
                  {computeInitials(displayName)}
                </div>
              )}
              <span
                className={cn(
                  CHAT_UI.statusDot,
                  CHAT_UI.statusDotSm,
                  isConnected ? CHAT_UI.onlineDot : CHAT_UI.offlineDot,
                )}
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className={CHAT_UI.partnerTitle}>{displayName}</p>
              <p className={CHAT_UI.partnerStatus}>
                {isConnected ? VI.common.status.online : VI.common.status.offline}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeChat}
            className={CHAT_UI.closeIconBtn}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message area — flex-1, scrolls independently */}
        <div className="flex-1 overflow-hidden">
          {!activeRoom ? (
            <div className={CHAT_UI.messageEmpty}>
              <MessageCircle className={cn("h-10 w-10", CHAT_UI.emptyIcon)} />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs text-muted-foreground">Choose a chat from the left</p>
            </div>
          ) : showHistoryLoader ? (
            <div className={CHAT_UI.messageEmpty}>
              <div className={CHAT_UI.spinner} />
              <p className="text-sm font-medium">Loading...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className={CHAT_UI.messageEmpty}>
              <MessageCircle className={cn("h-10 w-10", CHAT_UI.emptyIcon)} />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs text-muted-foreground">Say hi to start the conversation!</p>
            </div>
          ) : (
            <div className={cn(CHAT_UI.messageScroll, CHAT_UI.messageScrollPad)}>
              {/* Messages anchored to bottom */}
              <div className="mt-auto flex flex-col gap-2">
                {messages.map((msg, idx) => {
                  const isMine = currentUserId !== null ? msg.senderId === currentUserId : false
                  const time = formatMessageTime(msg.createdAt)
                  const dateKey = getDateKey(msg.createdAt)
                  const prevDateKey = idx > 0 ? getDateKey(messages[idx - 1].createdAt) : null
                  const showDateSeparator = idx === 0 || dateKey !== prevDateKey
                  return (
                    <Fragment key={msg.id}>
                      {showDateSeparator && (
                        <div className="my-2 flex items-center gap-2">
                          <div className={CHAT_UI.sepLine} />
                          <span className={CHAT_UI.dateLabel}>
                            {formatDateSeparator(msg.createdAt)}
                          </span>
                          <div className={CHAT_UI.sepLine} />
                        </div>
                      )}
                      <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                        <div className={isMine ? CHAT_UI.mineBubble : CHAT_UI.theirBubble}>
                          {(msg.messageType === "IMAGE" || (msg.content ?? "").startsWith("http")) ? (() => {
                            const imgSrc = resolveImageUrl(msg.content ?? "")
                            return (
                              <img
                                src={imgSrc}
                                alt="Shared image"
                                className={CHAT_UI.imageInBubble}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                }}
                              />
                            )
                          })() : (
                            <p className="whitespace-pre-wrap wrap-break-word leading-snug">{msg.content}</p>
                          )}
                          {time && (
                            <p className={cn("mt-0.5 text-[10px]", isMine ? CHAT_UI.timeOnMine : CHAT_UI.timeOnTheirs)}>
                              {time}
                            </p>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Footer input — fixed height, always visible */}
        <div className={CHAT_UI.footerBarPopup}>
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
              CHAT_UI.iconBtnSm,
              activeRoom && isConnected && !isUploading
                ? CHAT_UI.ghostIconBtn
                : CHAT_UI.ghostIconDisabled,
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
            style={{ resize: "none", maxHeight: "6rem" }}
            className={cn(CHAT_UI.textarea, "overflow-x-hidden")}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || !activeRoom || !isConnected}
            className={cn(
              CHAT_UI.iconBtnSm,
              CHAT_UI.sendFab,
              !inputValue.trim() || !activeRoom || !isConnected ? "disabled:pointer-events-none" : "",
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