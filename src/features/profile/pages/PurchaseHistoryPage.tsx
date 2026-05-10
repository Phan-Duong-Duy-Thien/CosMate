import { useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { message, Tooltip, Modal } from "antd"
import { MessageOutlined } from "@ant-design/icons"
import { VI } from "@/shared/i18n/vi"
import { usePurchaseOrders, type OrderTab } from "../hooks/usePurchaseOrders"
import { useServiceOrders, type ServiceOrderTab } from "../hooks/useServiceOrders"
import { ConfirmDeliveryModal } from "@/features/order/components/ConfirmDeliveryModal"
import { ReturnOrderModal } from "@/features/order/components/ReturnOrderModal"
import { OrderDetailDrawer } from "@/features/order/components/OrderDetailDrawer"
import { ReviewModal } from "@/features/order/components/ReviewModal"
import { CreateDisputeModal } from "@/features/order/components/CreateDisputeModal"
import { ExtendRentalModal } from "@/features/order/components/ExtendRentalModal"
import { useCreateReview } from "@/features/costume-rental/hooks/useCreateReview"
import { getReviewByOrderId, type ReviewItem } from "@/features/costume-rental/api/review.api"
import { useCreateDispute } from "@/features/order/hooks/useCreateDispute"
import { useCancelOrder } from "@/features/order/hooks/useCancelOrder"
import { useExtendOrder } from "@/features/order/hooks/useExtendOrder"
import { ServicePaymentModal } from "@/features/service/components/ServicePaymentModal"
import type { PaymentMethod } from "@/features/order/utils/paymentReturnUrls"
import {
  PackageCheck, Package, PackageOpen, Clock, Truck, CheckCircle, XCircle, Star, Flag, Eye, RotateCcw,
  CalendarClock, WalletCards, AlertCircle, Ban
} from "lucide-react"
import type { ServiceOrder } from "@/features/service/api/booking.api"

// ─── Parent Tab ────────────────────────────────────────────────────────────────

type ParentTab = 'costume' | 'service'

const PARENT_TAB_LABELS: Record<ParentTab, string> = {
  costume: VI.profile.serviceOrders.tabCostume,
  service: VI.profile.serviceOrders.tabService,
}

const PARENT_TAB_ICONS: Record<ParentTab, React.ElementType> = {
  costume: PackageCheck,
  service: CalendarClock,
}

// ─── Costume Order Filter Tabs ────────────────────────────────────────────────

const TAB_LABELS: Record<OrderTab, string> = {
  all: VI.profile.orders.tabAll,
  wait_confirm: VI.profile.orders.tabWaitConfirm,
  wait_shipping: VI.profile.orders.tabWaitShipping,
  shipping_out: VI.profile.orders.tabShippingOut,
  delivering_out: VI.profile.orders.tabDeliveringOut,
  in_use: VI.profile.orders.tabInUse,
  shipping_back: VI.profile.orders.tabShippingBack,
  completed: VI.profile.orders.tabCompleted,
  cancelled: VI.profile.orders.tabCancelled,
}

const TAB_ICONS: Record<OrderTab, React.ElementType> = {
  all: PackageCheck,
  wait_confirm: Clock,
  wait_shipping: Package,
  shipping_out: Truck,
  delivering_out: PackageOpen,
  in_use: Eye,
  shipping_back: RotateCcw,
  completed: CheckCircle,
  cancelled: XCircle,
}

// ─── Service Order Filter Tabs ─────────────────────────────────────────────────

const SERVICE_TAB_LABELS: Record<ServiceOrderTab, string> = {
  all: VI.profile.orders.tabAll,
  UNCONFIRM: VI.profile.serviceOrders.statusUnconfirm,
  UNPAID: VI.profile.serviceOrders.statusUnpaid,
  PAID: VI.profile.serviceOrders.statusPaid,
  WAITING_SERVICE_DATE: VI.profile.serviceOrders.statusWaitingServiceDate,
  IN_SERVICE: VI.profile.serviceOrders.statusInService,
  COMPLETED: VI.profile.serviceOrders.statusCompleted,
  DISPUTE: VI.profile.serviceOrders.statusDispute,
  CANCELLED: VI.profile.serviceOrders.statusCancelled,
}

const SERVICE_TAB_ICONS: Record<ServiceOrderTab, React.ElementType> = {
  all: PackageCheck,
  UNCONFIRM: Clock,
  UNPAID: WalletCards,
  PAID: CheckCircle,
  WAITING_SERVICE_DATE: CalendarClock,
  IN_SERVICE: Truck,
  COMPLETED: CheckCircle,
  DISPUTE: Flag,
  CANCELLED: Ban,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Format date safely
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN');
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PurchaseHistoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // ── Parent tab state ──────────────────────────────────────────────────────
  const parentParam = searchParams.get("parent") as ParentTab | null
  const parentTab: ParentTab = parentParam && parentParam in PARENT_TAB_LABELS ? parentParam : 'costume'

  // ── Costume tab state ──────────────────────────────────────────────────────
  const tabParam = searchParams.get("tab") as OrderTab | null
  const costumeTab: OrderTab = tabParam && tabParam in TAB_LABELS ? tabParam : "all"

  // ── Hook calls ──────────────────────────────────────────────────────────────
  const {
    filteredOrders,
    counts,
    loading: costumeLoading,
    error: costumeError,
    confirmDelivery,
    confirmingDeliveryId,
    returnOrder,
    returningOrderId,
    refetch: costumeRefetch,
    costumeImageMap,
    page: costumePage,
    setPage: setCostumePage,
    pageSize: costumePageSize,
    total: costumeTotal,
  } = usePurchaseOrders(parentTab === 'costume' ? costumeTab : 'all')

  const {
    filteredOrders: serviceFilteredOrders,
    counts: serviceCounts,
    loading: serviceLoading,
    error: serviceError,
    refetch: serviceRefetch,
    selectedStatus,
    setStatus,
    confirmingOrderId,
    confirmAndPay,
    payingOrderId,
    payOnly,
    page: servicePage,
    setPage: setServicePage,
    pageSize: servicePageSize,
    total: serviceTotal,
  } = useServiceOrders()

  // ── Review modal state ─────────────────────────────────────────────────────
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewOrderId, setReviewOrderId] = useState<number | null>(null)
  const [reviewCosplayerId, setReviewCosplayerId] = useState<number | null>(null)
  const [existingReview, setExistingReview] = useState<ReviewItem | null>(null)

  const { submit: submitReview, loading: reviewingOrderId } = useCreateReview()
  const { createDispute, disputingOrderId } = useCreateDispute()
  const { cancelOrder, cancellingOrderId } = useCancelOrder()
  const { extendOrder, isExtending, getDetailIdFromOrder } = useExtendOrder()

  // ── Extend modal state ───────────────────────────────────────────────────────
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [extendOrderId, setExtendOrderId] = useState<number | null>(null)

  // ── Cancel modal state ───────────────────────────────────────────────────────
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null)

  // ── Confirm delivery modal state ────────────────────────────────────────────
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  // ── Return order modal state ─────────────────────────────────────────────────
  const [returnModalOpen, setReturnModalOpen] = useState(false)
  const [returnOrderId, setReturnOrderId] = useState<number | null>(null)

  // ── Detail drawer state ─────────────────────────────────────────────────────
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null)
  // Cross-type contamination guard: track which order type is being viewed
  const [detailOrderType, setDetailOrderType] = useState<string>('RENT_COSTUME')
  const [serviceDetailModalOpen, setServiceDetailModalOpen] = useState(false)
  const [serviceDetailOrder, setServiceDetailOrder] = useState<ServiceOrder | null>(null)

  // ── Payment modal state ──────────────────────────────────────────────────────
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentOrderId, setPaymentOrderId] = useState<number | null>(null)
  const [paymentModalAction, setPaymentModalAction] = useState<'confirm-pay' | 'pay-only'>('confirm-pay')

  // ── Dispute modal state ──────────────────────────────────────────────────────
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [disputeOrderId, setDisputeOrderId] = useState<number | null>(null)

  // ── Navigation helpers ────────────────────────────────────────────────────────
  const handleParentTabClick = (newTab: ParentTab) => {
    if (newTab === 'costume') {
      navigate(`/profile/purchase-history?parent=${newTab}&tab=${costumeTab}`)
    } else {
      navigate(`/profile/purchase-history?parent=${newTab}`)
    }
  }

  const currentFilterLabel = useMemo(() => {
    if (parentTab === 'service') return SERVICE_TAB_LABELS[selectedStatus]
    return TAB_LABELS[costumeTab]
  }, [parentTab, costumeTab, selectedStatus])

  const handleTabClick = (newTab: OrderTab) => {
    navigate(`/profile/purchase-history?parent=${parentTab}&tab=${newTab}`)
  }

  // ── Service payment handlers ─────────────────────────────────────────────────
  const handleOpenPaymentModal = (orderId: number, action: 'confirm-pay' | 'pay-only') => {
    setPaymentOrderId(orderId)
    setPaymentModalAction(action)
    setPaymentModalOpen(true)
  }

  const handlePaymentConfirm = async (paymentMethod: PaymentMethod) => {
    if (!paymentOrderId) return

    try {
      let paymentUrl: string | null = null
      if (paymentModalAction === 'confirm-pay') {
        paymentUrl = await confirmAndPay(paymentOrderId, paymentMethod)
      } else {
        paymentUrl = await payOnly(paymentOrderId, paymentMethod)
      }
      setPaymentModalOpen(false)
      if (paymentUrl) {
        message.info(VI.profile.serviceOrders.toastPaySuccess)
        window.location.href = paymentUrl
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : VI.profile.serviceOrders.toastPayFailed
      message.error(msg)
      // Keep modal open on error
    }
  }

  // ── Costume order handlers ───────────────────────────────────────────────────
  const handleConfirmDelivery = (orderId: number) => {
    setSelectedOrderId(orderId)
    setConfirmModalOpen(true)
  }

  const handleConfirmSubmit = async (data: { images: File[]; notes: string[] }) => {
    if (!selectedOrderId) return
    const success = await confirmDelivery(selectedOrderId, data.images, data.notes)
    if (success) {
      message.success(VI.profile.orders.toastConfirmDeliverySuccess)
      setConfirmModalOpen(false)
      setSelectedOrderId(null)
    } else {
      message.error(VI.profile.orders.toastConfirmDeliveryFailed)
    }
  }

  const handleReturnOrder = (orderId: number) => {
    setReturnOrderId(orderId)
    setReturnModalOpen(true)
  }

  const handleReturnSubmit = async (data: { trackingCode: string; images: File[]; notes: string[] }) => {
    if (!returnOrderId) return
    const success = await returnOrder(returnOrderId, data.trackingCode, data.images, data.notes)
    if (success) {
      message.success(VI.profile.orders.toastReturnSuccess)
      setReturnModalOpen(false)
      setReturnOrderId(null)
    } else {
      message.error(VI.profile.orders.toastReturnFailed)
    }
  }

  const handleCreateDispute = (orderId: number, status: string) => {
    if (status !== 'DELIVERING_OUT') {
      return
    }
    setDisputeOrderId(orderId)
    setDisputeModalOpen(true)
  }

  const handleDisputeSubmit = async (payload: { reason: string; files: File[] }) => {
    if (!disputeOrderId) return
    const success = await createDispute(disputeOrderId, payload)
    if (success) {
      message.success(VI.profile.orders.toastDisputeSuccess)
      setDisputeModalOpen(false)
      setDisputeOrderId(null)
      costumeRefetch()
    } else {
      message.error(VI.profile.orders.toastDisputeFailed)
    }
  }

  const handleCancelOrder = (orderId: number) => {
    setCancelOrderId(orderId)
    setCancelModalOpen(true)
  }

  const handleCancelSubmit = async () => {
    if (!cancelOrderId) return
    const success = await cancelOrder(cancelOrderId)
    if (success) {
      message.success(VI.profile.orders.toastCancelSuccess)
      setCancelModalOpen(false)
      setCancelOrderId(null)
      costumeRefetch()
    } else {
      message.error(VI.profile.orders.toastCancelFailed)
    }
  }

  const handleReviewOrder = async (orderId: number, cosplayerId: number) => {
    const found = await getReviewByOrderId(orderId)
    setExistingReview(found)
    setReviewOrderId(orderId)
    setReviewCosplayerId(cosplayerId)
    setReviewModalOpen(true)
  }

  const handleReviewSubmit = async (data: { rating: number; comment: string; images: File[] }) => {
    if (!reviewOrderId || !reviewCosplayerId) return
    const success = await submitReview({
      cosplayerId: reviewCosplayerId,
      orderId: reviewOrderId,
      rating: data.rating,
      comment: data.comment,
      images: data.images,
    })
    if (success) {
      message.success(VI.profile.orders.toastReviewSuccess)
      setReviewModalOpen(false)
      setReviewOrderId(null)
      setReviewCosplayerId(null)
      setExistingReview(null)
      costumeRefetch()
      void serviceRefetch()
    } else {
      message.error(VI.profile.orders.toastReviewFailed)
    }
  }

  // ── Costume order card renderer ─────────────────────────────────────────────
  const renderOrderItem = (order: (typeof filteredOrders)[number]) => {
    const statusLabel = {
      UNPAID: VI.profile.orders.statusUnpaid,
      PAID: VI.profile.orders.tabWaitConfirm,
      PREPARING: VI.profile.orders.tabWaitShipping,
      SHIPPING_OUT: VI.profile.orders.statusShippingOut,
      DELIVERING_OUT: VI.profile.orders.statusDeliveringOut,
      DELIVERY_OUT: VI.profile.orders.statusDeliveryOut,
      IN_USE: VI.profile.orders.tabInUse,
      SHIPPING_BACK: VI.profile.orders.statusShippingBack,
      RETURNED: VI.profile.orders.tabCompleted,
      COMPLETED: VI.profile.orders.tabCompleted,
      CANCELLED: VI.profile.orders.tabCancelled,
      DISPUTE: VI.profile.orders.tabDispute,
    }[order.status] || order.status

    const statusBadgeColor: Record<string, string> = {
      UNPAID: "bg-cosmate-soft-pink text-cosmate-pink",
      PAID: "bg-cosmate-lavender-surface text-cosmate-pink",
      PREPARING: "bg-cosmate-soft-pink/80 text-cosmate-rose-tag-text",
      SHIPPING_OUT: "bg-cosmate-lavender-surface-alt text-cosmate-ink",
      DELIVERING_OUT: "bg-cosmate-lavender-surface-alt text-cosmate-ink",
      DELIVERY_OUT: "bg-cosmate-lavender-surface-alt text-cosmate-ink",
      IN_USE: "bg-cosmate-soft-pink text-cosmate-mauve",
      SHIPPING_BACK: "bg-cosmate-soft-pink/90 text-cosmate-pink",
      RETURNED: "bg-cosmate-rose-tag-bg text-cosmate-rose-tag-text",
      COMPLETED: "bg-cosmate-rose-tag-bg text-cosmate-rose-tag-text",
      CANCELLED: "bg-muted text-muted-foreground",
      DISPUTE: "bg-destructive/10 text-destructive",
    }
    const badgeColorClass = statusBadgeColor[order.status] || "bg-cosmate-soft-pink text-cosmate-pink"

    const isUnpaid = order.status === 'UNPAID'
    const isDeliveringOut = order.status === 'DELIVERING_OUT'
    const isInUse = order.status === 'IN_USE'
    const isCancellable = order.status === 'UNPAID' || order.status === 'PAID'

    console.log('[ORDER ACTION]', order.id, order.status)
    const isCompleted = order.status === 'RETURNED' || order.status === 'COMPLETED'

    const orderCode = `${VI.profile.orders.orderCodePrefix}-${String(order.id).padStart(4, '0')}`

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md hover:border-cosmate-pink/25"
      >
        {/* Left: Thumbnail */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          {costumeImageMap[order.costumeId] ? (
            <img
              src={costumeImageMap[order.costumeId]}
              alt={order.costumeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <PackageCheck className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Middle: Info */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top row: order code + status badge */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {order.costumeName || VI.profile.orders.cardCostumeName}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                {VI.profile.orders.orderTitle} {orderCode}
              </p>
            </div>
            <span className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColorClass}`}>
              {statusLabel}
            </span>
          </div>

          {/* Middle row: rental period + item count */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              {VI.profile.orders.cardRentPeriod}: {formatDate(order.rentStart) || '-'} - {formatDate(order.rentEnd) || '-'}
            </span>
            {order.rentDay > 0 && (
              <span>
                {order.rentDay} {VI.profile.orders.cardDayCount}
              </span>
            )}
          </div>

          {/* Bottom row: CTA buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDetailOrderType('RENT_COSTUME')
                setDetailOrderId(order.id)
                setDetailDrawerOpen(true)
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-cosmate-soft-pink/40 hover:border-cosmate-pink/30"
            >
              {VI.order.actions.viewDetail}
            </button>

            {/* UNPAID: cancel */}
            {isCancellable && (
              <button
                type="button"
                onClick={() => handleCancelOrder(order.id)}
                disabled={cancellingOrderId === order.id}
                className="flex items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              >
                <Ban className="h-3.5 w-3.5" />
                {cancellingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionCancel}
              </button>
            )}

            {/* DELIVERING_OUT: receive + dispute */}
            {isDeliveringOut && (
              <>
                <button
                  type="button"
                  onClick={() => handleConfirmDelivery(order.id)}
                  disabled={confirmingDeliveryId === order.id}
                  className="rounded-lg bg-cosmate-pink px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-cosmate-pink/90 disabled:opacity-50"
                >
                  {confirmingDeliveryId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionConfirmDelivery}
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateDispute(order.id, order.status)}
                  disabled={disputingOrderId === order.id}
                  className="flex items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                >
                  <Flag className="h-3.5 w-3.5" />
                  {disputingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.dispute.button}
                </button>
              </>
            )}

            {isInUse && (
              <>
                <button
                  type="button"
                  onClick={() => handleReturnOrder(order.id)}
                  disabled={returningOrderId === order.id}
                  className="rounded-lg border border-cosmate-pink bg-cosmate-soft-pink/40 px-3 py-1.5 text-sm font-medium text-cosmate-pink transition-colors hover:bg-cosmate-soft-pink disabled:opacity-50"
                >
                  {returningOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionReturn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExtendOrderId(order.id)
                    setExtendModalOpen(true)
                  }}
                  disabled={isExtending}
                  className="flex items-center gap-1 rounded-lg border border-cosmate-pink/40 bg-cosmate-soft-pink/50 px-3 py-1.5 text-sm font-medium text-cosmate-pink transition-colors hover:bg-cosmate-soft-pink disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {VI.provider.orders.tabs.extending}
                </button>
              </>
            )}
            {isCompleted && (
              <button
                type="button"
                onClick={() => handleReviewOrder(order.id, order.cosplayerId)}
                disabled={reviewingOrderId === order.id}
                className="flex items-center gap-1 rounded-lg bg-cosmate-pink px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-cosmate-pink/90 disabled:opacity-50"
              >
                <Star className="h-3.5 w-3.5" />
                {reviewingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionReview}
              </button>
            )}
          </div>
        </div>

        {/* Right: Total amount + Chat */}
        <div className="flex flex-col items-end justify-between text-right">
          <span className="text-base font-bold text-cosmate-pink">
            {order.totalAmount.toLocaleString('vi-VN')} ₫
          </span>
          {order.cosplayerId && (
            <Tooltip title={VI.profile.serviceOrders.chatTooltip}>
              <button
                type="button"
                onClick={() => navigate(`/messages?target=${order.cosplayerId}`)}
                className="mt-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-cosmate-soft-pink/50 hover:text-cosmate-pink"
              >
                <MessageOutlined className="text-lg" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  // ── Service order card renderer ─────────────────────────────────────────────
  const renderServiceOrderItem = (order: ServiceOrder) => {
    const statusLabel = SERVICE_TAB_LABELS[order.status as ServiceOrderTab] || order.status
    const orderCode = `${VI.profile.serviceOrders.orderCodePrefix}-${String(order.id).padStart(4, '0')}`
    const statusBadgeColor: Record<string, string> = {
      UNCONFIRM: "bg-cosmate-soft-pink text-cosmate-pink",
      UNPAID: "bg-cosmate-soft-pink text-cosmate-pink",
      PAID: "bg-cosmate-lavender-surface text-cosmate-pink",
      WAITING_SERVICE_DATE: "bg-cosmate-lavender-surface-alt text-cosmate-ink",
      IN_SERVICE: "bg-cosmate-soft-pink/80 text-cosmate-mauve",
      COMPLETED: "bg-cosmate-rose-tag-bg text-cosmate-rose-tag-text",
      DISPUTE: "bg-destructive/10 text-destructive",
      CANCELLED: "bg-muted text-muted-foreground",
    }
    const badgeColorClass = statusBadgeColor[order.status] || "bg-cosmate-soft-pink text-cosmate-pink"
    const isUnconfirm = order.status === 'UNCONFIRM'
    const isUnpaid = order.status === 'UNPAID'
    const isConfirmProcessing = confirmingOrderId === order.id
    const isPayProcessing = payingOrderId === order.id
    const isServiceCompleted = order.status === 'COMPLETED'

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md hover:border-cosmate-pink/25"
      >
        {/* Left: Icon */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-cosmate-soft-pink/35 flex items-center justify-center">
          <CalendarClock className="h-10 w-10 text-cosmate-pink" />
        </div>

        {/* Middle: Info */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top row: order code + status badge */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {VI.profile.serviceOrders.orderTitle}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                {orderCode}
              </p>
            </div>
            <span className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColorClass}`}>
              {statusLabel}
            </span>
          </div>

          {/* Middle row: booking details */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              {order.bookings.length} {order.bookings.length === 1 ? VI.profile.serviceOrders.cardBookings : VI.profile.serviceOrders.cardBookingsCount}
            </span>
            <span>{formatDate(order.createdAt)}</span>
          </div>

          {/* Bottom row: bookings summary */}
          <div className="mt-2 flex flex-col gap-1">
            {order.bookings.slice(0, 2).map((booking) => (
              <div key={booking.id} className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-foreground">
                  {formatDate(booking.bookingDate)}
                </span>
                <span>{booking.timeSlot}</span>
                <span>{booking.numberOfHuman} {VI.profile.serviceOrders.cardPeopleCount}</span>
                <span>{booking.rentSlotAmount} {VI.profile.serviceOrders.cardSlotAmount}</span>
              </div>
            ))}
            {order.bookings.length > 2 && (
              <span className="text-xs text-muted-foreground">+{order.bookings.length - 2} {VI.profile.serviceOrders.cardMoreBookings}</span>
            )}
          </div>

          {/* Bottom row: CTA buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setServiceDetailOrder(order)
                setServiceDetailModalOpen(true)
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-cosmate-soft-pink/40 hover:border-cosmate-pink/30"
            >
              {VI.order.actions.viewDetail}
            </button>

            {(isUnconfirm || isUnpaid) && (
              <button
                type="button"
                disabled={isConfirmProcessing || isPayProcessing}
                onClick={() => {
                  if (isConfirmProcessing || isPayProcessing) return
                  handleOpenPaymentModal(order.id, isUnconfirm ? 'confirm-pay' : 'pay-only')
                }}
                className="rounded-lg bg-cosmate-pink px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-cosmate-pink/90 disabled:opacity-50"
              >
                {isConfirmProcessing || isPayProcessing
                  ? VI.profile.serviceOrders.btnProcessing
                  : isUnconfirm
                    ? VI.profile.serviceOrders.btnConfirmAndPay
                    : VI.profile.serviceOrders.btnPayNow}
              </button>
            )}

            {isServiceCompleted && order.cosplayerId != null && (
              <button
                type="button"
                onClick={() => handleReviewOrder(order.id, order.cosplayerId)}
                className="flex items-center gap-1 rounded-lg bg-cosmate-pink px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-cosmate-pink/90"
              >
                <Star className="h-3.5 w-3.5" />
                {VI.profile.orders.actionReview}
              </button>
            )}
          </div>
        </div>

        {/* Right: Total amount + Chat */}
        <div className="flex flex-col items-end justify-between text-right">
          <span className="text-base font-bold text-cosmate-pink">
            {order.totalAmount.toLocaleString('vi-VN')} ₫
          </span>
          {order.providerId && (
            <Tooltip title={VI.profile.serviceOrders.chatTooltip}>
              <button
                type="button"
                onClick={() => navigate(`/messages?target=${order.providerId}`)}
                className="mt-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-cosmate-soft-pink/50 hover:text-cosmate-pink"
              >
                <MessageOutlined className="text-lg" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  // ── Status filter renderer (reused for both tabs) ───────────────────────────
  const renderStatusFilter = (
    activeTab: OrderTab | ServiceOrderTab,
    tabLabels: Record<string, string>,
    tabIcons: Record<string, React.ElementType>,
    countsObj: Record<string, number>,
    onTabClick: (tab: string) => void
  ) => (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {(Object.keys(tabLabels) as (OrderTab | ServiceOrderTab)[]).map((tabKey) => {
        const Icon = tabIcons[tabKey]
        const isActive = activeTab === tabKey
        const count = countsObj[tabKey] ?? 0
        return (
          <Tooltip key={tabKey} title={tabLabels[tabKey]} placement="top">
            <button
              type="button"
              onClick={() => onTabClick(tabKey)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "bg-cosmate-pink text-primary-foreground shadow-sm ring-2 ring-cosmate-pink/30"
                  : "bg-muted text-muted-foreground hover:bg-cosmate-soft-pink/60 hover:text-cosmate-pink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {count > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                    isActive ? "bg-primary-foreground text-cosmate-pink" : "bg-cosmate-pink text-primary-foreground"
                  }`}
                >
                  {count > 99 ? VI.common.status.countOverflow : count}
                </span>
              )}
            </button>
          </Tooltip>
        )
      })}
    </div>
  )

  // ── Pagination helper ────────────────────────────────────────────────────────
  const renderPagination = (
    currentPage: number,
    pageSize: number,
    total: number,
    onPageChange: (page: number) => void,
    label: string
  ) => {
    const totalPages = Math.ceil(total / pageSize)
    if (totalPages <= 1) return null

    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return (
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {label} {VI.profile.orders.paginationShow}{" "}
          <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)}</span>{" "}
          {VI.profile.orders.paginationOf} <span className="font-medium text-foreground">{total}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm transition-colors hover:bg-cosmate-soft-pink/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg border text-sm transition-colors ${
                  p === currentPage
                    ? "border-cosmate-pink bg-cosmate-pink text-primary-foreground shadow-sm"
                    : "border-border text-foreground hover:bg-cosmate-soft-pink/40"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm transition-colors hover:bg-cosmate-soft-pink/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    )
  }

  // ── Content renderer ─────────────────────────────────────────────────────────
  const renderContent = (
    isLoading: boolean,
    hasError: boolean,
    isEmpty: boolean,
    emptyLabel: string,
    loadErrorLabel: string,
    renderItem: (item: any) => React.ReactNode,
    items: any[]
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cosmate-pink border-t-transparent" />
          <span className="ml-2 text-muted-foreground">{VI.common.status.loading}</span>
        </div>
      )
    }
    if (hasError) {
      return (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
          {loadErrorLabel}
        </p>
      )
    }
    if (isEmpty) {
      return (
        <div className="rounded-xl border border-border bg-muted/50 px-4 py-8 text-center">
          <PackageCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>
        </div>
      )
    }
    return <div className="space-y-3">{items.map(renderItem)}</div>
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-cosmate-soft-pink/35 via-wallet-via to-background px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border-cosmate-lavender-border shadow-md">
          <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-foreground">{VI.profile.serviceOrders.title}</h1>

          {/* ── Parent Tab Navigation ──────────────────────────────────────── */}
          <div className="mt-4 flex gap-2">
            {(Object.keys(PARENT_TAB_LABELS) as ParentTab[]).map((tabKey) => {
              const Icon = PARENT_TAB_ICONS[tabKey]
              const isActive = parentTab === tabKey
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => handleParentTabClick(tabKey)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cosmate-pink text-primary-foreground shadow-sm ring-2 ring-cosmate-pink/25"
                      : "bg-muted text-muted-foreground hover:bg-cosmate-soft-pink/50 hover:text-cosmate-pink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {PARENT_TAB_LABELS[tabKey]}
                </button>
              )
            })}
          </div>

          {/* ── Costume Orders Content ──────────────────────────────────────── */}
          {parentTab === 'costume' && (
            <>
              {/* Status filter */}
              {renderStatusFilter(
                costumeTab,
                TAB_LABELS,
                TAB_ICONS,
                counts,
                handleTabClick
              )}

              {/* Current filter info */}
              {costumeTab !== "all" && (
                <div className="mt-4 rounded-xl border border-cosmate-lavender-border bg-cosmate-soft-pink/25 px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">{VI.profile.orders.filterLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{currentFilterLabel}</p>
                </div>
              )}

              {/* Content */}
              <div className="mt-6">
                {renderContent(
                  costumeLoading,
                  !!costumeError,
                  filteredOrders.length === 0,
                  VI.profile.orders.empty,
                  VI.profile.orders.loadError,
                  renderOrderItem,
                  filteredOrders
                )}
              </div>

              {/* Pagination */}
              {renderPagination(
                costumePage,
                costumePageSize,
                costumeTotal,
                setCostumePage,
                VI.profile.orders.paginationCostume
              )}
            </>
          )}

          {/* ── Service Orders Content ──────────────────────────────────────── */}
          {parentTab === 'service' && (
            <>
              {/* Status filter */}
              {renderStatusFilter(
                selectedStatus,
                SERVICE_TAB_LABELS,
                SERVICE_TAB_ICONS,
                serviceCounts,
                (tab) => setStatus(tab as ServiceOrderTab)
              )}

              {/* Current filter info */}
              {selectedStatus !== 'all' && (
                <div className="mt-4 rounded-xl border border-cosmate-lavender-border bg-cosmate-soft-pink/25 px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">{VI.profile.serviceOrders.filterLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{currentFilterLabel}</p>
                </div>
              )}

              {/* Content */}
              <div className="mt-6">
                {renderContent(
                  serviceLoading,
                  !!serviceError,
                  serviceFilteredOrders.length === 0,
                  VI.profile.serviceOrders.empty,
                  VI.profile.serviceOrders.loadError,
                  renderServiceOrderItem,
                  serviceFilteredOrders
                )}
              </div>

              {/* Pagination */}
              {renderPagination(
                servicePage,
                servicePageSize,
                serviceTotal,
                setServicePage,
                VI.profile.serviceOrders.paginationService
              )}
            </>
          )}
        </CardContent>
        </Card>
      </div>

      {/* ── Modals (only for costume orders) ─────────────────────────────── */}
      <ConfirmDeliveryModal
        open={confirmModalOpen}
        orderId={selectedOrderId || 0}
        loading={!!confirmingDeliveryId}
        onCancel={() => {
          setConfirmModalOpen(false)
          setSelectedOrderId(null)
        }}
        onSubmit={handleConfirmSubmit}
      />

      <ReturnOrderModal
        open={returnModalOpen}
        orderId={returnOrderId || 0}
        loading={!!returningOrderId}
        onCancel={() => {
          setReturnModalOpen(false)
          setReturnOrderId(null)
        }}
        onSubmit={handleReturnSubmit}
      />

      <OrderDetailDrawer
        open={detailDrawerOpen}
        orderId={detailOrderId}
        orderType={detailOrderType}
        onClose={() => {
          setDetailDrawerOpen(false)
          setDetailOrderId(null)
        }}
      />

      <Modal
        open={serviceDetailModalOpen}
        title={VI.profile.serviceOrders.orderTitle}
        onCancel={() => {
          setServiceDetailModalOpen(false)
          setServiceDetailOrder(null)
        }}
        footer={null}
        width={720}
      >
        {serviceDetailOrder && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-2">
                <p>
                  <span className="font-medium text-foreground">{VI.profile.serviceOrders.orderCodePrefix}:</span>{" "}
                  {String(serviceDetailOrder.id).padStart(4, '0')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{VI.profile.orders.cardTotal}:</span>{" "}
                  {serviceDetailOrder.totalAmount.toLocaleString('vi-VN')} ₫
                </p>
                <p>
                  <span className="font-medium text-foreground">Trạng thái:</span>{" "}
                  {SERVICE_TAB_LABELS[serviceDetailOrder.status as ServiceOrderTab] || serviceDetailOrder.status}
                </p>
                <p>
                  <span className="font-medium text-foreground">Ngày tạo đơn:</span>{" "}
                  {formatDate(serviceDetailOrder.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {VI.profile.serviceOrders.cardBookings}
              </h3>
              <div className="space-y-2">
                {serviceDetailOrder.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium text-foreground">
                        {formatDate(booking.bookingDate)}
                      </span>
                      <span>{booking.timeSlot}</span>
                      <span>
                        {booking.numberOfHuman} {VI.profile.serviceOrders.cardPeopleCount}
                      </span>
                      <span>
                        {booking.rentSlotAmount} {VI.profile.serviceOrders.cardSlotAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ReviewModal
        open={reviewModalOpen}
        orderId={reviewOrderId || 0}
        cosplayerId={reviewCosplayerId || 0}
        loading={!!reviewingOrderId}
        onCancel={() => {
          setReviewModalOpen(false)
          setReviewOrderId(null)
          setReviewCosplayerId(null)
          setExistingReview(null)
        }}
        existingReview={existingReview}
        onSubmit={handleReviewSubmit}
      />

      <CreateDisputeModal
        open={disputeModalOpen}
        orderId={disputeOrderId || 0}
        loading={!!disputingOrderId}
        onCancel={() => {
          setDisputeModalOpen(false)
          setDisputeOrderId(null)
        }}
        onSubmit={handleDisputeSubmit}
      />

      <Modal
        open={cancelModalOpen}
        title={VI.profile.orders.cancelModal.title}
        okText={VI.common.actions.confirm}
        cancelText={VI.common.actions.cancel}
        okButtonProps={{ danger: true, loading: cancellingOrderId !== null }}
        onOk={handleCancelSubmit}
        onCancel={() => {
          setCancelModalOpen(false)
          setCancelOrderId(null)
        }}
      >
        <p className="text-muted-foreground">
          {VI.profile.orders.cancelModal.message}
        </p>
      </Modal>

      <ServicePaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        loading={confirmingOrderId !== null || payingOrderId !== null}
        totalAmount={
          paymentOrderId != null
            ? (serviceFilteredOrders.find(
                // Composite key lookup — guards against cross-type contamination
                // even though serviceFilteredOrders already only contains RENT_SERVICE orders.
                (o) => o.orderType === 'RENT_SERVICE' && o.id === paymentOrderId
              )?.totalAmount)
            : undefined
        }
      />
      <ExtendRentalModal
        open={extendModalOpen}
        onClose={() => {
          setExtendModalOpen(false)
          setExtendOrderId(null)
        }}
        onConfirm={async (extendDays: number, paymentMethod: PaymentMethod) => {
          if (!extendOrderId) return
          const detailId = await getDetailIdFromOrder(extendOrderId)
          if (!detailId) {
            message.error('Không tìm thấy thông tin đơn hàng.')
            return
          }
          await extendOrder(extendOrderId, detailId, { extendDays, paymentMethod, payNow: true })
          setExtendModalOpen(false)
          setExtendOrderId(null)
          costumeRefetch()
        }}
        loading={isExtending}
      />
    </section>
  )
}
