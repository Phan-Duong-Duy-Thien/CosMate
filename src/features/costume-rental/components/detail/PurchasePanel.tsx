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
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time (no UTC shift)
  const hasRentalOptions = (costume.rentalOptions ?? []).length > 0
  const hasAccessories = (costume.accessories ?? []).length > 0
  const hasSurcharges = (costume.surcharges ?? []).length > 0

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

      <div className="space-y-3 text-sm text-slate-600">
        {hasRentalOptions ? (
          <div>
            <p className="font-semibold text-slate-700">{VI.costumeRental.rentalOptions.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {costume.rentalOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectRentalOption(opt.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    selectedRentalOptionId === opt.id
                      ? "border-pink-200 bg-pink-100 text-pink-700"
                      : "border-slate-200 bg-white text-slate-600"
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
          <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="h-10 rounded-full border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
            />
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => onDaysChange(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 rounded-full border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">Thời gian bắt đầu thuê tính từ lúc giao thành công.</p>
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
                    acc.isRequired && "opacity-80"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={acc.isRequired || checkedOptionalIds.has(acc.id)}
                      disabled={acc.isRequired}
                      onChange={() => { if (!acc.isRequired) onToggleOptionalAccessory(acc.id) }}
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

      <PriceBreakdownCard quote={quote}days={days}/>

      <div className="flex flex-col gap-2">
        <Button type="button" variant="default" size="lg" className="w-full rounded-full" onClick={onRentNow}>
          Thuê ngay
        </Button>
      </div>

      <p className="text-xs text-slate-400">
        Bằng việc tiếp tục, bạn đồng ý điều khoản nền tảng &amp; điều khoản shop.
      </p>
    </div>
  )
}
