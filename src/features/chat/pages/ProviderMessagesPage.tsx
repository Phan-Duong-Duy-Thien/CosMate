import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { MessageCircle, Plus } from "lucide-react"
import { Form, Select, DatePicker, InputNumber, message, Input } from "antd"
import type { SearchUserResult } from "../services/user.service"
import dayjs from "dayjs"
import { DashboardLayout } from "@/app/layouts/DashboardLayout"
import { useChatRooms, refreshChatRoomsList } from "../hooks/useChatRooms"
import {
  getOrCreateChatRoomService,
  markRoomAsReadService,
  uploadImageService,
} from "../services/chat.service"
import { useLoadChatHistory } from "../hooks/useLoadChatHistory"
import { useUnreadCount } from "../hooks/useUnreadCount"
import { ChatInboxSidebar } from "../components/ChatInboxSidebar"
import { ChatMessageList } from "../components/ChatMessageList"
import { ChatFooterInput } from "../components/ChatFooterInput"
import { CHAT_UI } from "../constants/chatUi"
import {
  connectChatSocket,
  subscribeChatRoom,
  sendChatMessage,
} from "../services/chatSocket.service"
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from "@/features/provider/constants/sidebar"
import { useLocation } from "react-router-dom"
import { getUserId, getRoles } from "@/features/auth/services/tokenStorage"
import { useChatMessageStore } from "../hooks/useChatMessageStore"
import { useCreateServiceBooking } from "@/features/service/hooks/useCreateServiceBooking"
import { useProviderServices } from "@/features/service/hooks/useProviderServices"
import { ServiceBookingPriceBreakdown } from "@/features/service/components/ServiceBookingPriceBreakdown"
import { useCurrentProviderProfile } from "@/features/provider/hooks/useCurrentProviderProfile"
import { Modal } from "antd"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { DashboardSidebarItem } from "@/app/layouts/DashboardLayout"
import type { ChatRoomListItem, ChatMessage } from "../types"
import { ROLE } from "@/types/auth"

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
  const [isUploading, setIsUploading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | null>(null)
  const [timeSlot, setTimeSlot] = useState("09:00")
  const [numberOfHuman, setNumberOfHuman] = useState<number>(1)
  const [rentSlotAmount, setRentSlotAmount] = useState<number>(0)
  const [form] = Form.useForm()

  const currentUserId = getUserId()
  const { rooms, loading: roomsLoading } = useChatRooms()
  const { refetch: refetchUnread } = useUnreadCount(currentUserId)

  // ── Provider profile (needed for providerId to fetch services) ────────
  const { provider } = useCurrentProviderProfile()

  // ── Provider services (for booking modal) ──────────────────────────────
  const { services } = useProviderServices(provider?.id ?? 0)

  // ── Booking hook ──────────────────────────────────────────────────────────
  const { createBooking, loading: bookingLoading } = useCreateServiceBooking()

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  )

  const handleServiceChange = (serviceId: number) => {
    setSelectedServiceId(serviceId)
    const svc = services.find((s) => s.id === serviceId)
    if (svc) {
      const defaultPrice = svc.pricePerSlot > 0 ? svc.pricePerSlot : 0
      setRentSlotAmount(defaultPrice)
      form.setFieldValue("rentSlotAmount", defaultPrice)
    }
  }

  // ── Message store (single source of truth) ────────────────────────────────
  const activeRoomId = activeRoom?.roomId ?? null
  const {
    messages,
    setMessages,
    mergeServerMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
  } = useChatMessageStore(activeRoomId)
  const isLoadingHistory = useLoadChatHistory(activeRoomId, setMessages)
  const showHistoryLoader = isLoadingHistory && messages.length === 0
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Mark room as read when user opens it
  useEffect(() => {
    if (activeRoom?.roomId == null || currentUserId === null) return
    markRoomAsReadService(activeRoom.roomId, currentUserId).then(refetchUnread)
  }, [activeRoom?.roomId, currentUserId, refetchUnread])

  // Connect socket
  useEffect(() => {
    const release = connectChatSocket(() => setIsConnected(true))
    return () => release()
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

  const handlePickUser = async (user: SearchUserResult) => {
    if (currentUserId === null) {
      message.warning(VI.common.messages.chatNeedLogin)
      throw new Error("not logged in")
    }
    const existingRoom = rooms.find((r) => r.partnerId === user.id)
    if (existingRoom) {
      setActiveRoom(existingRoom)
      return
    }
    try {
      const newRoom = await getOrCreateChatRoomService(currentUserId, user.id)
      refreshChatRoomsList()
      setActiveRoom({
        roomId: newRoom.id,
        partnerId: user.id,
        partnerName: user.fullName,
        partnerAvatar: user.avatarUrl ?? null,
        lastMessageAt: newRoom.lastMessageAt,
      })
    } catch {
      message.error(VI.common.messages.chatStartFailed)
      throw new Error("create room failed")
    }
  }

  const handleSend = (content: string) => {
    if (!content.trim() || activeRoom === null || currentUserId === null) return
    sendChatMessage({ roomId: activeRoom.roomId, senderId: currentUserId, content: content.trim() })
    setInputValue("")
  }

  const handleSendImage = async (file: File) => {
    if (activeRoom?.roomId == null || currentUserId == null) return
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) return

    const objectUrl = URL.createObjectURL(file)
    const tempId = addOptimisticMessage({
      roomId: activeRoom.roomId,
      senderId: currentUserId,
      content: objectUrl,
      messageType: "IMAGE",
      createdAt: new Date().toISOString(),
      isRead: true,
    })

    setIsUploading(true)
    try {
      const url = await uploadImageService(activeRoom.roomId, file)
      URL.revokeObjectURL(objectUrl)
      if (!url) {
        removeOptimisticMessage(tempId)
        return
      }
      sendChatMessage({
        roomId: activeRoom.roomId,
        senderId: currentUserId,
        content: url,
        messageType: "IMAGE",
      })
      removeOptimisticMessage(tempId)
    } catch {
      URL.revokeObjectURL(objectUrl)
      removeOptimisticMessage(tempId)
    } finally {
      setIsUploading(false)
    }
  }

  const resetBookingDraft = useCallback(() => {
    setSelectedServiceId(null)
    setBookingDate(null)
    setTimeSlot("09:00")
    setNumberOfHuman(1)
    setRentSlotAmount(0)
    form.resetFields()
  }, [form])

  const handleOpenBookingModal = () => {
    form.setFieldsValue({
      service: selectedServiceId ?? undefined,
      bookingDate: bookingDate ?? undefined,
      numberOfHuman,
      rentSlotAmount,
    })
    setShowBookingModal(true)
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
  }

  const prevBookingRoomIdRef = useRef<number | null>(null)
  useEffect(() => {
    const roomId = activeRoom?.roomId ?? null
    if (prevBookingRoomIdRef.current !== null && prevBookingRoomIdRef.current !== roomId) {
      resetBookingDraft()
      setShowBookingModal(false)
    }
    prevBookingRoomIdRef.current = roomId
  }, [activeRoom?.roomId, resetBookingDraft])

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
      resetBookingDraft()
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
  const roles = getRoles()
  const canCreateBooking = canBooking && !roles.includes(ROLE.PROVIDER_RENTAL)

  return (
    <DashboardLayout
      title={VI.provider.sidebar.messages}
      sidebarItems={sidebarItems}
      brandName="CosMate Provider"
      showChatButton={false}
      contentMode="fill"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className={CHAT_UI.providerDashboardShell}>
        <ChatInboxSidebar
          variant="comfortable"
          theme="provider"
          headerStart={<h2 className="text-base font-semibold text-slate-700">{VI.common.messages.title}</h2>}
          rooms={rooms}
          roomsLoading={roomsLoading}
          activeRoomId={activeRoom?.roomId ?? null}
          onSelectRoom={handleSelectRoom}
          currentUserId={currentUserId}
          onPickUser={handlePickUser}
        />

        {/* RIGHT: Chat Window */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 pt-3.5 pb-3">
            <div className="flex items-start gap-3">
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-100 to-violet-200 text-xs font-semibold text-violet-600 shadow-sm ring-2 ring-white">
                        {(activeRoom.partnerName || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                      isConnected ? "bg-green-400" : "bg-slate-300"
                    )} />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <p className="truncate text-sm font-semibold leading-tight text-slate-800">
                      {activeRoom.partnerName || VI.common.status.noData}
                    </p>
                    <p className="truncate text-xs leading-none text-slate-400">
                      {isConnected ? VI.common.status.online : VI.common.status.offline}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="flex flex-col gap-0.5">
                    <div className="h-3.5 w-24 rounded bg-slate-100" />
                    <div className="h-2.5 w-16 rounded bg-slate-100" />
                  </div>
                </>
              )}
            </div>

            {/* Create Booking button — only shown when a room is active */}
            {canCreateBooking && (
              <button
                type="button"
                onClick={handleOpenBookingModal}
                className="inline-flex items-center gap-1.5 rounded-full bg-cosmate-pink px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cosmate-pink/90 disabled:opacity-50"
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
            ) : showHistoryLoader ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
                <p className="text-sm font-medium">{VI.common.status.loading}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                <MessageCircle className="h-12 w-12 text-slate-300" />
                <p className="text-base font-medium">{VI.common.messages.startConversation}</p>
                <p className="text-sm">{VI.common.messages.sayHello}</p>
              </div>
            ) : (
              <ChatMessageList messages={messages} currentUserId={currentUserId} theme="provider" />
            )}
          </div>

          {/* Footer */}
          {activeRoom && (
            <ChatFooterInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              onSendImage={handleSendImage}
              isUploading={isUploading}
              disabled={!isConnected}
              theme="provider"
            />
          )}
        </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <Modal
        open={showBookingModal}
        title={VI.booking.create.title}
        onCancel={handleCloseBookingModal}
        footer={null}
        destroyOnClose={false}
        maskClosable
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
              onChange={handleServiceChange}
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

          {selectedService && (selectedService.depositAmount ?? 0) + (selectedService.equipmentDepreciationCost ?? 0) > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <p className="font-medium text-slate-700">{VI.booking.create.packageFeesTitle}</p>
              <ul className="mt-1 space-y-0.5 text-slate-600">
                {(selectedService.depositAmount ?? 0) > 0 && (
                  <li>
                    {VI.booking.create.priceBreakdownDeposit}:{" "}
                    <span className="font-medium text-slate-800">
                      {(selectedService.depositAmount ?? 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </li>
                )}
                {(selectedService.equipmentDepreciationCost ?? 0) > 0 && (
                  <li>
                    {VI.booking.create.priceBreakdownEquipment}:{" "}
                    <span className="font-medium text-slate-800">
                      {selectedService.equipmentDepreciationCost.toLocaleString("vi-VN")} ₫
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              label={VI.booking.create.bookingDate}
              name="bookingDate"
              rules={[{ required: true, message: VI.booking.create.bookingDate }]}
              
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
              className="w-full max-w-[200px]"
            />
          </Form.Item>

          <Form.Item
            label={VI.booking.create.price}
            name="rentSlotAmount"
            initialValue={0}
            extra={VI.booking.create.priceHint}
            rules={[{ required: true, message: VI.booking.create.price }]}
          >
            <InputNumber
              min={0}
              value={rentSlotAmount}
              onChange={(val) => setRentSlotAmount(val ?? 0)}
              size="large"
              className="w-full"
              addonAfter="VNĐ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => Number((value ?? "").replace(/,/g, "")) || 0}
            />
          </Form.Item>

          {selectedService && (
            <ServiceBookingPriceBreakdown
              rentSlotAmount={rentSlotAmount}
              depositAmount={selectedService.depositAmount}
              equipmentDepreciationCost={selectedService.equipmentDepreciationCost}
              showHint={rentSlotAmount <= 0}
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCloseBookingModal}
              className="px-5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {VI.booking.create.cancel}
            </button>
            <button
              type="submit"
              disabled={
                !selectedServiceId ||
                !bookingDate ||
                rentSlotAmount <= 0 ||
                bookingLoading
              }
              className="px-5 py-2 rounded-lg bg-cosmate-pink text-sm font-semibold text-white hover:bg-cosmate-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {bookingLoading ? VI.booking.create.creating : VI.booking.create.create}
            </button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}
