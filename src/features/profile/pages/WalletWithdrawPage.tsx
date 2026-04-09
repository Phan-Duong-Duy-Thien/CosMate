import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import { Select } from "antd"
import { VI } from "@/shared/i18n/vi"
import { useWithdraw } from "../hooks/useWithdraw"
import { BANK_LIST } from "@/shared/constants/bankList"

export default function WalletWithdrawPage() {
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
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {VI.profile.wallet.withdrawTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {VI.profile.wallet.withdrawDescription}
          </p>

          <div className="mt-6 space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {VI.profile.wallet.withdrawAmountLabel}
              </label>
              <Input
                type="number"
                min={1}
                placeholder={VI.profile.wallet.withdrawAmountPlaceholder}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Bank Account Number Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {VI.profile.wallet.withdrawBankAccountLabel}
              </label>
              <Input
                type="text"
                placeholder={VI.profile.wallet.withdrawBankAccountPlaceholder}
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Bank Name Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {VI.profile.wallet.withdrawBankNameLabel}
              </label>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={VI.profile.wallet.withdrawBankNamePlaceholder}
                value={bankName || undefined}
                onChange={(value) => setBankName(value)}
                className="w-full"
                options={BANK_LIST.map((bank) => ({
                  value: bank,
                  label: bank,
                }))}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                  className="min-w-32"
                >
                  {loading ? VI.profile.wallet.withdrawProcessing : VI.profile.wallet.withdrawSubmit}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
