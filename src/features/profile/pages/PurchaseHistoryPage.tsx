import { useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { message, Tooltip, Modal, Table } from "antd"
import { VI } from "@/shared/i18n/vi"
import { usePurchaseOrders, type OrderTab } from "../hooks/usePurchaseOrders"
import { useServiceOrders, type ServiceOrderTab } from "../hooks/useServiceOrders"
import { ConfirmDeliveryModal } from "@/features/order/components/ConfirmDeliveryModal"
import { ReturnOrderModal, type ReturnOrderSubmitData } from "@/features/order/components/ReturnOrderModal"
import { OrderDetailDrawer } from "@/features/order/components/OrderDetailDrawer"
import { ReviewModal } from "@/features/order/components/ReviewModal"
import { CreateDisputeModal } from "@/features/order/components/CreateDisputeModal"
import { ExtendRentalModal } from "@/features/order/components/ExtendRentalModal"
import { useCreateReview } from "@/features/costume-rental/hooks/useCreateReview"
import { getReviewByOrderId, type ReviewItem } from "@/features/costume-rental/api/review.api"
import { useCreateDispute } from "@/features/order/hooks/useCreateDispute"
import { useCancelOrder } from "@/features/order/hooks/useCancelOrder"
import { useExtendOrder } from "@/features/order/hooks/useExtendOrder"
import { notifyOrdersChanged } from "@/shared/sync/dataSync"
import { ServicePaymentModal } from "@/features/service/components/ServicePaymentModal"
import type { PaymentMethod } from "@/features/order/utils/paymentReturnUrls"
import {
  PackageCheck, Package, PackageOpen, Clock, Truck, CheckCircle, XCircle, Star, Flag, Eye, RotateCcw,
  CalendarClock, WalletCards, Ban
} from "lucide-react"
import type { ServiceOrder, ServiceOrderBooking } from "@/features/service/api/booking.api"
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

/** Trạng thái đơn dịch vụ — badge nhất quán thẻ & modal chi tiết */
const SERVICE_ORDER_STATUS_BADGE: Record<string, string> = {
  UNCONFIRM: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/90',
  UNPAID: 'bg-orange-50 text-orange-900 ring-1 ring-orange-200/90',
  PAID: 'bg-blue-50 text-blue-900 ring-1 ring-blue-200/90',
  WAITING_SERVICE_DATE:
    'bg-cosmate-soft-pink/80 text-cosmate-pink ring-2 ring-cosmate-pink/40 shadow-sm',
  IN_SERVICE:
    'bg-cosmate-soft-pink text-cosmate-pink ring-2 ring-cosmate-pink/50 shadow-sm',
  COMPLETED: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/90',
  DISPUTE: 'bg-red-50 text-red-900 ring-1 ring-red-200/90',
  CANCELLED: 'bg-muted text-muted-foreground ring-1 ring-border',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Format date safely
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN');
};

/** Hiển thị mã đơn (cosplay thuê vs dịch vụ) — khớp VI prefix RN- / SE- */
const formatCostumeOrderCode = (id: number) =>
  `${VI.profile.orders.orderCodePrefix}-${String(id).padStart(4, '0')}`;
const formatServiceOrderCode = (id: number) =>
  `${VI.profile.serviceOrders.orderCodePrefix}-${String(id).padStart(4, '0')}`;

const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`;

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

  const { submit: submitReview, loading: isReviewSubmitting } = useCreateReview()
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
  const [confirmSubmittingOrderId, setConfirmSubmittingOrderId] = useState<number | null>(null)

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

  const handleConfirmDeliverySuccess = () => {
    message.success(VI.profile.orders.toastConfirmDeliverySuccess)
    setConfirmModalOpen(false)
    setSelectedOrderId(null)
    costumeRefetch()
  }

  const handleReturnOrder = (orderId: number) => {
    setReturnOrderId(orderId)
    setReturnModalOpen(true)
  }

  const handleReturnSubmit = async (data: ReturnOrderSubmitData) => {
    if (!returnOrderId) return
    const success = await returnOrder(
      returnOrderId,
      data.trackingCode,
      data.shippingCarrierName,
      data.images,
      data.notes,
      data.autoCreateGhn
    )
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
      notifyOrdersChanged({ orderId: cancelOrderId, orderType: 'RENT_COSTUME' })
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
      EXTENDING: VI.provider.orders.tabs.extending,
    }[order.status] || order.status

    const statusBadgeColor: Record<string, string> = {
      UNPAID: 'bg-orange-100 text-orange-700',
      PAID: 'bg-blue-100 text-blue-700',
      PREPARING: 'bg-cosmate-soft-pink text-cosmate-pink',
      SHIPPING_OUT: 'bg-cyan-100 text-cyan-700',
      DELIVERING_OUT: 'bg-cyan-100 text-cyan-700',
      DELIVERY_OUT: 'bg-cyan-100 text-cyan-700',
      IN_USE: 'bg-cosmate-soft-pink text-cosmate-pink',
      EXTENDING: 'bg-cosmate-soft-pink text-cosmate-pink',
      SHIPPING_BACK: 'bg-orange-100 text-orange-700',
      RETURNED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-slate-200 text-slate-600',
      DISPUTE: 'bg-red-100 text-red-700',
    }
    const badgeColorClass = statusBadgeColor[order.status] || 'bg-blue-100 text-blue-700'

    const isDeliveringOut = order.status === 'DELIVERING_OUT'
    const isInUse = order.status === 'IN_USE'
    const isCancellable = order.status === 'UNPAID' || order.status === 'PAID'

    const isCompleted = order.status === 'RETURNED' || order.status === 'COMPLETED'

    const orderCode = formatCostumeOrderCode(order.id)

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(30,27,75,0.36)]"
      >
        {/* Left: Thumbnail */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-[3px] border-indigo-950 bg-slate-100">
          {costumeImageMap[order.costumeId] ? (
            <img
              src={costumeImageMap[order.costumeId]}
              alt={order.costumeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <PackageCheck className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Middle: Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* Title + order code — badge ở cột phải */}
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-indigo-950">
              {order.costumeName || VI.profile.orders.cardCostumeName}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-slate-600">
              {VI.profile.orders.orderCodeLabel}:{' '}
              <span className="font-bold text-[#d61f91]">{orderCode}</span>
            </p>
          </div>

          {/* Middle row: rental period + item count */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-600">
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
              className="rounded-xl border-[2px] border-indigo-950 bg-white px-3 py-1.5 text-sm font-bold text-indigo-900 transition-colors hover:bg-indigo-50"
            >
              {VI.order.actions.viewDetail}
            </button>

            {/* UNPAID: cancel */}
            {isCancellable && (
              <button
                type="button"
                onClick={() => handleCancelOrder(order.id)}
                disabled={cancellingOrderId === order.id}
                className="flex items-center gap-1 rounded-xl border-[2px] border-red-400 bg-white px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
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
                  disabled={confirmSubmittingOrderId === order.id}
                  className="rounded-xl border-[2px] border-green-900 bg-green-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {confirmSubmittingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionConfirmDelivery}
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateDispute(order.id, order.status)}
                  disabled={disputingOrderId === order.id}
                  className="flex items-center gap-1 rounded-xl border-[2px] border-red-400 bg-white px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
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
                  className="rounded-xl border-[2px] border-orange-900 bg-orange-500 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
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
                  className="flex items-center gap-1 rounded-xl border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:brightness-110 disabled:opacity-50"
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
                disabled={isReviewSubmitting && reviewOrderId === order.id}
                className="flex items-center gap-1 rounded-xl border-[2px] border-amber-900 bg-amber-500 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
              >
                <Star className="h-3.5 w-3.5" />
                {isReviewSubmitting && reviewOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionReview}
              </button>
            )}
          </div>
        </div>

        {/* Right: status + total — căn sát viền phải thẻ */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-2 text-right">
          <span className={`rounded-full border border-white/80 px-2.5 py-0.5 text-xs font-bold shadow-sm ${badgeColorClass}`}>
            {statusLabel}
          </span>
          <span className="text-base font-extrabold text-[#d61f91]">
            {order.totalAmount.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>
    )
  }

  // ── Service order card renderer ─────────────────────────────────────────────
  const renderServiceOrderItem = (order: ServiceOrder) => {
    const statusLabel = SERVICE_TAB_LABELS[order.status as ServiceOrderTab] || order.status
    const orderCode = formatServiceOrderCode(order.id)
    const badgeColorClass =
      SERVICE_ORDER_STATUS_BADGE[order.status] ??
      'bg-blue-50 text-blue-900 ring-1 ring-blue-200/90'
    const isUnconfirm = order.status === 'UNCONFIRM'
    const isUnpaid = order.status === 'UNPAID'
    const isConfirmProcessing = confirmingOrderId === order.id
    const isPayProcessing = payingOrderId === order.id
    const isServiceCompleted = order.status === 'COMPLETED'

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md hover:border-cosmate-soft-pink/80"
      >
        {/* Left: Icon */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cosmate-soft-pink/70">
          <CalendarClock className="h-10 w-10 text-cosmate-pink" />
        </div>

        {/* Middle: Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {VI.profile.serviceOrders.orderTitle}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-slate-500">
              {VI.profile.orders.orderCodeLabel}:{' '}
              <span className="font-semibold text-cosmate-pink">{orderCode}</span>
            </p>
          </div>

          {/* Một dòng tóm tắt — chi tiết lịch chỉ trong modal */}
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              <span>
                {VI.profile.serviceOrders.detailCreatedLabel}:{' '}
                <span className="font-medium text-foreground">{formatDate(order.createdAt)}</span>
              </span>
            </span>
          </div>

          {/* Bottom row: CTA buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setServiceDetailOrder(order)
                setServiceDetailModalOpen(true)
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-cosmate-pink"
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
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                <Star className="h-3.5 w-3.5" />
                {VI.profile.orders.actionReview}
              </button>
            )}
          </div>
        </div>

        {/* Right: status + total */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-2 text-right">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-tight ${badgeColorClass}`}
          >
            {statusLabel}
          </span>
          <span className="text-base font-bold text-cosmate-pink">
            {order.totalAmount.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>
    )
  }

  // ── Status filter renderer (reused for both tabs) ───────────────────────────
  const renderStatusFilter = (
    activeTab: OrderTab | ServiceOrderTab,
    tabLabels: Record<string, string>,
    tabIcons: Record<string, React.ElementType>,
    countsObj: Readonly<Record<string, number>>,
    onTabClick: (tab: string) => void
  ) => (
    <div className="mt-4 flex flex-wrap justify-center gap-2 rounded-2xl border-[3px] border-indigo-950/25 bg-white/80 p-3">
      {(Object.keys(tabLabels) as (OrderTab | ServiceOrderTab)[]).map((tabKey) => {
        const Icon = tabIcons[tabKey]
        const isActive = activeTab === tabKey
        const count = countsObj[tabKey] ?? 0
        return (
          <Tooltip key={tabKey} title={tabLabels[tabKey]} placement="top">
            <button
              type="button"
              onClick={() => onTabClick(tabKey)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                isActive
                  ? 'border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[3px_3px_0_0_#1e1b4b]'
                  : 'border-indigo-900/30 bg-white text-slate-600 hover:bg-pink-50 hover:text-[#d61f91]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {count > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                    isActive ? 'bg-white text-[#d61f91]' : 'bg-[#d61f91] text-white'
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
        <p className="text-sm font-medium text-slate-600">
          {label} {VI.profile.orders.paginationShow}{' '}
          <span className="font-bold text-indigo-900">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)}</span>{' '}
          {VI.profile.orders.paginationOf} <span className="font-bold text-indigo-900">{total}</span>
        </p>
        <div className="flex items-center gap-1 rounded-xl border-[3px] border-indigo-950/25 bg-white p-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-indigo-900/30 text-sm font-bold text-slate-600 transition-colors hover:bg-pink-50 hover:text-[#d61f91] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors ${
                  p === currentPage
                    ? 'border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white'
                    : 'border-indigo-900/30 text-slate-600 hover:bg-pink-50 hover:text-[#d61f91]'
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-indigo-900/30 text-sm font-bold text-slate-600 transition-colors hover:bg-pink-50 hover:text-[#d61f91] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    )
  }

  // ── Content renderer ─────────────────────────────────────────────────────────
  function renderContent<T>(
    isLoading: boolean,
    hasError: boolean,
    isEmpty: boolean,
    emptyLabel: string,
    loadErrorLabel: string,
    renderItem: (item: T) => React.ReactNode,
    items: T[]
  ): React.ReactNode {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center rounded-2xl border-[3px] border-indigo-950/20 bg-white/80 py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d61f91] border-t-transparent" />
          <span className="ml-2 text-sm font-semibold text-slate-600">{VI.common.status.loading}</span>
        </div>
      )
    }
    if (hasError) {
      return (
        <p className="rounded-2xl border-[3px] border-rose-300 bg-rose-50 px-4 py-4 text-center text-sm font-semibold text-rose-700">
          {loadErrorLabel}
        </p>
      )
    }
    if (isEmpty) {
      return (
        <div className="rounded-2xl border-[3px] border-indigo-950/20 bg-white/80 px-4 py-10 text-center">
          <PackageCheck className="mx-auto h-12 w-12 text-indigo-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">{emptyLabel}</p>
        </div>
      )
    }
    return <div className="space-y-3">{items.map(renderItem)}</div>
  }


  return (
    <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-[min(1460px,100%)]">
        <Card className="rounded-[1.5rem] border-[4px] border-indigo-950 bg-gradient-to-b from-[#fff7fb] via-[#fffaf0] to-[#f5f3ff] p-5 shadow-[10px_10px_0_0_rgba(30,27,75,0.34)] md:p-6">
          <h1 className="max-w-4xl text-balance text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-2xl lg:text-3xl">
            <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              {VI.profile.serviceOrders.pageDecorTitle}
            </span>
          </h1>

          {/* ── Parent Tab Navigation ──────────────────────────────────────── */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(PARENT_TAB_LABELS) as ParentTab[]).map((tabKey) => {
              const Icon = PARENT_TAB_ICONS[tabKey]
              const isActive = parentTab === tabKey
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => handleParentTabClick(tabKey)}
                  className={`flex items-center gap-2 rounded-xl border-[2px] px-4 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? 'border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[3px_3px_0_0_#1e1b4b]'
                      : 'border-indigo-900/25 bg-white text-slate-700 hover:bg-pink-50 hover:text-[#d61f91]'
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
                counts as unknown as Readonly<Record<string, number>>,
                handleTabClick
              )}

              {/* Current filter info */}
              {costumeTab !== "all" && (
                <div className="mt-4 rounded-2xl border-[3px] border-indigo-950/15 bg-white/85 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{VI.profile.orders.filterLabel}</p>
                  <p className="mt-1 text-sm font-extrabold text-indigo-900">{currentFilterLabel}</p>
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
                serviceCounts as unknown as Readonly<Record<string, number>>,
                (tab) => setStatus(tab as ServiceOrderTab)
              )}

              {/* Current filter info */}
              {selectedStatus !== 'all' && (
                <div className="mt-4 rounded-2xl border-[3px] border-indigo-950/15 bg-white/85 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{VI.profile.serviceOrders.filterLabel}</p>
                  <p className="mt-1 text-sm font-extrabold text-indigo-900">{currentFilterLabel}</p>
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
                VI.profile.orders.paginationService
              )}
            </>
          )}
        </Card>
      </div>

      {/* ── Modals (only for costume orders) ─────────────────────────────── */}
      <ConfirmDeliveryModal
        open={confirmModalOpen}
        orderId={selectedOrderId || 0}
        onSubmittingChange={setConfirmSubmittingOrderId}
        onCancel={() => {
          setConfirmModalOpen(false)
          setSelectedOrderId(null)
          setConfirmSubmittingOrderId(null)
        }}
        onSuccess={handleConfirmDeliverySuccess}
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
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {VI.profile.orders.orderCodeLabel}
                  </dt>
                  <dd className="text-base font-semibold text-cosmate-pink">
                    {formatServiceOrderCode(serviceDetailOrder.id)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {VI.profile.orders.cardTotal}
                  </dt>
                  <dd className="text-base font-semibold text-foreground">
                    {formatVnd(serviceDetailOrder.totalAmount)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {VI.profile.serviceOrders.detailStatusLabel}
                  </dt>
                  <dd className="mt-0.5">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-tight ${
                        SERVICE_ORDER_STATUS_BADGE[serviceDetailOrder.status] ??
                        'bg-muted text-foreground ring-1 ring-border'
                      }`}
                    >
                      {SERVICE_TAB_LABELS[serviceDetailOrder.status as ServiceOrderTab] ||
                        serviceDetailOrder.status}
                    </span>
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {VI.profile.serviceOrders.detailCreatedLabel}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatDate(serviceDetailOrder.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {VI.profile.serviceOrders.cardBookings}
              </h3>
              {serviceDetailOrder.bookings.length === 0 ? (
                <p className="rounded-xl border border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                  {VI.common.status.noData}
                </p>
              ) : (
                <Table<ServiceOrderBooking>
                  size="small"
                  pagination={false}
                  rowKey="id"
                  dataSource={serviceDetailOrder.bookings}
                  scroll={{ x: 'max-content' }}
                  className="[&_.ant-table]:rounded-xl [&_.ant-table]:border [&_.ant-table]:border-border [&_.ant-table-container]:!rounded-xl"
                  columns={[
                    {
                      title: VI.profile.serviceOrders.cardBookingDate,
                      dataIndex: 'bookingDate',
                      key: 'bookingDate',
                      render: (d: string) => formatDate(d),
                    },
                    {
                      title: VI.profile.serviceOrders.cardTimeSlot,
                      dataIndex: 'timeSlot',
                      key: 'timeSlot',
                      width: 120,
                    },
                    {
                      title: VI.profile.serviceOrders.cardPeopleCount,
                      dataIndex: 'numberOfHuman',
                      key: 'numberOfHuman',
                      align: 'center',
                      width: 100,
                    },
                    {
                      title: VI.profile.serviceOrders.detailSlotAmount,
                      dataIndex: 'rentSlotAmount',
                      key: 'rentSlotAmount',
                      align: 'right',
                      render: (v: number) => formatVnd(v),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        )}
      </Modal>

      <ReviewModal
        open={reviewModalOpen}
        orderId={reviewOrderId || 0}
        cosplayerId={reviewCosplayerId || 0}
        loading={isReviewSubmitting}
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
