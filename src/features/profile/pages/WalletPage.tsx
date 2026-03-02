import { useNavigate } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

export default function WalletPage() {
  const navigate = useNavigate()

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{VI.profile.wallet.title}</h1>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">{VI.profile.wallet.balance}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">0 ₫</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={() => navigate("/profile/wallet/topup")}>
              {VI.profile.wallet.topup}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
