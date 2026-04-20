/**
 * ExtendRentalModal
 *
 * Modal for extending rental duration of an IN_USE order.
 * Step 1: enter extend days + select payment method
 * Step 2: confirm — calls useExtendOrder which handles payment redirect.
 */
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/shared/components/Dialog';
import { Button } from '@/shared/components/Button';
import type { PaymentMethod } from '@/features/order/utils/paymentReturnUrls';
import { VI } from '@/shared/i18n/vi';
import { cn } from '@/lib/utils';

export interface ExtendRentalModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (extendDays: number, paymentMethod: PaymentMethod) => void;
  loading?: boolean;
}

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  selectedBg: string;
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
];

export function ExtendRentalModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: ExtendRentalModalProps) {
  const [extendDays, setExtendDays] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setExtendDays(1);
      setSelectedPayment(null);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!selectedPayment || extendDays < 1 || loading) return;
    onConfirm(extendDays, selectedPayment);
  };

  const isValid = extendDays >= 1 && selectedPayment !== null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" onClose={onClose}>
        {/* Title */}
        <div className="pr-6">
          <h2 className="text-lg font-bold text-slate-900">
            {VI.order.extend.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {VI.order.extend.subtitle}
          </p>
        </div>

        {/* Extend days input */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {VI.order.extend.extendDaysLabel}
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={extendDays}
            onChange={(e) => setExtendDays(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2"
          />
          {extendDays < 1 && (
            <p className="mt-1 text-xs text-red-500">
              {VI.order.extend.minDaysError}
            </p>
          )}
        </div>

        {/* Payment method selection */}
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {VI.order.extend.paymentMethodLabel}
          </label>
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = selectedPayment === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedPayment(option.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                  isSelected
                    ? option.selectedBg
                    : 'border-slate-100 bg-white hover:border-slate-200'
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
                  <p
                    className={cn(
                      'font-semibold',
                      isSelected ? option.color : 'text-slate-800'
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{option.desc}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
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
            disabled={!isValid || loading}
            loading={loading}
            onClick={handleConfirm}
          >
            {loading
              ? VI.order.extend.btnProcessing
              : VI.order.extend.btnConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
