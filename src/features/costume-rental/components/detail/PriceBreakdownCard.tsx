import type { QuoteBreakdown } from "../../types"

interface PriceBreakdownCardProps {
  quote: QuoteBreakdown
  days: number
}

export const PriceBreakdownCard = ({ quote, days }: PriceBreakdownCardProps) => (
  <div className="rounded-2xl border border-pink-100 bg-white/90 p-3 shadow-sm">
    <h3 className="text-sm font-medium text-slate-600">Tạm tính</h3>
    <div className="mt-2 space-y-1.5 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span>Giá thuê ({days} ngày)</span>
        <span className="font-semibold text-slate-900">{quote.rentalPrice.toLocaleString("vi-VN")}VNĐ</span>
      </div>
      {quote.rentalOptionPrice > 0 && (
        <div className="flex items-center justify-between">
          <span>Gói thuê</span>
          <span className="font-semibold text-slate-900">+{quote.rentalOptionPrice.toLocaleString("vi-VN")} VNĐ</span>
        </div>
      )}
      {quote.accessoryTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Phụ kiện</span>
          <span className="font-semibold text-slate-900">+{quote.accessoryTotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
      )}
      {quote.surchargesTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Phụ phí</span>
          <span className="font-semibold text-slate-900">+{quote.surchargesTotal.toLocaleString("vi-VN")}VNĐ</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span>Tiền cọc</span>
        <span className="font-semibold text-slate-900">{quote.deposit.toLocaleString("vi-VN")}VNĐ</span>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-dashed border-pink-100 pt-2.5 text-base font-bold text-pink-600">
      <span>Tổng cần thanh toán</span>
      <span>{quote.total.toLocaleString("vi-VN")} VNĐ</span>
    </div>
  </div>
)
