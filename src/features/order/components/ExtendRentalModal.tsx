/**
 * ExtendRentalModal
 *
 * Modal for extending rental duration of an IN_USE order.
 * Step 1: enter extend days + select payment method
 * Step 2: confirm — calls useExtendOrder which handles payment redirect.
 */
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/shared/components/Dialog';
import type { PaymentMethod } from '@/features/order/utils/paymentReturnUrls';
import { VI } from '@/shared/i18n/vi';
import { cn } from '@/lib/utils';
import { getUserId } from '@/features/auth/services/tokenStorage';

import { useCostumeBasicInfo } from '@/features/order/hooks/useCostumeBasicInfo';

export interface ExtendRentalModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (extendDays: number, paymentMethod: PaymentMethod) => void;
  loading?: boolean;
  pricePerDay?: number;
  costumeId?: number | null;
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
  pricePerDay,
  costumeId,
}: ExtendRentalModalProps) {
  const [extendDays, setExtendDays] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const { costume: costumeInfo } = useCostumeBasicInfo(costumeId);
  const activePricePerDay = pricePerDay ?? costumeInfo?.pricePerDay;

  const formatVnd = (amount: number) => {
    return `${amount.toLocaleString('vi-VN')} ₫`;
  };

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
    <Dialog open={open} onOpenChange={onClose} overlayClassName="!z-[1100]">
      <DialogContent className="max-w-md rounded-[24px] border-[4px] border-indigo-950 bg-[#fffbeb] p-6 shadow-[8px_8px_0_0_rgba(30,27,75,0.35)]" onClose={onClose}>
        {/* Title */}
        <div className="pr-6">
          <h2 className="text-xl font-black text-indigo-950">
            {VI.order.extend.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {VI.order.extend.subtitle}
          </p>
        </div>

        {/* Extend days input */}
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-bold text-indigo-950">
            {VI.order.extend.extendDaysLabel}
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={extendDays}
            onChange={(e) => setExtendDays(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-11 w-full rounded-xl border-[3px] border-indigo-950 bg-white px-4 text-sm font-bold text-slate-800 shadow-[3px_3px_0_0_rgba(30,27,75,0.2)] outline-none transition-all focus:border-pink-500 focus:shadow-[3px_3px_0_0_#ec4899]"
          />
          {extendDays < 1 && (
            <p className="mt-1 text-xs text-red-500">
              {VI.order.extend.minDaysError}
            </p>
          )}
        </div>

        {/* Cost breakdown */}
        {activePricePerDay !== undefined && (() => {
          const rentDiscount = costumeInfo?.rentDiscount ?? 0;
          const discountedPrice = activePricePerDay * (1 - rentDiscount / 100);
          const totalExtendPrice = extendDays > 0 
            ? activePricePerDay + (extendDays - 1) * discountedPrice 
            : 0;

          return (
            <div className="mt-4 rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-br from-pink-50/50 via-white to-violet-50/50 p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Đơn giá thuê gốc:</span>
                <span className="text-slate-800">{formatVnd(activePricePerDay)}/ngày</span>
              </div>
              {rentDiscount > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-green-600">
                    <span>Ưu đãi giảm giá thuê:</span>
                    <span>Giảm {rentDiscount}% từ ngày thứ 2</span>
                  </div>
                  {extendDays > 1 && (
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pl-3">
                      <span>• Ngày 1:</span>
                      <span>{formatVnd(activePricePerDay)}</span>
                    </div>
                  )}
                  {extendDays > 1 && (
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pl-3">
                      <span>• Từ ngày thứ 2 ({extendDays - 1} ngày):</span>
                      <span>{formatVnd(discountedPrice)}/ngày</span>
                    </div>
                  )}
                </>
              )}
              <div className="mt-2 flex items-center justify-between border-t-[2px] border-dashed border-indigo-950/20 pt-2 text-sm font-black text-indigo-950">
                <span>Phí gia hạn tạm tính:</span>
                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent text-base">
                  {formatVnd(totalExtendPrice)}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Payment method selection */}
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-bold text-indigo-950">
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
                  'flex w-full items-center gap-3 rounded-2xl border-[3px] border-indigo-950 p-3.5 text-left transition-all hover:-translate-y-0.5 active:translate-y-px',
                  isSelected
                    ? 'bg-[#fffbeb] shadow-[3px_3px_0_0_#1e1b4b]'
                    : 'bg-white opacity-85 shadow-[1px_1px_0_0_rgba(30,27,75,0.2)] border-indigo-950/20 hover:opacity-100 hover:border-indigo-950/40'
                )}
              >
                {/* Icon */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[2px] border-indigo-950 bg-white shadow-[2px_2px_0_0_rgba(30,27,75,0.25)]"
                >
                  <span className="text-2xl">{option.icon}</span>
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-indigo-950">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500 leading-normal">{option.desc}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[2px] border-indigo-950 bg-white',
                    isSelected && 'bg-pink-500'
                  )}
                >
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-white px-5 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          >
            {VI.common.actions.cancel}
          </button>
          <button
            type="button"
            disabled={!isValid || loading}
            onClick={handleConfirm}
            className="group relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-5 text-sm font-extrabold text-white shadow-[4px_4px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1e1b4b] active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                {VI.order.extend.btnProcessing}
              </>
            ) : (
              VI.order.extend.btnConfirm
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

