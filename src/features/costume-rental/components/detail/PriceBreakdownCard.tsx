import type { QuoteBreakdown } from "../../types"

interface PriceBreakdownCardProps {
  quote: QuoteBreakdown
  days: number
}

export const PriceBreakdownCard = ({ quote, days }: PriceBreakdownCardProps) => (
  <div className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-3 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
    <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">Tạm tính</h3>
    <div className="mt-2 space-y-1.5 text-sm font-semibold text-indigo-900/85">
      <div className="flex items-center justify-between">
        <span>Giá thuê ({days} ngày)</span>
        <span className="font-bold text-indigo-950">{quote.rentalPrice.toLocaleString("vi-VN")}VNĐ</span>
      </div>
      {quote.accessoryTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Phụ kiện</span>
          <span className="font-bold text-indigo-950">+{quote.accessoryTotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
      )}
      {quote.surchargesTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Phụ phí</span>
          <span className="font-bold text-indigo-950">+{quote.surchargesTotal.toLocaleString("vi-VN")}VNĐ</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span>Tiền cọc</span>
        <span className="font-bold text-indigo-950">{quote.deposit.toLocaleString("vi-VN")}VNĐ</span>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t-[3px] border-dashed border-indigo-950/35 pt-2.5 text-base font-extrabold text-transparent bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text">
      <span>Tổng cần thanh toán</span>
      <span>{quote.total.toLocaleString("vi-VN")} VNĐ</span>
    </div>
  </div>
)
