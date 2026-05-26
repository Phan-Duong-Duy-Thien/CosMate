import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Building2, Check, Smartphone, type LucideIcon } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Input } from "@/shared/components/Input"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useWalletTopUp, type PaymentMethod } from "../hooks/useWalletTopUp"

export default function WalletTopUpPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const walletBase = location.pathname.replace(/\/topup\/?$/, "")

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

  const handleBack = () => {
    if (redirectUrl) {
      navigate(redirectUrl)
      return
    }
    navigate(walletBase)
  }

  const paymentMethods: {
    value: PaymentMethod
    label: string
    desc: string
    Icon: LucideIcon
    color: string
    bgColor: string
    iconWrapClass: string
  }[] = [
    {
      value: "MOMO",
      label: VI.wallet.momo,
      desc: VI.wallet.momoDesc,
      Icon: Smartphone,
      color: "text-cosmate-pink",
      bgColor: "bg-cosmate-soft-pink/55",
      iconWrapClass: "border-cosmate-pink/30 bg-cosmate-soft-pink/50 text-cosmate-pink",
    },
    {
      value: "VNPAY",
      label: VI.wallet.vnpay,
      desc: VI.wallet.vnpayDesc,
      Icon: Building2,
      color: "text-cosmate-ink",
      bgColor: "bg-cosmate-lavender-surface/90",
      iconWrapClass: "border-cosmate-lavender-border bg-cosmate-lavender-surface/80 text-cosmate-ink",
    },
  ]

  return (
    <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Button
                type="button"
                variant="ghost"
                className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border-[2px] border-transparent p-0 text-indigo-900/70 hover:border-indigo-950/20 hover:bg-pink-100 hover:text-indigo-950"
                onClick={handleBack}
                aria-label={VI.common.actions.back}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {VI.wallet.topUpTitle}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {VI.wallet.topUpDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <label
                  htmlFor="wallet-topup-amount"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {VI.wallet.amount}
                </label>
                <Input
                  id="wallet-topup-amount"
                  type="number"
                  min={1}
                  placeholder={VI.wallet.amountPlaceholder}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(
                    "mt-2 h-12 rounded-2xl border-border bg-background text-base font-medium text-foreground shadow-sm",
                    "placeholder:text-muted-foreground/80",
                    "focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                />
              </div>

              <div className="h-px w-full bg-indigo-950/15" aria-hidden />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {VI.wallet.paymentMethodLabel}
                </p>
                <div className="mt-3 grid gap-3">
                  {paymentMethods.map((method) => {
                    const selected = paymentMethod === method.value
                    const Icon = method.Icon
                    return (
                      <label
                        key={method.value}
                        className={cn(
                          "group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200",
                          selected
                            ? cn("border-cosmate-pink/55 shadow-md", method.bgColor)
                            : "border-border bg-card hover:border-cosmate-pink/35 hover:shadow-sm"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={selected}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="peer sr-only"
                        />

                        <span
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-[1.02]",
                            selected ? method.iconWrapClass : "border-border bg-muted/60 text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          <Icon className="h-6 w-6" strokeWidth={2} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block font-semibold transition-colors",
                              selected ? method.color : "text-foreground"
                            )}
                          >
                            {method.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">{method.desc}</span>
                        </span>

                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                            selected
                              ? "border-cosmate-pink bg-cosmate-pink text-primary-foreground shadow-sm"
                              : "border-border bg-muted/30 text-transparent group-hover:border-cosmate-pink/40"
                          )}
                          aria-hidden
                        >
                          {selected ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleBack}
                >
                  {VI.common.actions.back}
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  className="w-full min-w-[9rem] rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105 sm:w-auto"
                  disabled={isSubmitDisabled}
                  onClick={() => handleSubmit(redirectUrl)}
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
