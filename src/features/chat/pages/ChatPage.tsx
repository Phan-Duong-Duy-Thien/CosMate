import { useState } from "react"
import { useSearchParams, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, WifiOff } from "lucide-react"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatRoom } from "../hooks/useChatRoom"
import { useChatPartner } from "../hooks/useChatPartner"
import { useChatMessages } from "../hooks/useChatMessages"
import { useChatSocket } from "../hooks/useChatSocket"
import { useChatByRoomId } from "../hooks/useChatByRoomId"
import { ChatHeader } from "../components/ChatHeader"
import { ChatMessageList } from "../components/ChatMessageList"
import { ChatFooterInput } from "../components/ChatFooterInput"

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

  // Guard: no valid entry point
  if (mode === "partner" && !partnerId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <p className="text-slate-500">Không tìm thấy người dùng để chat.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-pink-500 hover:underline"
        >
          Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <ChatHeader partner={resolvedPartner} loading={resolvedLoading} />
        {!isConnected && (
          <div className="flex items-center gap-1 text-xs text-orange-500">
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </div>
        )}
      </div>

      {/* Error */}
      {roomError && (
        <div className="bg-red-50 px-4 py-2 text-sm text-red-600">
          {roomError}
        </div>
      )}

      {/* Message List */}
      <ChatMessageList messages={allMessages} currentUserId={currentUserIdNum} />

      {/* Footer */}
      <ChatFooterInput
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
        disabled={!isConnected || !activeRoomId}
      />
    </div>
  )
}
