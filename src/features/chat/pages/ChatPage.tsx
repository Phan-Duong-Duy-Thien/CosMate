import { useState, useEffect, useRef } from "react"
import { useSearchParams, useParams, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatRooms } from "../hooks/useChatRooms"
import { useChatRoom } from "../hooks/useChatRoom"
import { ChatRoomList } from "../components/ChatRoomList"
import { ChatHeader } from "../components/ChatHeader"
import { ChatMessageList } from "../components/ChatMessageList"
import { ChatFooterInput } from "../components/ChatFooterInput"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
  disconnectChatSocket,
} from "../services/chatSocket.service"
import { getChatMessagesService, markRoomAsReadService } from "../services/chat.service"
import { useUnreadCount } from "../hooks/useUnreadCount"
import type { ChatPartner, ChatMessage } from "../types"

type ChatMode = "partner" | "room" | "list"

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const { roomId } = useParams<{ roomId?: string }>()
  const navigate = useNavigate()

  const currentUserId = getUserId()
  const currentUserIdNum = currentUserId ?? null
  const [inputValue, setInputValue] = useState("")
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const roomIdNum = roomId ? Number(roomId) : null
  const mode: ChatMode = roomIdNum !== null ? "room" : (searchParams.get("partnerId") ? "partner" : "list")

  const { rooms } = useChatRooms()
  const [partnerId, setPartnerId] = useState<number | null>(searchParams.get("partnerId") ? Number(searchParams.get("partnerId")) : null)

  const { room, loading: roomLoading, error: roomError } = useChatRoom(
    mode === "partner" && !activeRoomId ? currentUserIdNum : null,
    mode === "partner" && !activeRoomId ? partnerId : null
  )

  const resolvedRoomId = mode === "room" ? roomIdNum : (activeRoomId ?? room?.id ?? null)

  const { refetch: refetchUnread } = useUnreadCount(currentUserId)

  // Derive partner info from rooms array (single source of truth)
  const roomFromList = rooms.find((r) => r.roomId === activeRoomId)
  const partnerFromList = roomFromList
    ? { partnerId: roomFromList.partnerId, fullName: roomFromList.partnerName ?? "Unknown", avatarUrl: roomFromList.partnerAvatar ?? "" }
    : null

  // Fallback: use partnerId from URL (for new conversations)
  const partnerFromUrl = searchParams.get("partnerId")
    ? { partnerId: Number(searchParams.get("partnerId")), fullName: "Chat", avatarUrl: "" }
    : null

  const partner: ChatPartner | null = partnerFromList ?? partnerFromUrl
  const partnerLoading = false

  // ── Message store (single source of truth) ──────────────────────────────
  const { messages, setMessages, mergeServerMessage, clearMessages } = useChatMessageStore()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Load history from REST API
  useEffect(() => {
    if (resolvedRoomId === null) return
    setIsLoadingHistory(true)
    clearMessages()
    getChatMessagesService(resolvedRoomId)
      .then((data) => setMessages(data?.content ?? []))
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingHistory(false))
  }, [resolvedRoomId, setMessages, clearMessages])

  // Mark room as read when user opens it
  useEffect(() => {
    if (resolvedRoomId === null || currentUserIdNum === null) return
    markRoomAsReadService(resolvedRoomId, currentUserIdNum).then(refetchUnread)
  }, [resolvedRoomId, currentUserIdNum, refetchUnread])

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
    if (!isConnected || resolvedRoomId === null) return
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    unsubscribeRef.current = subscribeChatRoom(resolvedRoomId, (msg: ChatMessage) => {
      console.log("[ChatPage] Server message:", msg)
      mergeServerMessage(msg)
    })
  }, [isConnected, resolvedRoomId, mergeServerMessage])

  // Reset on room change
  useEffect(() => {
    setInputValue("")
  }, [resolvedRoomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSelectRoom = (roomItem: { roomId: number }) => {
    setActiveRoomId(roomItem.roomId)
    setInputValue("")
  }

  const handleSend = (content: string) => {
    if (!content.trim() || resolvedRoomId === null || currentUserIdNum === null) return
    sendChatMessage({ roomId: resolvedRoomId, senderId: currentUserIdNum, content: content.trim() })
  }

  const isInChat = resolvedRoomId !== null

  // List mode: no room selected
  if (mode === "list") {
    return (
      <div className="flex h-[calc(100vh-56px)] bg-slate-100">
        {/* Left Sidebar */}
        <div className="hidden md:flex md:w-75 md:shrink-0 md:flex-col md:overflow-hidden md:border-r md:border-slate-200 md:bg-white">
          <div className="border-b border-slate-100 px-4 py-4">
            <h1 className="text-lg font-bold text-slate-800">Messages</h1>
          </div>
          <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
            <ChatRoomList rooms={rooms} activeRoomId={null} onSelectRoom={handleSelectRoom} />
          </div>
        </div>

        {/* Right - Empty state */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg font-medium text-slate-400">Start a conversation</p>
              <p className="mt-1 text-sm text-slate-400">Select a conversation from the sidebar</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-100">
      {/* Left Sidebar */}
      <div className="hidden md:flex md:w-75 md:shrink-0 md:flex-col md:overflow-hidden md:border-r md:border-slate-200 md:bg-white">
        <div className="border-b border-slate-100 px-4 py-4">
          <h1 className="text-lg font-bold text-slate-800">Messages</h1>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
          <ChatRoomList rooms={rooms} activeRoomId={resolvedRoomId} onSelectRoom={handleSelectRoom} />
        </div>
      </div>

      {/* Right - Chat Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(mode === "room" ? "/chat" : -1)}
              className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              ←
            </button>
            <ChatHeader partner={partner} loading={partnerLoading} isConnected={isConnected} />
          </div>

          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {roomError && (
          <div className="bg-red-50 px-4 py-2 text-sm text-red-600">
            {roomError}
          </div>
        )}

        {/* Message List */}
        {isInChat ? (
          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            {isLoadingHistory ? (
              <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-pink-400" />
                <p className="text-sm font-medium">Loading...</p>
              </div>
            ) : (
              <ChatMessageList messages={messages} currentUserId={currentUserIdNum} />
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg font-medium text-slate-400">Start a conversation</p>
              <p className="mt-1 text-sm text-slate-400">Say hello to get things going!</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {isInChat && (
          <ChatFooterInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={!isConnected || roomLoading}
          />
        )}
      </div>
    </div>
  )
}
