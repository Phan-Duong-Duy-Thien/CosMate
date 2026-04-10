/**
 * Checkout Review Page
 * Displays order summary, address selection, and payment method selection
 */
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { useCheckoutReview } from '../hooks/useCheckoutReview';
import type { PaymentMethod } from '../types';

export default function CheckoutReviewPage() {
  const navigate = useNavigate();
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
  } = useCheckoutReview();

  // Helper to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-8 shadow-sm text-center">
            <div className="mb-4 text-5xl">📦</div>
            <h2 className="text-xl font-semibold text-slate-900">
              {VI.checkout.messages.noDraft}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Vui lòng chọn trang phục và thông tin thuê trước khi tiếp tục.
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-6 rounded-full"
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
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-8 shadow-sm text-center">
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
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-2xl px-4 pt-10">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-8 shadow-sm text-center">
            <div className="mb-4 text-5xl">🔒</div>
            <h2 className="text-xl font-semibold text-slate-900">
              Vui lòng đăng nhập
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Bạn cần đăng nhập để tiếp tục thanh toán.
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-6 rounded-full"
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
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-4xl px-4 pt-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="text-xs text-slate-500">
            CosMate &gt; Thuê đồ Cosplay &gt; {VI.checkout.page.title}
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {VI.checkout.page.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {VI.checkout.page.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Address & Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                {VI.checkout.address.title}
              </h2>

              {addresses.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-500">{VI.checkout.address.empty}</p>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4 rounded-full"
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
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-slate-100 bg-white hover:border-slate-200'
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
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                {VI.checkout.summary.title}
              </h2>

              {draft && costume && (
                <div className="mt-4 space-y-4">
                  {/* Costume Info */}
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
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
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-600">{VI.checkout.summary.rentalOption}</span>
                    <span className="font-medium text-slate-900">
                      {computed?.selectedRentalOption
                        ? `${computed.selectedRentalOption.name} (+${computed.rentalOptionPrice.toLocaleString('vi-VN')}VNĐ)`
                        : VI.checkout.summary.noRentalOption}
                    </span>
                  </div>

                  {/* Accessories */}
                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
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
                    <div className="rounded-2xl border border-slate-100 px-4 py-3">
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
          <div className="space-y-6">
            {/* Price Breakdown */}
            {computed && (
              <div className="rounded-3xl border border-pink-100 bg-white/90 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700">{VI.checkout.summary.totalToPay}</h3>
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
                <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold text-pink-600">
                  <span>{VI.checkout.summary.total}</span>
                  <span>{computed.totalToPay.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                {VI.checkout.payment.title}
              </h2>

              <div className="mt-4 space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                      paymentMethod === method.value
                        ? 'border-pink-300 bg-pink-50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
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
                    <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">⚠️</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-800">
                            {VI.profile.wallet.checkoutValidation.insufficientTitle}
                          </p>
                          <div className="mt-1 space-y-0.5 text-xs text-amber-700">
                            <p>
                              {VI.profile.wallet.checkoutValidation.balanceLabel}: <span className="font-semibold">{formatCurrency(walletBalance ?? 0)}</span>
                            </p>
                            <p>
                              {VI.profile.wallet.checkoutValidation.missingLabel}: <span className="font-semibold text-orange-600">{formatCurrency(missingAmount)}</span>
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="shrink-0 rounded-full bg-amber-500 hover:bg-amber-600"
                          onClick={() => navigate('/profile/wallet/topup')}
                        >
                          {VI.profile.wallet.checkoutValidation.topUpCta}
                        </Button>
                      </div>
                    </div>
                  )}
                  {!isLoadingWallet && !isWalletInsufficient && walletBalance !== null && (
                    <div className="rounded-2xl border border-green-200 bg-linear-to-r from-green-50 to-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg">👛</div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">{VI.profile.wallet.checkoutValidation.payWithWalletNote}</p>
                          <p className="text-lg font-bold text-green-700">{formatCurrency(walletBalance)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Policy Checkbox */}
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
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
              className="w-full rounded-full"
              disabled={!policyAccepted || isSubmitting || !selectedAddressId || isWalletDisabled}
              onClick={submitOrder}
            >
              {isSubmitting ? VI.checkout.actions.submitting : VI.checkout.actions.submit}
            </Button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                to="/costumes"
                className="text-sm text-pink-600 decoration-1 underline-offset-2 hover:underline"
              >
                {VI.checkout.actions.backToCostumes}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
