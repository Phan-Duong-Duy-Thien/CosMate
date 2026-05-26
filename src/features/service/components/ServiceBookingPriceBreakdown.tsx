import { VI } from '@/shared/i18n/vi'
import {
  computeServiceBookingTotal,
  type ServiceBookingPriceParts,
} from '../utils/computeServiceMinPrice'

export interface ServiceBookingPriceBreakdownProps {
  rentSlotAmount: number
  depositAmount?: number
  equipmentDepreciationCost?: number
  /** Hiển thị gợi ý khi chưa nhập giá */
  showHint?: boolean
}

function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} ₫`
}

function BreakdownRow({
  label,
  value,
  emphasis,
}: {
  label: string
  value: number
  emphasis?: 'total'
}) {
  const hidden = value <= 0 && emphasis !== 'total'
  if (hidden) return null

  return (
    <div
      className={
        emphasis === 'total'
          ? 'flex items-center justify-between border-t border-slate-200 pt-2 mt-2'
          : 'flex items-center justify-between text-sm'
      }
    >
      <span
        className={
          emphasis === 'total'
            ? 'font-semibold text-slate-800'
            : 'text-slate-600'
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis === 'total'
            ? 'text-base font-bold text-pink-600'
            : 'font-medium text-slate-800'
        }
      >
        {formatVnd(value)}
      </span>
    </div>
  )
}

export function ServiceBookingPriceBreakdown({
  rentSlotAmount,
  depositAmount = 0,
  equipmentDepreciationCost = 0,
  showHint = false,
}: ServiceBookingPriceBreakdownProps) {
  const parts: ServiceBookingPriceParts = computeServiceBookingTotal(
    rentSlotAmount,
    equipmentDepreciationCost,
    depositAmount,
  )

  const hasPackageFees = parts.deposit > 0 || parts.equipment > 0

  return (
    <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-pink-700/80">
        {VI.booking.create.priceBreakdownTitle}
      </p>

      {showHint && parts.serviceFee <= 0 ? (
        <p className="mt-2 text-sm text-slate-500">{VI.booking.create.priceBreakdownHint}</p>
      ) : (
        <div className="mt-3 space-y-1.5">
          <BreakdownRow
            label={VI.booking.create.priceBreakdownServiceFee}
            value={parts.serviceFee}
          />
          {hasPackageFees && (
            <>
              <BreakdownRow
                label={VI.booking.create.priceBreakdownDeposit}
                value={parts.deposit}
              />
              <BreakdownRow
                label={VI.booking.create.priceBreakdownEquipment}
                value={parts.equipment}
              />
            </>
          )}
          <BreakdownRow
            label={VI.booking.create.priceBreakdownTotal}
            value={parts.total}
            emphasis="total"
          />
        </div>
      )}

      {hasPackageFees && parts.serviceFee > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {VI.booking.create.priceBreakdownNote}
        </p>
      )}
    </div>
  )
}
