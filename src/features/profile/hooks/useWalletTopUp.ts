import { useState, useCallback } from "react"
import { message } from "antd"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { VI } from "@/shared/i18n/vi"
import * as walletService from "../services/wallet.service"

export type PaymentMethod = "MOMO" | "VNPAY"

interface UseWalletTopUpResult {
  // Form state
  amount: string
  paymentMethod: PaymentMethod | null

  // UI state
  loading: boolean
  error: string | null

  // Setters
  setAmount: (value: string) => void
  setPaymentMethod: (method: PaymentMethod | null) => void

  // Actions
  handleSubmit: () => Promise<void>
}

export function useWalletTopUp(): UseWalletTopUpResult {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    // Validate amount
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      message.error(VI.wallet.invalidAmount)
      return
    }

    // Validate payment method
    if (!paymentMethod) {
      message.error(VI.wallet.selectPaymentMethod)
      return
    }

    // Get user ID
    const userId = getUserId()
    if (!userId) {
      message.error(VI.profile.messages.loginRequired)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (paymentMethod === "MOMO") {
        await walletService.topUpWithMomo(userId, numAmount)
      } else {
        await walletService.topUpWithVnpay(userId, numAmount)
      }
    } catch (err) {
      console.error("Top-up failed:", err)
      const axiosErr = err as { code?: string; message?: string }
      if (axiosErr.code === "ECONNABORTED" || axiosErr.message?.includes("timeout")) {
        setError("Yêu cầu thanh toán đang xử lý. Vui lòng chờ hoặc kiểm tra lại số dư ví sau vài phút.")
        message.error("Yêu cầu thanh toán đang xử lý. Vui lòng chờ hoặc kiểm tra lại số dư ví sau vài phút.")
      } else {
        setError(VI.wallet.error)
        message.error(VI.wallet.error)
      }
    } finally {
      setLoading(false)
    }
  }, [amount, paymentMethod])

  return {
    amount,
    paymentMethod,
    loading,
    error,
    setAmount,
    setPaymentMethod,
    handleSubmit,
  }
}
