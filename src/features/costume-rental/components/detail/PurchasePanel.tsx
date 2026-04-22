import { Star } from "lucide-react"

import type { Costume, QuoteBreakdown } from "../../types"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
import { PriceBreakdownCard } from "./PriceBreakdownCard"
import { VI } from "@/shared/i18n/vi"

interface PurchasePanelProps {
  costume: Costume
  days: number
  startDate: string
  selectedRentalOptionId: number | null
  checkedOptionalIds: Set<number>
  quote: QuoteBreakdown
  onDaysChange: (days: number) => void
  onStartDateChange: (date: string) => void
  onSelectRentalOption: (id: number) => void
  onToggleOptionalAccessory: (id: number) => void
  onRentNow: () => void
}

export const PurchasePanel = ({
  costume,
  days,
  startDate,
  selectedRentalOptionId,
  checkedOptionalIds,
  quote,
  onDaysChange,
  onStartDateChange,
  onSelectRentalOption,
  onToggleOptionalAccessory,
  onRentNow,
}: PurchasePanelProps) => {
  const minDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toLocaleDateString('en-CA') // YYYY-MM-DD in local time (no UTC shift)
  })()
  const hasRentalOptions = (costume.rentalOptions ?? []).length > 0
  const hasAccessories = (costume.accessories ?? []).length > 0
  const hasSurcharges = (costume.surcharges ?? []).length > 0
  const isRented = costume.status === 'RENTED'

  return (
    <div className="space-y-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">{costume.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>—</span>
          </span>
          <span>Kích cỡ: {costume.size ?? "—"}</span>
          <span className="font-medium text-pink-600">
            {costume.pricePerDay.toLocaleString("vi-VN")} VNĐ/ngày
          </span>
        </div>
      </div>

      {isRented && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {VI.costumeRental.detail.rentedBanner}
        </div>
      )}

      <div className="space-y-3 text-sm text-slate-600">
        {hasRentalOptions ? (
          <div>
            <p className="font-semibold text-slate-700">{VI.costumeRental.rentalOptions.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {costume.rentalOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isRented}
                  onClick={() => onSelectRentalOption(opt.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    selectedRentalOptionId === opt.id
                      ? "border-pink-200 bg-pink-100 text-pink-700"
                      : "border-slate-200 bg-white text-slate-600",
                    isRented && "cursor-not-allowed opacity-50"
                  )}
                >
                  {opt.name}({opt.price.toLocaleString("vi-VN")}VNĐ)
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-slate-700">{VI.costumeRental.rentalOptions.title}</p>
            <p className="mt-1 text-xs text-slate-400">{VI.costumeRental.rentalOptions.empty}</p>
          </div>
        )}

        <div>
          <p className="font-semibold text-slate-700">Thời gian thuê</p>
          <p className="mt-1 text-xs text-red-500">
            Lưu ý: Thời gian bắt đầu thuê phải ít nhất <strong>3 ngày</strong> sau tính từ thời điểm hiện tại.
          </p>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <input
                type="date"
                value={startDate}
                min={minDate}
                disabled={isRented}
                onChange={(e) => onStartDateChange(e.target.value)}
                className={cn(
                  "h-10 w-full rounded-full border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200",
                  isRented ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200" : "border-slate-200"
                )}
              />
            </div>
            <input
              type="number"
              min={1}
              value={days}
              disabled={isRented}
              onChange={(e) => onDaysChange(Math.max(1, Number(e.target.value) || 1))}
              className={cn(
                "h-10 rounded-full border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200",
                isRented ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200" : "border-slate-200"
              )}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Cần đặt trước tối thiểu <strong>3 ngày</strong> để shop chuẩn bị &amp; đơn vị vận chuyển giao hàng.
          </p>
        </div>

        {hasAccessories && (
          <div>
            <p className="font-semibold text-slate-700">Phụ kiện kèm theo</p>
            <div className="mt-2 space-y-2">
              {costume.accessories.map((acc) => (
                <label
                  key={acc.id}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2",
                    (acc.isRequired || isRented) && "opacity-60"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={acc.isRequired || checkedOptionalIds.has(acc.id)}
                      disabled={acc.isRequired || isRented}
                      onChange={() => { if (!acc.isRequired && !isRented) onToggleOptionalAccessory(acc.id) }}
                      className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-200"
                    />
                    {acc.name}
                    {acc.isRequired && <span className="text-xs text-pink-500"> (bắt buộc)</span>}
                  </span>
                  <span className="font-semibold text-slate-900">{acc.price.toLocaleString("vi-VN")} VNĐ</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {hasSurcharges && (
          <div>
            <p className="font-semibold text-slate-700">Phụ phí (luôn áp dụng)</p>
            <div className="mt-2 space-y-2">
              {costume.surcharges.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2">
                  <span>{s.name}</span>
                  <span className="font-semibold text-slate-900">{s.price.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2">
          <span>Tiền cọc</span>
          <span className="font-semibold text-slate-900">{costume.depositAmount.toLocaleString("vi-VN")} VNĐ</span>
        </div>
      </div>

      <PriceBreakdownCard quote={quote} days={days} />

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full rounded-full"
          disabled={isRented}
          onClick={onRentNow}
        >
          {isRented ? VI.costumeRental.detail.rentedButton : VI.costumeRental.rentNow}
        </Button>
      </div>
    </div>
  )
}
