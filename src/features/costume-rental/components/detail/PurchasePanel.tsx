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
    <div className="space-y-4 rounded-3xl border-[5px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-[#fce7f3] to-[#dbeafe] p-4 shadow-[12px_12px_0_0_rgba(30,27,75,0.65)] md:p-5">
      <div className="space-y-2 border-b-[3px] border-dashed border-indigo-950/35 pb-4">
        <h1 className="text-xl font-extrabold tracking-tight text-indigo-950">{costume.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-indigo-900/85">
          <span className="inline-flex items-center gap-1 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-400 to-orange-300 px-2 py-0.5 text-xs font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
            <Star className="h-3.5 w-3.5 text-indigo-950" />
            Premium
          </span>
          <span>Kích cỡ: {costume.size ?? "—"}</span>
          <span className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text font-extrabold text-transparent">
            {costume.pricePerDay.toLocaleString("vi-VN")} VNĐ/ngày
          </span>
        </div>
      </div>

      {isRented && (
        <div className="rounded-2xl border-[4px] border-[#D97706] bg-[#FEF3C7] px-4 py-3 text-sm font-bold text-[#92400E] shadow-[5px_5px_0_0_rgba(146,64,14,0.25)]">
          {VI.costumeRental.detail.rentedBanner}
        </div>
      )}

      <div className="space-y-3 text-sm text-indigo-900/85">
        {hasRentalOptions ? (
          <div>
            <p className="font-extrabold text-indigo-950">{VI.costumeRental.rentalOptions.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {costume.rentalOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isRented}
                  onClick={() => onSelectRentalOption(opt.id)}
                  className={cn(
                    "rounded-xl border-[3px] px-3.5 py-2 text-xs font-extrabold transition",
                    selectedRentalOptionId === opt.id
                      ? "border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[4px_4px_0_0_#1e1b4b]"
                      : "border-indigo-950 bg-white text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.3)]",
                    isRented && "cursor-not-allowed opacity-50"
                  )}
                >
                  {opt.name} ({opt.price.toLocaleString("vi-VN")} VNĐ)
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="font-extrabold text-indigo-950">{VI.costumeRental.rentalOptions.title}</p>
            <p className="mt-1 text-xs text-indigo-900/65">{VI.costumeRental.rentalOptions.empty}</p>
          </div>
        )}

        <div>
          <p className="font-extrabold text-indigo-950">Thời gian thuê</p>
          <p className="mt-1 rounded-xl border-[3px] border-[#DC2626] bg-[#FEE2E2] px-2 py-1 text-xs font-semibold text-[#991B1B]">
            Lưu ý: ngày bắt đầu thuê phải ít nhất <strong>3 ngày</strong> sau hiện tại.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={startDate}
              min={minDate}
              disabled={isRented}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={cn(
                "h-10 w-full rounded-xl border-[3px] px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300",
                isRented
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-indigo-950 bg-white text-indigo-950"
              )}
            />
            <input
              type="number"
              min={1}
              value={days}
              disabled={isRented}
              onChange={(e) => onDaysChange(Math.max(1, Number(e.target.value) || 1))}
              className={cn(
                "h-10 rounded-xl border-[3px] px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300",
                isRented
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-indigo-950 bg-white text-indigo-950"
              )}
            />
          </div>
          <p className="mt-1 text-xs text-indigo-900/65">
            Cần đặt trước tối thiểu <strong>3 ngày</strong> để shop chuẩn bị và đơn vị vận chuyển giao hàng.
          </p>
        </div>

        {hasAccessories && (
          <div>
            <p className="font-extrabold text-indigo-950">Phụ kiện kèm theo</p>
            <div className="mt-2 space-y-2">
              {costume.accessories.map((acc) => (
                <label
                  key={acc.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.25)]",
                    (acc.isRequired || isRented) && "opacity-60"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={acc.isRequired || checkedOptionalIds.has(acc.id)}
                      disabled={acc.isRequired || isRented}
                      onChange={() => { if (!acc.isRequired && !isRented) onToggleOptionalAccessory(acc.id) }}
                      className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-300"
                    />
                    {acc.name}
                    {acc.isRequired && <span className="text-xs font-semibold text-[#DC2626]"> (bắt buộc)</span>}
                  </span>
                  <span className="font-bold text-indigo-950">{acc.price.toLocaleString("vi-VN")} VNĐ</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {hasSurcharges && (
          <div>
            <p className="font-extrabold text-indigo-950">Phụ phí (luôn áp dụng)</p>
            <div className="mt-2 space-y-2">
              {costume.surcharges.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.25)]">
                  <span>{s.name}</span>
                  <span className="font-bold text-indigo-950">{s.price.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#ddd6fe] px-3 py-2 font-bold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.4)]">
          <span>Tiền cọc</span>
          <span>{costume.depositAmount.toLocaleString("vi-VN")} VNĐ</span>
        </div>
      </div>

      <PriceBreakdownCard quote={quote} days={days} />

      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 font-extrabold text-white shadow-[7px_7px_0_0_#1e1b4b] transition hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_0_#1e1b4b]"
        disabled={isRented}
        onClick={onRentNow}
      >
        {isRented ? VI.costumeRental.detail.rentedButton : VI.costumeRental.rentNow}
      </Button>
    </div>
  )
}
