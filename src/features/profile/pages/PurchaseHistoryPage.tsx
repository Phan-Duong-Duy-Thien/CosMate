import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { VI } from "@/shared/i18n/vi"

const TAB_LABELS: Record<string, string> = {
  pendingConfirm: VI.profile.orders.pendingConfirm,
  pendingPickup: VI.profile.orders.pendingPickup,
  shipping: VI.profile.orders.shipping,
  review: VI.profile.orders.review,
}

export default function PurchaseHistoryPage() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab") ?? ""

  const currentFilterLabel = useMemo(() => {
    if (!tab) return VI.common.status.noData
    return TAB_LABELS[tab] ?? tab
  }, [tab])

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{VI.profile.orders.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {VI.profile.orders.historyPlaceholder}
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">
              {VI.profile.orders.filterLabel}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {currentFilterLabel}
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
