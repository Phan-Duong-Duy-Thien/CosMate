/**
 * Checkout Review Page
 * Displays order summary, address selection, and payment method selection
 */
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { useCheckoutReview } from '../hooks/useCheckoutReview';
import type { PaymentMethod } from '../types';
import { message } from 'antd';
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react';

export default function CheckoutReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    addresses,
    draft,
    costume,
    userId,
    selectedAddressId,
    policyAccepted,
    paymentMethod,
    walletBalance,
    isLoadingWallet,
    isLoading,
    isSubmitting,
    error,
    computed,
    setSelectedAddressId,
    setPolicyAccepted,
    setPaymentMethod,
    submitOrder,
    navigateToTopUp,
  } = useCheckoutReview(navigate);

  // Helper to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Show success toast when returning from top-up
  useEffect(() => {
    if (searchParams.get('topup') === 'success') {
      message.success(VI.wallet.topUpSuccessResume);
      const url = new URL(window.location.href);
      url.searchParams.delete('topup');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, []);

  // Check if wallet has insufficient balance
  const isWalletInsufficient = paymentMethod === 'WALLET' &&
    walletBalance !== null &&
    computed !== null &&
    walletBalance < computed.totalToPay;

  // Calculate missing amount
  const missingAmount = (paymentMethod === 'WALLET' && computed && walletBalance !== null)
    ? computed.totalToPay - walletBalance
    : 0;

  // Determine if submit should be disabled due to wallet
  const isWalletDisabled = paymentMethod === 'WALLET' && (
    isLoadingWallet ||
    walletBalance === null ||
    isWalletInsufficient
  );

  // No draft - show empty state
  if (!isLoading && !draft) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-[1.3rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-8 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.4)]">
            <div className="mb-4 text-5xl">📦</div>
            <h2 className="text-xl font-extrabold text-indigo-950">
              {VI.checkout.messages.noDraft}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Vui lòng chọn trang phục và thông tin thuê trước khi tiếp tục.
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[7px_7px_0_0_#1e1b4b]"
              onClick={() => navigate('/costumes')}
            >
              {VI.checkout.actions.backToCostumes}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-[1.3rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-8 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.4)]">
            <div className="animate-pulse">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-pink-300 border-t-pink-500"></div>
              <p className="mt-4 text-sm text-slate-500">{VI.common.status.loading}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-[1.3rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-8 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.4)]">
            <div className="mb-4 text-5xl">🔒</div>
            <h2 className="text-xl font-extrabold text-indigo-950">
              Vui lòng đăng nhập
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Bạn cần đăng nhập để tiếp tục thanh toán.
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[7px_7px_0_0_#1e1b4b]"
              onClick={() => navigate(`/login?returnTo=${encodeURIComponent('/rent/checkout')}`)}
            >
              {VI.common.actions.login}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const paymentMethods: { value: PaymentMethod; label: string; desc: string; icon: string; color: string; bgColor: string }[] = [
    { value: 'MOMO', label: VI.checkout.payment.momo, desc: VI.checkout.payment.momoDesc, icon: '🔴', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { value: 'VNPAY', label: VI.checkout.payment.vnpay, desc: VI.checkout.payment.vnpayDesc, icon: '💳', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'WALLET', label: VI.checkout.payment.wallet, desc: VI.checkout.payment.walletDesc, icon: '👛', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
      <div className="mx-auto w-full max-w-[min(1300px,100%)] px-4 pt-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-indigo-800/60">
            CosMate &gt; Thuê đồ Cosplay &gt; {VI.checkout.page.title}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-indigo-950">
            {VI.checkout.page.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {VI.checkout.page.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl border-[3px] border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          {/* Left Column - Address & Order Summary */}
          <div className="space-y-6">
            {/* Address Selection */}
            <div className="rounded-[1.35rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-5 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
              <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-indigo-950">
                <MapPin className="h-5 w-5" />
                {VI.checkout.address.title}
              </h2>

              {addresses.length === 0 ? (
                <div className="mt-4 rounded-xl border-[3px] border-dashed border-indigo-950/25 p-6 text-center">
                  <p className="text-sm text-slate-500">{VI.checkout.address.empty}</p>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-bold text-white shadow-[5px_5px_0_0_#1e1b4b]"
                    onClick={() => navigate('/profile/addresses/new?returnTo=/rent/checkout')}
                  >
                    {VI.checkout.address.addNew}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border-[3px] p-4 transition-all ${
                        selectedAddressId === address.id
                          ? 'border-indigo-950 bg-pink-100 shadow-[5px_5px_0_0_rgba(30,27,75,0.28)]'
                          : 'border-indigo-950/15 bg-white hover:border-indigo-950/35'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id ?? null)}
                        className="mt-1 h-4 w-4 text-pink-500 focus:ring-pink-200"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{address.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {address.address}, {address.district}, {address.city}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-[1.35rem] border-[4px] border-indigo-950 bg-white p-5 shadow-[10px_10px_0_0_rgba(30,27,75,0.3)]">
              <h2 className="text-lg font-extrabold text-indigo-950">
                {VI.checkout.summary.title}
              </h2>

              {draft && costume && (
                <div className="mt-4 space-y-4">
                  {/* Costume Info */}
                  <div className="flex items-center gap-4 rounded-xl border-[3px] border-indigo-950/15 bg-[#fffbeb] p-4">
                    {costume.imageUrls?.[0] ? (
                      <img
                        src={costume.imageUrls[0]}
                        alt={costume.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                        👗
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{costume.name}</p>
                      <p className="text-sm text-slate-500">
                        {VI.checkout.summary.rentalDays}: {draft.rentDay} ngày | {VI.checkout.summary.pricePerDay}: {costume.pricePerDay.toLocaleString('vi-VN')}VNĐ
                      </p>
                      <p className="text-sm text-slate-500">
                        {VI.checkout.summary.startDate}: {draft.rentStart ? (() => {
                          const [y, m, d] = draft.rentStart.split('-')
                          return `${d}/${m}/${y}`
                        })() : ''}
                      </p>
                    </div>
                  </div>

                  {/* Rental Option */}
                  <div className="flex items-center justify-between rounded-xl border-[2px] border-indigo-950/15 px-4 py-3">
                    <span className="text-sm text-slate-600">{VI.checkout.summary.rentalOption}</span>
                    <span className="font-medium text-slate-900">
                      {computed?.selectedRentalOption
                        ? `${computed.selectedRentalOption.name} (+${computed.rentalOptionPrice.toLocaleString('vi-VN')}VNĐ)`
                        : VI.checkout.summary.noRentalOption}
                    </span>
                  </div>

                  {/* Accessories */}
                  <div className="rounded-xl border-[2px] border-indigo-950/15 px-4 py-3">
                    <div className="mb-2 text-sm text-slate-600">{VI.checkout.summary.accessories}</div>
                    {computed?.selectedAccessories && computed.selectedAccessories.length > 0 ? (
                      <div className="space-y-2">
                        {computed.selectedAccessories.map((acc) => (
                          <div key={acc.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">
                              {acc.name}
                              {acc.isRequired && (
                                <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-600">
                                  {VI.checkout.summary.required}
                                </span>
                              )}
                            </span>
                            <span className="font-medium text-slate-900">+{acc.price.toLocaleString('vi-VN')}VNĐ</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">{VI.checkout.summary.noAccessories}</p>
                    )}
                  </div>

                  {/* Surcharges (always included) */}
                  {costume.surcharges && costume.surcharges.length > 0 && (
                    <div className="rounded-xl border-[2px] border-indigo-950/15 px-4 py-3">
                      <div className="mb-2 text-sm text-slate-600">
                        {VI.checkout.summary.surcharges}{' '}
                        <span className="text-xs text-slate-400">{VI.checkout.summary.surchargesNote}</span>
                      </div>
                      <div className="space-y-2">
                        {costume.surcharges.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">{s.name}</span>
                            <span className="font-medium text-slate-900">+{s.price.toLocaleString('vi-VN')}VNĐ</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment & Submit */}
          <div className="space-y-6 lg:sticky lg:top-[84px] lg:self-start">
            {/* Price Breakdown */}
            {computed && (
              <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[9px_9px_0_0_rgba(30,27,75,0.32)]">
                <h3 className="text-sm font-extrabold text-indigo-950">{VI.checkout.summary.totalToPay}</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{VI.checkout.summary.baseRent} ({draft?.rentDay} ngày)</span>
                    <span className="font-semibold text-slate-900">{computed.baseRent.toLocaleString('vi-VN')}VNĐ</span>
                  </div>
                  {computed.rentalOptionPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span>{VI.checkout.summary.rentalOptionPrice}</span>
                      <span className="font-semibold text-slate-900">+{computed.rentalOptionPrice.toLocaleString('vi-VN')}VNĐ</span>
                    </div>
                  )}
                  {computed.accessoriesTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span>{VI.checkout.summary.accessoriesTotal}</span>
                      <span className="font-semibold text-slate-900">+{computed.accessoriesTotal.toLocaleString('vi-VN')}VNĐ</span>
                    </div>
                  )}
                  {computed.surchargesTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span>{VI.checkout.summary.surchargesTotal}</span>
                      <span className="font-semibold text-slate-900">+{computed.surchargesTotal.toLocaleString('vi-VN')}VNĐ</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>{VI.checkout.summary.deposit}</span>
                    <span className="font-semibold text-slate-900">{computed.deposit.toLocaleString('vi-VN')}VNĐ</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t-[3px] border-dashed border-indigo-950/25 pt-3 text-base font-extrabold text-pink-600">
                  <span>{VI.checkout.summary.total}</span>
                  <span>{computed.totalToPay.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-white p-5 shadow-[9px_9px_0_0_rgba(30,27,75,0.28)]">
              <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-indigo-950">
                <CreditCard className="h-5 w-5" />
                {VI.checkout.payment.title}
              </h2>

              <div className="mt-4 space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-[3px] p-4 transition-all ${
                      paymentMethod === method.value
                        ? 'border-indigo-950 bg-pink-100 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]'
                        : 'border-indigo-950/15 bg-white hover:border-indigo-950/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-200"
                    />
                    <span className="font-medium text-slate-900">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Wallet balance info - shown immediately after payment options */}
              {paymentMethod === 'WALLET' && (
                <div className="mt-4">
                  {isLoadingWallet && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-pink-300 border-t-pink-500" />
                    </div>
                  )}
                  {!isLoadingWallet && isWalletInsufficient && (
                    <div className="rounded-xl border-[3px] border-amber-300 bg-linear-to-r from-amber-50 to-orange-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">⚠️</div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="text-sm font-semibold text-amber-800 leading-tight">
                            {VI.wallet.checkoutValidation.insufficientTitle}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-amber-700">
                            <p>
                              {VI.wallet.checkoutValidation.balanceLabel}: <span className="font-semibold">{formatCurrency(walletBalance ?? 0)}</span>
                            </p>
                            <p>
                              {VI.wallet.checkoutValidation.missingLabel}: <span className="font-semibold text-orange-600">{formatCurrency(missingAmount)}</span>
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="default"
                              size="sm"
                              className="rounded-xl border-[2px] border-amber-800 bg-amber-500 text-white hover:bg-amber-600"
                              onClick={navigateToTopUp}
                            >
                              {VI.wallet.checkoutValidation.topUpCta}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isLoadingWallet && !isWalletInsufficient && walletBalance !== null && (
                    <div className="rounded-xl border-[3px] border-green-300 bg-linear-to-r from-green-50 to-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg">👛</div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">{VI.wallet.checkoutValidation.payWithWalletNote}</p>
                          <p className="text-lg font-bold text-green-700">{formatCurrency(walletBalance)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Policy Checkbox */}
            <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-white p-5 shadow-[9px_9px_0_0_rgba(30,27,75,0.2)]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-indigo-950 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-900">
                <ShieldCheck className="h-4 w-4" />
                Bảo mật thanh toán
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-pink-500 focus:ring-pink-200"
                />
                <span className="text-sm text-slate-600">
                  {VI.checkout.policy.label}
                </span>
              </label>
              {!policyAccepted && !isSubmitting && (
                <p className="mt-2 text-xs text-red-500">
                  {VI.checkout.policy.required}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[7px_7px_0_0_#1e1b4b]"
              disabled={!policyAccepted || isSubmitting || !selectedAddressId || isWalletDisabled}
              onClick={submitOrder}
            >
              {isSubmitting ? VI.checkout.actions.submitting : VI.checkout.actions.submit}
            </Button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/costumes"
            className="inline-flex rounded-full border-2 border-indigo-950/20 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 decoration-1 underline-offset-2 transition hover:border-indigo-950/35 hover:bg-indigo-50 hover:underline"
          >
            {VI.checkout.actions.backToCostumes}
          </Link>
        </div>
      </div>
    </section>
  );
}
