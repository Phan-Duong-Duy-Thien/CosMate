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
import { getUserId } from '@/features/auth/services/tokenStorage'
import { fetchWalletInfo } from '@/features/profile/services/wallet.service'

export type ServicePaymentLoadingPhase = 'confirm' | 'pay' | null

export interface ServicePaymentModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (paymentMethod: PaymentMethod) => void
  loading?: boolean
  loadingPhase?: ServicePaymentLoadingPhase
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
  loadingPhase = null,
  totalAmount,
}: ServicePaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)

  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  useEffect(() => {
    if (!open || selected !== 'WALLET') {
      setWalletBalance(null)
      setIsLoadingWallet(false)
      return
    }

    const userId = getUserId()
    if (!userId) return

    let cancelled = false
    setIsLoadingWallet(true)
    fetchWalletInfo(userId)
      .then((info) => {
        if (!cancelled) setWalletBalance(info.balance)
      })
      .catch(() => {
        if (!cancelled) setWalletBalance(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWallet(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, selected])

  const handleConfirm = () => {
    if (!selected || loading) return
    onConfirm(selected)
  }

  const isWalletInsufficient =
    selected === 'WALLET' &&
    totalAmount != null &&
    walletBalance !== null &&
    walletBalance < totalAmount

  const loadingLabel =
    loadingPhase === 'confirm'
      ? VI.profile.servicePayment.btnConfirming
      : loadingPhase === 'pay' && selected === 'WALLET'
        ? VI.profile.servicePayment.btnPayingWallet
        : loadingPhase === 'pay'
          ? VI.profile.servicePayment.btnPaying
          : VI.profile.servicePayment.btnProcessing

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)

  const missingAmount =
    selected === 'WALLET' && totalAmount != null && walletBalance !== null
      ? totalAmount - walletBalance
      : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onClose={onClose}
      >
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
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    isSelected ? option.bgColor : 'bg-slate-50'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={cn('font-semibold', isSelected ? option.color : 'text-slate-800')}>
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{option.desc}</p>
                </div>

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

        {selected === 'WALLET' && (
          <div className="mt-3">
            {isLoadingWallet && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-pink-300 border-t-pink-500" />
              </div>
            )}
            {!isLoadingWallet && isWalletInsufficient && (
              <div className="rounded-xl border-[3px] border-amber-300 bg-linear-to-r from-amber-50 to-orange-50 p-4">
                <p className="font-semibold text-amber-800">
                  {VI.wallet.checkoutValidation.insufficientTitle}
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {VI.wallet.checkoutValidation.balanceLabel}:{' '}
                  <span className="font-semibold">{formatCurrency(walletBalance ?? 0)}</span>
                </p>
                <p className="text-sm text-amber-700">
                  {VI.wallet.checkoutValidation.missingLabel}:{' '}
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(missingAmount)}
                  </span>
                </p>
              </div>
            )}
            {!isLoadingWallet && !isWalletInsufficient && walletBalance !== null && (
              <div className="rounded-xl border-[3px] border-green-300 bg-linear-to-r from-green-50 to-emerald-50 p-4">
                <p className="text-sm text-green-700">
                  {VI.wallet.checkoutValidation.payWithWalletNote}
                </p>
                <p className="mt-1 text-lg font-bold text-green-700">
                  {formatCurrency(walletBalance)}
                </p>
              </div>
            )}
            {!isLoadingWallet && walletBalance === null && (
              <p className="text-sm text-red-600">{VI.wallet.walletError}</p>
            )}
          </div>
        )}

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
            disabled={
              !selected ||
              loading ||
              (selected === 'WALLET' &&
                (isLoadingWallet || walletBalance === null || isWalletInsufficient))
            }
            loading={loading}
            onClick={handleConfirm}
          >
            {loading ? loadingLabel : VI.profile.servicePayment.btnConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
