import { useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { VI } from "@/shared/i18n/vi"
import { usePurchaseOrders, type OrderTab } from "../hooks/usePurchaseOrders"
import { PackageCheck, Clock, Truck, CheckCircle, XCircle } from "lucide-react"

const TAB_LABELS: Record<OrderTab, string> = {
  all: VI.profile.orders.tabAll,
  wait_confirm: VI.profile.orders.tabWaitConfirm,
  wait_shipping: VI.profile.orders.tabWaitShipping,
  in_use: VI.profile.orders.tabInUse,
  completed: VI.profile.orders.tabCompleted,
  cancelled: VI.profile.orders.tabCancelled,
}

const TAB_ICONS: Record<OrderTab, React.ElementType> = {
  all: PackageCheck,
  wait_confirm: Clock,
  wait_shipping: Truck,
  in_use: PackageCheck,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function PurchaseHistoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tabParam = searchParams.get("tab") as OrderTab | null
  const tab: OrderTab = tabParam && tabParam in TAB_LABELS ? tabParam : "all"

  const { filteredOrders, counts, loading, error } = usePurchaseOrders(tab)

  const currentFilterLabel = useMemo(() => {
    return TAB_LABELS[tab]
  }, [tab])

  const handleTabClick = (newTab: OrderTab) => {
    navigate(`/profile/purchase-history?tab=${newTab}`)
  }

  const renderOrderItem = (order: (typeof filteredOrders)[number]) => {
    const statusLabel = {
      PAID: VI.profile.orders.tabWaitConfirm,
      PREPARING: VI.profile.orders.tabWaitShipping,
      SHIPPING_OUT: VI.profile.orders.tabInUse,
      DELIVERING_OUT: VI.profile.orders.tabInUse,
      IN_USE: VI.profile.orders.tabInUse,
      RETURNED: VI.profile.orders.tabCompleted,
      COMPLETED: VI.profile.orders.tabCompleted,
      CANCELLED: VI.profile.orders.tabCancelled,
    }[order.status] || order.status

    return (
      <div
        key={order.id}
        className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {order.costumeImage ? (
            <img
              src={order.costumeImage}
              alt={order.costumeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <PackageCheck className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">{order.costumeName}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {VI.profile.orders.orderId}: #{order.id}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              {new Date(order.rentStart).toLocaleDateString("vi-VN")} -{" "}
              {new Date(order.rentEnd).toLocaleDateString("vi-VN")}
            </span>
            <span className="font-semibold text-purple-600">
              {order.totalAmount.toLocaleString("vi-VN")} ₫
            </span>
          </div>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(TAB_LABELS) as OrderTab[]).map((tabKey) => {
              const Icon = TAB_ICONS[tabKey]
              const isActive = tab === tabKey
              const count = counts[tabKey]
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => handleTabClick(tabKey)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{TAB_LABELS[tabKey]}</span>
                  {count > 0 && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                        isActive ? "bg-white/20" : "bg-slate-200"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Current Filter Info */}
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">{VI.profile.orders.filterLabel}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{currentFilterLabel}</p>
          </div>

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
    </section>
  )
}
