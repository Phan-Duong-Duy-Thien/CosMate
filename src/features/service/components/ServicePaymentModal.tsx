/**
 * ServicePaymentModal
 *
 * Reusable payment method selection modal.
 * Used for service order confirm+pay and retry-payment flows.
 */
import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/shared/components/Dialog'
import { Button } from '@/shared/components/Button'
import type { PaymentMethod } from '@/features/order/utils/paymentReturnUrls'
import { VI } from '@/shared/i18n/vi'
import { cn } from '@/lib/utils'

export interface ServicePaymentModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (paymentMethod: PaymentMethod) => void
  loading?: boolean
  totalAmount?: number
}

const PAYMENT_OPTIONS: {
  value: PaymentMethod
  label: string
  desc: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  selectedBg: string
}[] = [
  {
    value: 'MOMO',
    label: VI.checkout.payment.momo,
    desc: VI.checkout.payment.momoDesc,
    icon: '🔴',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    selectedBg: 'border-pink-400 bg-pink-50',
  },
  {
    value: 'VNPAY',
    label: VI.checkout.payment.vnpay,
    desc: VI.checkout.payment.vnpayDesc,
    icon: '💳',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    selectedBg: 'border-blue-400 bg-blue-50',
  },
  {
    value: 'WALLET',
    label: VI.checkout.payment.wallet,
    desc: VI.checkout.payment.walletDesc,
    icon: '👛',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    selectedBg: 'border-amber-400 bg-amber-50',
  },
]

export function ServicePaymentModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  totalAmount,
}: ServicePaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null)

  // Reset selection when modal closes
  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  const handleConfirm = () => {
    if (!selected || loading) return
    onConfirm(selected)
  }

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onClose={onClose}
      >
        {/* Title */}
        <div className="pr-6">
          <h2 className="text-lg font-bold text-slate-900">
            {VI.profile.servicePayment.modalTitle}
          </h2>
          {totalAmount != null && (
            <p className="mt-1 text-sm text-slate-500">
              {VI.profile.servicePayment.totalLabel}:{' '}
              <span className="font-semibold text-purple-600">
                {formatCurrency(totalAmount)}
              </span>
            </p>
          )}
        </div>

        {/* Payment options */}
        <div className="mt-4 space-y-2">
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                  isSelected
                    ? option.selectedBg
                    : `border-slate-100 bg-white hover:${option.bgColor} hover:border-slate-200`
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    isSelected ? option.bgColor : 'bg-slate-50'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className={cn('font-semibold', isSelected ? option.color : 'text-slate-800')}>
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{option.desc}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                    isSelected
                      ? cn('border-purple-500 bg-purple-500')
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {VI.common.actions.cancel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selected || loading}
            loading={loading}
            onClick={handleConfirm}
          >
            {loading ? VI.profile.servicePayment.btnProcessing : VI.profile.servicePayment.btnConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
