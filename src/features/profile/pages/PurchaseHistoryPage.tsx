import { useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { message, Tooltip } from "antd"
import { MessageOutlined } from "@ant-design/icons"
import { VI } from "@/shared/i18n/vi"
import { usePurchaseOrders, type OrderTab } from "../hooks/usePurchaseOrders"
import { ConfirmDeliveryModal } from "@/features/order/components/ConfirmDeliveryModal"
import { ReturnOrderModal } from "@/features/order/components/ReturnOrderModal"
import { OrderDetailDrawer } from "@/features/order/components/OrderDetailDrawer"
import { ReviewModal } from "@/features/order/components/ReviewModal"
import { CreateDisputeModal } from "@/features/order/components/CreateDisputeModal"
import { useCreateReview } from "@/features/costume-rental/hooks/useCreateReview"
import { useCreateDispute } from "@/features/order/hooks/useCreateDispute"
import { PackageCheck, Package, PackageOpen, Clock, Truck, CheckCircle, XCircle, Star, Flag, Eye, RotateCcw } from "lucide-react"

// Format date safely
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN');
};

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

export default function PurchaseHistoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tabParam = searchParams.get("tab") as OrderTab | null
  const tab: OrderTab = tabParam && tabParam in TAB_LABELS ? tabParam : "all"

  const { filteredOrders, counts, loading, error, confirmDelivery, confirmingDeliveryId, returnOrder, returningOrderId, refetch } = usePurchaseOrders(tab)

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewOrderId, setReviewOrderId] = useState<number | null>(null)
  const [reviewCosplayerId, setReviewCosplayerId] = useState<number | null>(null)

  const { submit: submitReview, loading: reviewingOrderId } = useCreateReview()
  const { createDispute, disputingOrderId } = useCreateDispute()

  // Confirm delivery modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  // Return order modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false)
  const [returnOrderId, setReturnOrderId] = useState<number | null>(null)

  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null)

  // Dispute modal state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [disputeOrderId, setDisputeOrderId] = useState<number | null>(null)

  const currentFilterLabel = useMemo(() => {
    return TAB_LABELS[tab]
  }, [tab])

  const handleTabClick = (newTab: OrderTab) => {
    navigate(`/profile/purchase-history?tab=${newTab}`)
  }

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

  // Handle return order
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

  // Handle create dispute
  const handleCreateDispute = (orderId: number) => {
    setDisputeOrderId(orderId)
    setDisputeModalOpen(true)
  }

  const handleDisputeSubmit = async () => {
    if (!disputeOrderId) return
    const success = await createDispute(disputeOrderId)
    if (success) {
      message.success(VI.profile.orders.toastDisputeSuccess)
      setDisputeModalOpen(false)
      setDisputeOrderId(null)
      refetch()
    } else {
      message.error(VI.profile.orders.toastDisputeFailed)
    }
  }

  // Handle review order
  const handleReviewOrder = (orderId: number, cosplayerId: number) => {
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
      // Optionally refetch orders
      refetch()
    } else {
      message.error(VI.profile.orders.toastReviewFailed)
    }
  }

  const renderOrderItem = (order: (typeof filteredOrders)[number]) => {
    const statusLabel = {
      PAID: VI.profile.orders.tabWaitConfirm,
      PREPARING: VI.profile.orders.tabWaitShipping,
      SHIPPING_OUT: VI.profile.orders.statusShippingOut,
      DELIVERING_OUT: VI.profile.orders.statusDeliveringOut,
      IN_USE: VI.profile.orders.tabInUse,
      SHIPPING_BACK: VI.profile.orders.statusShippingBack,
      RETURNED: VI.profile.orders.tabCompleted,
      COMPLETED: VI.profile.orders.tabCompleted,
      CANCELLED: VI.profile.orders.tabCancelled,
    }[order.status] || order.status

    const isDeliveringOut = order.status === 'DELIVERING_OUT'
    const isInUse = order.status === 'IN_USE'
    const canCreateDispute = isInUse
    const isCompleted = order.status === 'RETURNED' || order.status === 'COMPLETED'

    const orderCode = `${VI.profile.orders.orderCodePrefix}-${String(order.id).padStart(4, '0')}`

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
      >
        {/* Left: Thumbnail */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {order.costumeImage ? (
            <img
              src={order.costumeImage}
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
        <div className="flex flex-1 flex-col justify-between">
          {/* Top row: order code + status badge */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-900">
                {order.costumeName || 'Trang phục'}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-slate-500">
                {VI.profile.orders.orderTitle} {orderCode}
              </p>
            </div>
            <span className="ml-2 shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {statusLabel}
            </span>
          </div>

          {/* Middle row: rental period + item count */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
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
                setDetailOrderId(order.id)
                setDetailDrawerOpen(true)
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {VI.order.actions.viewDetail}
            </button>
            {isDeliveringOut && (
              <button
                type="button"
                onClick={() => handleConfirmDelivery(order.id)}
                disabled={confirmingDeliveryId === order.id}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {confirmingDeliveryId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionConfirmDelivery}
              </button>
            )}
            {isInUse && (
              <button
                type="button"
                onClick={() => handleReturnOrder(order.id)}
                disabled={returningOrderId === order.id}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
              >
                {returningOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionReturn}
              </button>
            )}
            {canCreateDispute && (
              <button
                type="button"
                onClick={() => handleCreateDispute(order.id)}
                disabled={disputingOrderId === order.id}
                className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                <Flag className="h-3.5 w-3.5" />
                {disputingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.dispute.button}
              </button>
            )}
            {isCompleted && (
              <button
                type="button"
                onClick={() => handleReviewOrder(order.id, order.cosplayerId)}
                disabled={reviewingOrderId === order.id}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
              >
                <Star className="h-3.5 w-3.5" />
                {reviewingOrderId === order.id ? VI.profile.orders.actionProcessing : VI.profile.orders.actionReview}
              </button>
            )}
          </div>
        </div>

        {/* Right: Total amount + Chat */}
        <div className="flex flex-col items-end justify-between text-right">
          <span className="text-base font-bold text-purple-600">
            {order.totalAmount.toLocaleString('vi-VN')} ₫
          </span>
          {order.cosplayerId && (
            <Tooltip title="Nhắn tin">
              <button
                type="button"
                onClick={() => navigate(`/messages?target=${order.cosplayerId}`)}
                className="mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-purple-600"
              >
                <MessageOutlined className="text-lg" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{VI.profile.orders.title}</h1>

          {/* Tab Navigation */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(Object.keys(TAB_LABELS) as OrderTab[]).map((tabKey) => {
              const Icon = TAB_ICONS[tabKey]
              const isActive = tab === tabKey
              const count = counts[tabKey]
              return (
                <Tooltip key={tabKey} title={TAB_LABELS[tabKey]} placement="top">
                  <button
                    type="button"
                    onClick={() => handleTabClick(tabKey)}
                    className={`relative flex items-center justify-center rounded-full w-10 h-10 transition-colors ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {count > 0 && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                          isActive ? "bg-white text-purple-600" : "bg-purple-600 text-white"
                        }`}
                      >
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </button>
                </Tooltip>
              )
            })}
          </div>

          {/* Current Filter Info - only show when not on "all" tab */}
          {tab !== "all" && (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">{VI.profile.orders.filterLabel}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{currentFilterLabel}</p>
            </div>
          )}

          {/* Content */}
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                <span className="ml-2 text-slate-600">{VI.common.status.loading}</span>
              </div>
            ) : error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
                {VI.profile.orders.loadError}
              </p>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <PackageCheck className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">{VI.profile.orders.empty}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(renderOrderItem)}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Confirm Delivery Modal */}
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

      {/* Return Order Modal */}
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

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        open={detailDrawerOpen}
        orderId={detailOrderId}
        onClose={() => {
          setDetailDrawerOpen(false)
          setDetailOrderId(null)
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        orderId={reviewOrderId || 0}
        cosplayerId={reviewCosplayerId || 0}
        loading={!!reviewingOrderId}
        onCancel={() => {
          setReviewModalOpen(false)
          setReviewOrderId(null)
          setReviewCosplayerId(null)
        }}
        onSubmit={handleReviewSubmit}
      />

      {/* Create Dispute Modal */}
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
    </section>
  )
}
