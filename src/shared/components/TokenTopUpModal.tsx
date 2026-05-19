import { Modal, Radio, Select, message } from "antd"
import { useMemo, useState } from "react"

import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { initiateTokenPurchase } from "@/features/profile/services/tokenPurchase.service"

export type TokenTopUpPaymentMethod = "VNPAY" | "MOMO" | "WALLET"

interface TokenTopUpModalProps {
  open: boolean
  onClose: () => void
}

const PACKAGES = [
  { id: 1, label: "50 xu", value: 50 },
  { id: 2, label: "100 xu", value: 100 },
  { id: 3, label: "300 xu", value: 300 },
]

export function TokenTopUpModal({ open, onClose }: TokenTopUpModalProps) {
  const [planId, setPlanId] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<TokenTopUpPaymentMethod>("VNPAY")
  const [loading, setLoading] = useState(false)
  const { tokenBalance, setTokenBalance } = useUserProfile()

  const selectedPlan = useMemo(() => PACKAGES.find((p) => p.id === planId) ?? PACKAGES[0], [planId])

  const handleSubmit = async () => {
    const userId = getUserId()
    if (!userId) {
      message.error("Vui lòng đăng nhập để nạp Token")
      return
    }

    setLoading(true)
    try {
      const result = await initiateTokenPurchase({ planId, paymentMethod })
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
        return
      }

      const nextBalance = (tokenBalance ?? 0) + selectedPlan.value
      setTokenBalance(nextBalance)
      window.dispatchEvent(new Event("token:changed"))
      message.success("Nạp Token thành công!")
      onClose()
    } catch (error) {
      message.error((error as Error)?.message || "Nạp Token thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} confirmLoading={loading} title="Nạp Token AI">
      <div className="space-y-4">
        <Select value={planId} onChange={setPlanId} options={PACKAGES.map((p) => ({ value: p.id, label: p.label }))} className="w-full" />
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="grid gap-2">
          <Radio value="VNPAY">VNPay</Radio>
          <Radio value="MOMO">MoMo</Radio>
          <Radio value="WALLET">Ví CosMate</Radio>
        </Radio.Group>
      </div>
    </Modal>
  )
}
