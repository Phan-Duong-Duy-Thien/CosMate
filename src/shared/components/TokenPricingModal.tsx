import { Modal } from "antd"
import { Diamond, Flame, Sparkles } from "lucide-react"

interface TokenPricingModalProps {
  open: boolean
  role?: "cosplayer" | "provider"
  onCancel: () => void
  onPayVnpay: (amount: number, planId: string) => void
  onPayMomo: (amount: number, planId: string) => void
  onPayWallet: (amount: number, planId: string) => void
  loadingMethod?: "vnpay" | "momo" | "wallet" | null
}

const plans = [
  { id: "starter-20k", name: "Gói Cứu Net", coins: 200, price: 20000, bonus: null, bg: "bg-[#FFFBEB]" },
  { id: "hot-50k", name: "Gói Phổ Biến", coins: 600, price: 50000, bonus: "+20%", bg: "bg-[#FCE7F3]", featured: true },
  { id: "pro-100k", name: "Gói Dân Chơi", coins: 1500, price: 100000, bonus: "+50%", bg: "bg-[#DBEAFE]" },
  { id: "elite-500k", name: "Gói Phú Hào", coins: 10000, price: 500000, bonus: "+100%", bg: "bg-[#E9D5FF]", icon: Diamond },
]

export function TokenPricingModal({ open, role = "cosplayer", onCancel, onPayVnpay, onPayMomo, onPayWallet, loadingMethod }: TokenPricingModalProps) {
  const greeting = role === "provider" ? "Xin chào Nhà Cung Cấp!" : "Xin chào Cosplayer!"
  const subtitle = role === "provider" ? "Nạp xu để mở khóa tính năng AI cho gian hàng và tối ưu vận hành." : "Nạp xu để mở khóa toàn bộ tính năng AI và giữ flow sáng tạo không bị gián đoạn."

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={920} classNames={{ header: "!border-b-0", body: "!pt-0" }} styles={{ content: { border: "4px solid #1e1b4b", borderRadius: 28, boxShadow: "12px 12px 0 0 #1e1b4b", background: "linear-gradient(180deg,#fff7fb 0%,#fffbeb 100%)" } }} title={<div className="space-y-1"><p className="text-xs font-black uppercase tracking-[0.22em] text-cosmate-pink">Bảng Giá Nạp Token</p><h2 className="text-2xl font-black text-indigo-950">{greeting}</h2><p className="text-sm font-medium text-slate-700">{subtitle}</p></div>}>
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.id} className={`relative overflow-hidden rounded-3xl border-[4px] border-indigo-950 ${plan.bg} p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)] transition hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.35)]`}>
              {plan.featured && <div className="absolute right-[-18px] top-5 rotate-12 rounded-full border-[3px] border-indigo-950 bg-amber-300 px-4 py-1 text-[11px] font-black text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.35)]">BÁN CHẠY</div>}
              {Icon ? <Icon className="absolute right-4 top-4 h-8 w-8 text-indigo-950/80" /> : null}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-indigo-950">{plan.name}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">🪙 {plan.coins} Xu {plan.bonus ? <span className="ml-1">(Đã tặng thêm {plan.bonus})</span> : null}</p>
                </div>
                {plan.featured ? <Sparkles className="h-6 w-6 text-pink-600" /> : <Flame className="h-6 w-6 text-orange-500" />}
              </div>
              <div className="mt-4 rounded-2xl border-[3px] border-indigo-950 bg-white/70 px-3 py-2 font-black text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]">{plan.price.toLocaleString("vi-VN")} VNĐ</div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => onPayVnpay(plan.price, plan.id)} className="flex-1 rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-300 px-3 py-2 text-sm font-black text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:-translate-y-0.5 disabled:opacity-60" disabled={loadingMethod !== null}>{loadingMethod === "vnpay" ? "Đang tạo..." : "VNPay"}</button>
                <button type="button" onClick={() => onPayMomo(plan.price, plan.id)} className="flex-1 rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3 py-2 text-sm font-black text-white shadow-[4px_4px_0_0_#1e1b4b] hover:-translate-y-0.5 disabled:opacity-60" disabled={loadingMethod !== null}>{loadingMethod === "momo" ? "Đang tạo..." : "MoMo"}</button>
                <button type="button" onClick={() => onPayWallet(plan.price, plan.id)} className="flex-1 rounded-2xl border-[3px] border-indigo-950 bg-white px-3 py-2 text-sm font-black text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:-translate-y-0.5 disabled:opacity-60" disabled={loadingMethod !== null}>{loadingMethod === "wallet" ? "Đang xử lý..." : "Ví CosMate"}</button>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
