import { Info, Star } from "lucide-react"

import type { CostumeItem, QuoteBreakdown, RentalPurpose, SizeKey } from "../../types"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
import { PriceBreakdownCard } from "./PriceBreakdownCard"

interface PurchasePanelProps {
  costume: CostumeItem
  purpose: RentalPurpose
  size: SizeKey | null
  days: number
  startDate: string
  accessoryIds: string[]
  quote: QuoteBreakdown
  onPurposeChange: (purpose: RentalPurpose) => void
  onSizeChange: (size: SizeKey) => void
  onDaysChange: (days: number) => void
  onStartDateChange: (date: string) => void
  onToggleAccessory: (id: string) => void
  onRentNow: () => void
  onAddToCart: () => void
  isInCart: boolean
}

const purposeLabels: Record<RentalPurpose, string> = {
  test: "Test",
  fes_shoot: "Fes-Shoot",
  event: "Event",
}

const brandTypeLabels: Record<CostumeItem["brandType"], string> = {
  brand: "Brand",
  non_brand: "Non-brand",
  tu_may: "Tự may",
  freestyle: "Freestyle",
}

const sizeLabels: Record<SizeKey, string> = {
  xs: "XS",
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
  freesize: "Freesize",
}

export const PurchasePanel = ({
  costume,
  purpose,
  size,
  days,
  startDate,
  accessoryIds,
  quote,
  onPurposeChange,
  onSizeChange,
  onDaysChange,
  onStartDateChange,
  onToggleAccessory,
  onRentNow,
  onAddToCart,
  isInCart,
}: PurchasePanelProps) => (
  <div className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-900">{costume.name}</h1>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          {costume.rating.toFixed(1)}
        </span>
        <span>{costume.reviewCount} đánh giá</span>
        <span>{costume.rentalsCount} lượt thuê</span>
      </div>
      <p className="text-sm text-slate-500">
        {brandTypeLabels[costume.brandType]}
        {costume.brandType === "brand" && costume.brandName
          ? `: ${costume.brandName}`
          : ""}
      </p>
    </div>

    <div className="space-y-4 text-sm text-slate-600">
      <div>
        <p className="font-semibold text-slate-700">Hình thức thuê</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {costume.rentalPurposes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPurposeChange(item)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm",
                purpose === item
                  ? "border-pink-200 bg-pink-100 text-pink-700"
                  : "border-slate-200 bg-white text-slate-600"
              )}
            >
              {purposeLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold text-slate-700">
          Kích thước <span className="text-pink-500">*</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {costume.sizeOptions.map((sizeKey) => (
            <button
              key={sizeKey}
              type="button"
              onClick={() => onSizeChange(sizeKey)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium",
                size === sizeKey
                  ? "border-pink-200 bg-pink-100 text-pink-700"
                  : "border-slate-200 bg-white text-slate-600"
              )}
            >
              {sizeLabels[sizeKey]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold text-slate-700">Thời gian thuê</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-10 rounded-full border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
          />
          <input
            type="number"
            min={1}
            value={days}
            onChange={(event) =>
              onDaysChange(Math.max(1, Number(event.target.value) || 1))
            }
            className="h-10 rounded-full border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Thời gian bắt đầu thuê tính từ lúc giao thành công.
        </p>
      </div>

      <div>
        <p className="font-semibold text-slate-700">Phụ kiện kèm theo</p>
        <div className="mt-2 space-y-2">
          {costume.accessoryOptions.length === 0 && (
            <p className="text-sm text-slate-500">Không có phụ kiện kèm theo</p>
          )}
          {costume.accessoryOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessoryIds.includes(option.id)}
                  onChange={() => onToggleAccessory(option.id)}
                  className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-200"
                />
                {option.name}
              </span>
              <span className="font-semibold text-slate-900">+{option.price}k</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2">
        <span className="flex items-center gap-2">
          Phụ thu giặt dưỡng
          <Info className="h-4 w-4 text-slate-400" title="Phí vệ sinh sau khi trả đồ." />
        </span>
        <span className="font-semibold text-slate-900">{costume.laundryFee}k</span>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2">
        <span>Tiền cọc</span>
        <span className="font-semibold text-slate-900">{costume.deposit}k</span>
      </div>
    </div>

    <PriceBreakdownCard
      quote={quote}
      purposeLabel={purposeLabels[purpose]}
      days={days}
    />

    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full rounded-full"
        onClick={onRentNow}
      >
        Thuê ngay
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full rounded-full border-pink-100 text-slate-600"
        onClick={onAddToCart}
      >
        {isInCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
      </Button>
    </div>

    <p className="text-xs text-slate-400">
      Bằng việc tiếp tục, bạn đồng ý điều khoản nền tảng &amp; điều khoản shop.
    </p>
  </div>
)
