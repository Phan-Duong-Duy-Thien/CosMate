import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import { VI } from "@/shared/i18n/vi"

export default function WalletTopUpPage() {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{VI.profile.wallet.topup}</h1>
          <p className="mt-3 text-sm text-slate-600">{VI.profile.wallet.topupPlaceholder}</p>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {VI.profile.wallet.amount}
            </label>
            <Input placeholder={VI.profile.wallet.amountPlaceholder} />
            <div className="pt-3">
              <div className="flex justify-end">
                <Button type="button" disabled className="min-w-32">
                  {VI.profile.wallet.submit}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
