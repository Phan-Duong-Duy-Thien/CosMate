import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Select } from "antd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/shared/components/Input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useWithdraw } from "../hooks/useWithdraw"
import { BANK_LIST } from "@/shared/constants/bankList"

const inputTokenClass = cn(
  "mt-2 h-12 rounded-2xl border-border bg-background text-base font-medium text-foreground shadow-sm",
  "placeholder:text-muted-foreground/80",
  "focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
)

export default function WalletWithdrawPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const walletBase = location.pathname.replace(/\/withdraw\/?$/, "")

  const {
    amount,
    bankAccountNumber,
    bankName,
    loading,
    setAmount,
    setBankAccountNumber,
    setBankName,
    handleSubmit,
  } = useWithdraw()

  const isSubmitDisabled = loading || !amount || !bankAccountNumber || !bankName

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-cosmate-soft-pink/25 via-wallet-from to-wallet-to px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="overflow-hidden border-cosmate-pink/20 shadow-md shadow-cosmate-pink/5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-0.5 shrink-0 rounded-full text-muted-foreground hover:bg-cosmate-soft-pink/40 hover:text-cosmate-pink"
                onClick={() => navigate(walletBase)}
                aria-label={VI.common.actions.back}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {VI.wallet.withdrawTitle}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {VI.wallet.withdrawDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <label
                  htmlFor="wallet-withdraw-amount"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {VI.wallet.withdrawAmountLabel}
                </label>
                <Input
                  id="wallet-withdraw-amount"
                  type="number"
                  min={1}
                  placeholder={VI.wallet.withdrawAmountPlaceholder}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={inputTokenClass}
                />
              </div>

              <Separator className="bg-border" />

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="wallet-withdraw-account"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {VI.wallet.withdrawBankAccountLabel}
                  </label>
                  <Input
                    id="wallet-withdraw-account"
                    type="text"
                    placeholder={VI.wallet.withdrawBankAccountPlaceholder}
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className={inputTokenClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="wallet-withdraw-bank"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {VI.wallet.withdrawBankNameLabel}
                  </label>
                  <div className="[&_.ant-select-selector]:!min-h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!shadow-none">
                    <Select
                      id="wallet-withdraw-bank"
                      showSearch
                      optionFilterProp="label"
                      placeholder={VI.wallet.withdrawBankNamePlaceholder}
                      value={bankName || undefined}
                      onChange={(value) => setBankName(value)}
                      className="w-full"
                      options={BANK_LIST.map((bank) => ({
                        value: bank,
                        label: bank,
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(walletBase)}
                >
                  {VI.common.actions.back}
                </Button>
                <Button
                  type="button"
                  variant="cosmate"
                  className="w-full min-w-[9rem] sm:w-auto"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                >
                  {loading ? VI.wallet.withdrawProcessing : VI.wallet.withdrawSubmit}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
