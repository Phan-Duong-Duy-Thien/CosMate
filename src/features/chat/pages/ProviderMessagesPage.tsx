import { useState, useEffect, useRef } from "react"
import { MessageCircle } from "lucide-react"
import { DashboardLayout } from "@/app/layouts/DashboardLayout"
import { useChatRooms } from "../hooks/useChatRooms"
import { getChatMessagesService } from "../services/chat.service"
import { ChatRoomList } from "../components/ChatRoomList"
import { ChatMessageList } from "../components/ChatMessageList"
import { ChatFooterInput } from "../components/ChatFooterInput"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
  disconnectChatSocket,
} from "../services/chatSocket.service"
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from "@/features/provider/constants/sidebar"
import { useLocation } from "react-router-dom"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import { cn } from "@/lib/utils"
import type { DashboardSidebarItem } from "@/app/layouts/DashboardLayout"
import type { ChatRoomListItem, ChatMessage } from "../types"

function mapSidebar(items: typeof providerSidebarItems): DashboardSidebarItem[] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: <item.icon size={18} />,
    path: item.path,
  }))
}

export default function ProviderMessagesPage() {
  const location = useLocation()
  const [activeRoom, setActiveRoom] = useState<ChatRoomListItem | null>(null)
  const [inputValue, setInputValue] = useState("")

  const currentUserId = getUserId()
  const { rooms, loading: roomsLoading } = useChatRooms()

  // ── Message store (single source of truth) ────────────────────────────
  const { messages, setMessages, mergeServerMessage, clearMessages } = useChatMessageStore()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Load history from REST API
  useEffect(() => {
    if (activeRoom?.roomId == null) return
    setIsLoadingHistory(true)
    clearMessages()
    getChatMessagesService(activeRoom.roomId)
      .then((data) => setMessages(data ?? []))
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingHistory(false))
  }, [activeRoom?.roomId, setMessages, clearMessages])

  // Connect socket
  useEffect(() => {
    connectChatSocket(() => setIsConnected(true))
    return () => disconnectChatSocket()
  }, [])

  // Subscribe to room channel
  useEffect(() => {
    if (!isConnected || activeRoom?.roomId == null) return
    const unsubscribe = subscribeChatRoom(activeRoom.roomId, (msg: ChatMessage) => {
      mergeServerMessage(msg)
    })
    return () => unsubscribe()
  }, [isConnected, activeRoom?.roomId, mergeServerMessage])

  // Auto-select first room
  useEffect(() => {
    if (activeRoom === null && rooms.length > 0) {
      setActiveRoom(rooms[0])
    }
  }, [rooms, activeRoom])

  // Clear input on room change
  useEffect(() => {
    setInputValue("")
  }, [activeRoom])

  const handleSelectRoom = (room: ChatRoomListItem) => {
    setActiveRoom(room)
  }

  const handleSend = (content: string) => {
    if (!content.trim() || activeRoom === null || currentUserId === null) return

    sendChatMessage({ roomId: activeRoom.roomId, senderId: currentUserId, content: content.trim() })
    setInputValue("")
  }

  // Determine sidebar based on current path
  let sidebarItems: DashboardSidebarItem[]
  if (location.pathname.startsWith("/provider-photograph")) {
    sidebarItems = mapSidebar(photographSidebarItems)
  } else if (location.pathname.startsWith("/provider-event-staff")) {
    sidebarItems = mapSidebar(eventStaffSidebarItems)
  } else {
    sidebarItems = mapSidebar(providerSidebarItems)
  }

  return (
    <DashboardLayout title="Messages" sidebarItems={sidebarItems} brandName="CosMate Provider">
      <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* LEFT: Conversation List */}
        <div className="flex w-72 shrink-0 flex-col border-r border-slate-100">
          <div className="flex h-14 shrink-0 items-center border-b border-slate-100 px-4">
            <h2 className="text-base font-semibold text-slate-700">Messages</h2>
          </div>
          <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
            {roomsLoading ? (
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-full rounded bg-slate-100 animate-pulse" />
                      <div className="h-2.5 w-1/2 rounded bg-slate-100 animate-pulse" />
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

        {/* RIGHT: Chat Window */}
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center border-b border-slate-100 bg-white px-4">
            <div className="flex items-center gap-3">
              {activeRoom ? (
                <>
                  <div className="relative shrink-0">
                    {activeRoom.partnerAvatar ? (
                      <img
                        src={activeRoom.partnerAvatar || undefined}
                        alt={activeRoom.partnerName || "Partner"}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-xs font-semibold text-pink-600 shadow-sm ring-2 ring-white">
                        {(activeRoom.partnerName || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                      isConnected ? "bg-green-400" : "bg-slate-300"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {activeRoom.partnerName || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 rounded bg-slate-100" />
                    <div className="h-2.5 w-16 rounded bg-slate-100" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Message List */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {!activeRoom ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <MessageCircle className="h-12 w-12 text-slate-300" />
                <p className="text-base font-medium">No conversation selected</p>
                <p className="text-sm">Select a conversation from the list</p>
              </div>
            ) : isLoadingHistory ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-pink-400" />
                <p className="text-sm font-medium">Loading...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <MessageCircle className="h-12 w-12 text-slate-300" />
                <p className="text-base font-medium">Start a conversation</p>
                <p className="text-sm">Say hello to get things started!</p>
              </div>
            ) : (
              <ChatMessageList messages={messages} currentUserId={currentUserId} />
            )}
          </div>

          {/* Footer */}
          {activeRoom && (
            <ChatFooterInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              disabled={!isConnected}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
