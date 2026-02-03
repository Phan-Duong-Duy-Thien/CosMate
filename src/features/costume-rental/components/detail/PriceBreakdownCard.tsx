import type { QuoteBreakdown } from "../../types"

interface PriceBreakdownCardProps {
  quote: QuoteBreakdown
  purposeLabel: string
  days: number
}

export const PriceBreakdownCard = ({
  quote,
  purposeLabel,
  days,
}: PriceBreakdownCardProps) => (
  <div className="rounded-3xl border border-pink-100 bg-white/90 p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-700">Tạm tính</h3>
    <div className="mt-3 space-y-2 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span>
          Giá thuê ({purposeLabel} · {days} ngày)
        </span>
        <span className="font-semibold text-slate-900">{quote.rentalPrice}k</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Phụ kiện</span>
        <span className="font-semibold text-slate-900">
          {quote.accessoryTotal}k
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Phụ thu giặt dưỡng</span>
        <span className="font-semibold text-slate-900">{quote.laundryFee}k</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Tiền cọc</span>
        <span className="font-semibold text-slate-900">{quote.deposit}k</span>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold text-pink-600">
      <span>Tổng cần thanh toán</span>
      <span>{quote.total}k</span>
    </div>
  </div>
)
