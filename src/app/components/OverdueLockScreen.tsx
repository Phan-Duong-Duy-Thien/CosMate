/**
 * Overdue Lock Screen
 *
 * Full-page overlay shown when the cosplayer has overdue orders.
 * Displays the list of overdue orders and a CTA to navigate to
 * purchase history for returning them.
 *
 * Design: CosMate neo-brutalism anime style with urgent but friendly tone.
 */

import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowRight, Clock, Package } from "lucide-react"
import { useOverdueOrderLock } from "@/app/providers/OverdueOrderProvider"
import { VI } from "@/shared/i18n/vi"

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("vi-VN")
}

const formatOrderCode = (id: number) =>
  `RN-${String(id).padStart(4, "0")}`

export default function OverdueLockScreen() {
  const navigate = useNavigate()
  const { overdueOrders } = useOverdueOrderLock()

  const handleGoToReturn = () => {
    navigate("/profile/purchase-history?parent=costume&tab=all")
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(220,38,38,0.15) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 mx-4 w-full max-w-lg animate-[fadeInUp_0.5s_ease-out]">
        {/* Main card */}
        <div className="rounded-3xl border-[3px] border-red-900 bg-white p-6 shadow-[8px_8px_0_0_rgba(127,29,29,0.25)] sm:p-8">
          {/* Warning icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-red-900 bg-red-100 shadow-[4px_4px_0_0_rgba(127,29,29,0.2)]">
            <AlertTriangle className="h-10 w-10 text-red-600" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h1 className="mb-1 text-center text-2xl font-extrabold text-red-900 sm:text-3xl">
            {VI.overdueLock.title}
          </h1>
          <p className="mb-2 text-center text-base font-semibold text-red-700">
            {VI.overdueLock.subtitle}
          </p>
          <p className="mb-6 text-center text-sm leading-relaxed text-slate-600">
            {VI.overdueLock.message}
          </p>

          {/* Overdue order list */}
          {overdueOrders.length > 0 && (
            <div className="mb-6 space-y-3">
              <p className="text-sm font-bold text-red-800">
                {VI.overdueLock.orderLabel} ({overdueOrders.length})
              </p>
              {overdueOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border-[2px] border-red-300 bg-red-50/80 p-3 transition-all hover:border-red-400"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[2px] border-red-400 bg-white">
                    <Package className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-red-900">
                      {order.costumeName || "Trang phục"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-red-700/80">
                      <span className="font-semibold">
                        {VI.overdueLock.orderCode}: {formatOrderCode(order.id)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.rentStart)} – {formatDate(order.rentEnd)}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                    {VI.overdueLock.statusOverdue}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleGoToReturn}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-red-900 bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3.5 text-base font-extrabold text-white shadow-[4px_4px_0_0_rgba(127,29,29,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(127,29,29,0.35)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(127,29,29,0.3)]"
          >
            {VI.overdueLock.ctaButton}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Warning note */}
          <p className="mt-4 text-center text-xs leading-relaxed text-red-600/80">
            ⚠️ {VI.overdueLock.warningNote}
          </p>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
