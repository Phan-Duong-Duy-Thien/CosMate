// Rewrites all 4 costume-detail files with correct Vietnamese Unicode
const fs = require("fs");

fs.writeFileSync(
  "src/features/costume-rental/components/detail/PriceBreakdownCard.tsx",
`import type { QuoteBreakdown } from "../../types"

interface PriceBreakdownCardProps {
  quote: QuoteBreakdown
  days: number
}

export const PriceBreakdownCard = ({ quote, days }: PriceBreakdownCardProps) => (
  <div className="rounded-3xl border border-pink-100 bg-white/90 p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-700">T\u1ea1m t\u00ednh</h3>
    <div className="mt-3 space-y-2 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span>Gi\u00e1 thu\u00ea ({days} ng\u00e0y)</span>
        <span className="font-semibold text-slate-900">{quote.rentalPrice.toLocaleString("vi-VN")}VN\u0110</span>
      </div>
      {quote.rentalOptionPrice > 0 && (
        <div className="flex items-center justify-between">
          <span>G\u00f3i thu\u00ea</span>
          <span className="font-semibold text-slate-900">+{quote.rentalOptionPrice.toLocaleString("vi-VN")} VN\u0110</span>
        </div>
      )}
      {quote.accessoryTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Ph\u1ee5 ki\u1ec7n</span>
          <span className="font-semibold text-slate-900">+{quote.accessoryTotal.toLocaleString("vi-VN")} VN\u0110</span>
        </div>
      )}
      {quote.surchargesTotal > 0 && (
        <div className="flex items-center justify-between">
          <span>Ph\u1ee5 ph\u00ed</span>
          <span className="font-semibold text-slate-900">+{quote.surchargesTotal.toLocaleString("vi-VN")}VN\u0110</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span>Ti\u1ec1n c\u1ecd c</span>
        <span className="font-semibold text-slate-900">{quote.deposit.toLocaleString("vi-VN")}VN\u0110</span>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold text-pink-600">
      <span>T\u1ed5ng c\u1ea7n thanh to\u00e1n</span>
      <span>{quote.total.toLocaleString("vi-VN")} VN\u0110</span>
    </div>
  </div>
)
`, "utf8");
console.log("OK PriceBreakdownCard.tsx");
