import { useState } from "react"
import { useSearchParams, useParams, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatRoom } from "../hooks/useChatRoom"
import { useChatPartner } from "../hooks/useChatPartner"
import { useChatMessages } from "../hooks/useChatMessages"
import { useChatSocket } from "../hooks/useChatSocket"
import { useChatByRoomId } from "../hooks/useChatByRoomId"
import { ChatHeader } from "../components/ChatHeader"
import { ChatMessageList } from "../components/ChatMessageList"
import { ChatFooterInput } from "../components/ChatFooterInput"
import { cn } from "@/lib/utils"

type ChatMode = "partner" | "room"

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const { roomId } = useParams<{ roomId?: string }>()
  const navigate = useNavigate()

  const currentUserId = getUserId()
  const currentUserIdNum = currentUserId ?? null
  const [inputValue, setInputValue] = useState("")

  const roomIdNum = roomId ? Number(roomId) : null
  const mode: ChatMode = roomIdNum !== null ? "room" : "partner"

  // partnerId mode
  const partnerId = searchParams.get("partnerId")
  const partnerIdNum = partnerId ? Number(partnerId) : null

  const { room, loading: roomLoading, error: roomError } = useChatRoom(
    mode === "partner" ? currentUserIdNum : null,
    mode === "partner" ? partnerIdNum : null
  )

  const activeRoomId = mode === "room" ? roomIdNum : room?.id ?? null

  const { partner, loading: partnerLoading } = useChatPartner(
    activeRoomId,
    currentUserIdNum
  )

  const { messages: historyMessages } = useChatMessages(activeRoomId)

  const isRoomLoading = mode === "partner" && !room?.id

  const { isConnected, messages: realtimeMessages, sendMessage } = useChatSocket(
    activeRoomId,
    currentUserIdNum
  )

  // roomId mode: also fetch partner via dedicated hook
  const { partner: roomPartner, messages: roomHistory } = useChatByRoomId(
    mode === "room" ? roomIdNum : null,
    currentUserIdNum
  )

  // Merge: prefer partner from useChatPartner (uses same partner API), fallback to roomPartner
  const resolvedPartner = partner ?? roomPartner
  const resolvedLoading = partnerLoading || (mode === "room" && roomHistory.length === 0 && !roomError)

  // History: for room mode use dedicated hook results
  const resolvedHistory = mode === "room" ? roomHistory : historyMessages

  const allMessages = [
    ...resolvedHistory,
    ...realtimeMessages.filter(
      (rm) => !resolvedHistory.some((hm) => hm.id === rm.id)
    ),
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const isInChat = mode === "room" || partnerIdNum !== null

  // Guard: no valid entry point
  if (mode === "partner" && !partnerId) {
    return (
      <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <MessageCircle className="mb-4 h-16 w-16 text-slate-300" />
        <p className="text-lg font-medium text-slate-400">No conversation selected</p>
        <p className="mt-1 text-sm text-slate-400">Choose a conversation from the sidebar</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-100">
      {/* Left Sidebar - Conversation List */}
      <div className="hidden md:flex md:w-75 md:shrink-0 md:flex-col md:overflow-hidden md:border-r md:border-slate-200 md:bg-white">
        {/* Sidebar Header */}
        <div className="border-b border-slate-100 px-4 py-4">
          <h1 className="text-lg font-bold text-slate-800">Messages</h1>
        </div>

        {/* Conversation List */}
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-400">No conversations yet</p>
        </div>
      </div>

      {/* Right - Chat Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Back button - mobile only */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              ←
            </button>
            <ChatHeader partner={resolvedPartner} loading={resolvedLoading} isConnected={isConnected} />
          </div>

          {/* Mobile: show sidebar toggle */}
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
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatMessageList messages={allMessages} currentUserId={currentUserIdNum} />
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
            onSend={sendMessage}
            disabled={!isConnected || isRoomLoading}
          />
        )}
      </div>
    </div>
  )
}
