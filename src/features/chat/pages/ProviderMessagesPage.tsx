import { useState, useEffect, useRef } from "react"
import { MessageCircle, Plus } from "lucide-react"
import { Form, Select, DatePicker, InputNumber, message, Input } from "antd"
import dayjs from "dayjs"
import { DashboardLayout } from "@/app/layouts/DashboardLayout"
import { useChatRooms } from "../hooks/useChatRooms"
import { getChatMessagesService, markRoomAsReadService } from "../services/chat.service"
import { useUnreadCount } from "../hooks/useUnreadCount"
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
import { useCreateServiceBooking } from "@/features/service/hooks/useCreateServiceBooking"
import { useProviderServices } from "@/features/service/hooks/useProviderServices"
import { useCurrentProviderProfile } from "@/features/provider/hooks/useCurrentProviderProfile"
import { Modal } from "antd"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { DashboardSidebarItem } from "@/app/layouts/DashboardLayout"
import type { ChatRoomListItem, ChatMessage } from "../types"

function mapSidebar(items: typeof providerSidebarItems): DashboardSidebarItem[] {
  return items.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });
}

export default function ProviderMessagesPage() {
  const location = useLocation()
  const [activeRoom, setActiveRoom] = useState<ChatRoomListItem | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | null>(null)
  const [timeSlot, setTimeSlot] = useState("09:00")
  const [numberOfHuman, setNumberOfHuman] = useState<number>(1)
  const [rentSlotAmount, setRentSlotAmount] = useState<number>(1)
  const [form] = Form.useForm()

  const currentUserId = getUserId()
  const { rooms, loading: roomsLoading } = useChatRooms()
  const { refetch: refetchUnread } = useUnreadCount(currentUserId)

  // ── Provider profile (needed for providerId to fetch services) ────────
  const { provider } = useCurrentProviderProfile()
  console.log("[ProviderMessages] provider:", provider)

  // ── Provider services (for booking modal) ──────────────────────────────
  const { services } = useProviderServices(provider?.id ?? 0)
  console.log("[ProviderMessages] providerId for services:", provider?.id ?? 0)
  console.log("[ProviderMessages] services:", services)

  // ── Booking hook ──────────────────────────────────────────────────────────
  const { createBooking, loading: bookingLoading } = useCreateServiceBooking()

  // ── Message store (single source of truth) ────────────────────────────────
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
    if (activeRoom !== null) setInputValue("")
  }, [activeRoom])

  const handleSelectRoom = (room: ChatRoomListItem) => {
    setActiveRoom(room)
  }

  const handleSend = (content: string) => {
    if (!content.trim() || activeRoom === null || currentUserId === null) return
    sendChatMessage({ roomId: activeRoom.roomId, senderId: currentUserId, content: content.trim() })
    setInputValue("")
  }

  const handleOpenBookingModal = () => {
    setSelectedServiceId(null)
    setBookingDate(null)
    setTimeSlot("09:00")
    setNumberOfHuman(1)
    setRentSlotAmount(1)
    form.resetFields()
    setShowBookingModal(true)
  }

  const handleSubmitBooking = async () => {
    if (!selectedServiceId || !bookingDate || !activeRoom) return

    const result = await createBooking({
      cosplayerId: activeRoom.partnerId,
      serviceId: selectedServiceId,
      bookingDate: bookingDate.format("YYYY-MM-DD"),
      timeSlot,
      numberOfHuman,
      rentSlotAmount,
    })

    if (result) {
      setShowBookingModal(false)
      message.success(VI.booking.create.success)
    }
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

  const canBooking = activeRoom != null && provider != null

  return (
    <DashboardLayout title={VI.provider.sidebar.messages} sidebarItems={sidebarItems} brandName="CosMate Provider" showChatButton={false}>
      <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-slate-200 bg-white">

        {/* LEFT: Conversation List */}
        <div className="flex w-72 shrink-0 flex-col border-r border-slate-100">
          <div className="flex h-14 shrink-0 items-center border-b border-slate-100 px-4">
            <h2 className="text-base font-semibold text-slate-700">{VI.common.messages.title}</h2>
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
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4">
            <div className="flex items-center gap-3">
              {activeRoom ? (
                <>
                  <div className="relative shrink-0">
                    {activeRoom.partnerAvatar ? (
                      <img
                        src={activeRoom.partnerAvatar || undefined}
                        alt={activeRoom.partnerName || VI.common.status.noData}
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
                      {activeRoom.partnerName || VI.common.status.noData}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isConnected ? VI.common.status.online : VI.common.status.offline}
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

            {/* Create Booking button — only shown when a room is active */}
            {canBooking && (
              <button
                type="button"
                onClick={handleOpenBookingModal}
                className="inline-flex items-center gap-1.5 rounded-full bg-pink-400 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-pink-500 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                {VI.booking.create.title}
              </button>
            )}
          </div>

          {/* Message List */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {!activeRoom ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <MessageCircle className="h-12 w-12 text-slate-300" />
                <p className="text-base font-medium">{VI.common.messages.noConversation}</p>
                <p className="text-sm">{VI.common.messages.selectConversation}</p>
              </div>
            ) : isLoadingHistory ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-pink-400" />
                <p className="text-sm font-medium">{VI.common.status.loading}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <MessageCircle className="h-12 w-12 text-slate-300" />
                <p className="text-base font-medium">{VI.common.messages.startConversation}</p>
                <p className="text-sm">{VI.common.messages.sayHello}</p>
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

      {/* Create Booking Modal */}
      <Modal
        open={showBookingModal}
        title={VI.booking.create.title}
        onCancel={() => setShowBookingModal(false)}
        footer={null}
        destroyOnClose
        className="booking-modal"
      >
        <p className="text-sm text-slate-500 mb-4">
          {VI.booking.create.customer}: <strong>{activeRoom?.partnerName}</strong>
        </p>

        <Form
          form={form}
          layout="vertical"
          className="space-y-3"
          onFinish={handleSubmitBooking}
        >
          <Form.Item
            label={VI.booking.create.service}
            name="service"
            rules={[{ required: true, message: VI.booking.create.selectService }]}
          >
            <Select
              placeholder={VI.booking.create.selectService}
              value={selectedServiceId}
              onChange={setSelectedServiceId}
              size="large"
            >
              {services.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  <div className="py-0.5">
                    <div className="font-medium text-slate-800">
                      {s.serviceName || s.description || `${VI.booking.create.service} #${s.id}`}
                    </div>
                    {s.description && s.serviceName && (
                      <div className="text-xs text-slate-400 truncate">{s.description}</div>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              label={VI.booking.create.bookingDate}
              name="bookingDate"
              rules={[{ required: true, message: VI.booking.create.bookingDate }]}
              extra="Không thể đặt lịch cho ngày trong quá khứ"
            >
              <DatePicker
                className="w-full"
                size="large"
                value={bookingDate}
                onChange={(date) => setBookingDate(date)}
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder="Chọn ngày đặt lịch"
              />
            </Form.Item>

            <Form.Item label={VI.booking.create.time} className="mb-0">
              <Input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              label={VI.booking.create.numberOfPeople}
              name="numberOfHuman"
              initialValue={1}
            >
              <InputNumber
                min={1}
                value={numberOfHuman}
                onChange={(val) => setNumberOfHuman(val ?? 1)}
                size="large"
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label={VI.booking.create.price}
              name="rentSlotAmount"
              initialValue={1}
            >
              <InputNumber
                min={1}
                value={rentSlotAmount}
                onChange={(val) => setRentSlotAmount(val ?? 1)}
                size="large"
                className="w-full"
                addonAfter="VNĐ"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="px-5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {VI.booking.create.cancel}
            </button>
            <button
              type="submit"
              disabled={!selectedServiceId || !bookingDate || bookingLoading}
              className="px-5 py-2 rounded-lg bg-pink-400 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {bookingLoading ? VI.booking.create.creating : VI.booking.create.create}
            </button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}
