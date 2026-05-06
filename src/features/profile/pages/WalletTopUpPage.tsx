import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import { VI } from "@/shared/i18n/vi"
import { useWalletTopUp, type PaymentMethod } from "../hooks/useWalletTopUp"
import { useSearchParams } from "react-router-dom"

export default function WalletTopUpPage() {
  const [searchParams] = useSearchParams()
  const {
    amount,
    paymentMethod,
    loading,
    setAmount,
    setPaymentMethod,
    handleSubmit,
  } = useWalletTopUp()

  const redirectUrl = searchParams.get("redirect") || undefined

  const isSubmitDisabled = loading || !amount || !paymentMethod

  const paymentMethods: { value: PaymentMethod; label: string; desc: string; icon: string; color: string; bgColor: string }[] = [
    { value: 'MOMO', label: VI.wallet.momo, desc: VI.wallet.momoDesc, icon: '🔴', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { value: 'VNPAY', label: VI.wallet.vnpay, desc: VI.wallet.vnpayDesc, icon: '💳', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ]

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-wallet-from via-wallet-via to-wallet-to px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {VI.wallet.topUpTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {VI.wallet.topUpDescription}
          </p>

          <div className="mt-6 space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {VI.wallet.amount}
              </label>
              <Input
                type="number"
                min={1}
                placeholder={VI.wallet.amountPlaceholder}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                {VI.wallet.paymentMethodLabel}
              </label>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                      paymentMethod === method.value
                        ? `border-pink-400 ${method.bgColor} shadow-md`
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="peer sr-only"
                    />

                    {/* Icon */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-200 group-hover:scale-110 ${
                      paymentMethod === method.value ? method.bgColor : 'bg-slate-100'
                    }`}>
                      {method.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className={`font-semibold transition-colors ${
                        paymentMethod === method.value ? method.color : 'text-slate-900'
                      }`}>
                        {method.label}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">{method.desc}</p>
                    </div>

                    {/* Radio indicator */}
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      paymentMethod === method.value
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {paymentMethod === method.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <div className="flex justify-end">
                <Button
                  type="button"
                  disabled={isSubmitDisabled}
                  onClick={() => handleSubmit(redirectUrl)}
                  className="min-w-32"
                >
                  {loading ? VI.wallet.processing : VI.wallet.submit}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
