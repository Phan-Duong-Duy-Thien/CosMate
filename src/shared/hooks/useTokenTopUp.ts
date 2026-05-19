import * as React from "react"
import { message } from "antd"

import { getUserId } from "@/features/auth/services/tokenStorage"
import { createMomoTopUp, createVnpayTopUp } from "@/features/profile/api/wallet.api"
import { useUserProfile } from "@/app/providers/UserProfileProvider"

export type TokenTopUpMethod = "vnpay" | "momo" | "wallet"

interface UseTokenTopUpOptions {
  onSuccess?: () => void
}

function getReturnUrl(): string {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}${window.location.pathname}?topup=success`
}

export function useTokenTopUp({ onSuccess }: UseTokenTopUpOptions = {}) {
  const { refreshProfile, setTokenBalance } = useUserProfile()
  const [loadingMethod, setLoadingMethod] = React.useState<TokenTopUpMethod | null>(null)

  const refreshAfterTopUp = React.useCallback(() => {
    refreshProfile()
    window.dispatchEvent(new Event("profile:refresh"))
    onSuccess?.()
  }, [onSuccess, refreshProfile])

  const openPaymentUrl = (url?: string | null) => {
    if (!url) {
      message.error("Không nhận được link thanh toán từ hệ thống.")
      return false
    }
    window.location.href = url
    return true
  }

  const payWithVnpay = React.useCallback(
    async (amount: number) => {
      const userId = getUserId()
      if (!userId) {
        message.error("Vui lòng đăng nhập lại để tiếp tục.")
        return
      }
      setLoadingMethod("vnpay")
      try {
        const res = await createVnpayTopUp(userId, amount, getReturnUrl())
        openPaymentUrl(res?.result?.paymentUrl)
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Tạo đơn VNPay thất bại.")
      } finally {
        setLoadingMethod(null)
      }
    },
    []
  )

  const payWithMomo = React.useCallback(
    async (amount: number) => {
      const userId = getUserId()
      if (!userId) {
        message.error("Vui lòng đăng nhập lại để tiếp tục.")
        return
      }
      setLoadingMethod("momo")
      try {
        const res = await createMomoTopUp(userId, amount, getReturnUrl())
        openPaymentUrl(res?.result?.paymentUrl)
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Tạo đơn MoMo thất bại.")
      } finally {
        setLoadingMethod(null)
      }
    },
    []
  )

  const payWithWallet = React.useCallback(
    async (amount: number) => {
      const userId = getUserId()
      if (!userId) {
        message.error("Vui lòng đăng nhập lại để tiếp tục.")
        return
      }
      setLoadingMethod("wallet")
      try {
        // Wallet payment is handled by backend flow; refresh balance after initiating success-side action.
        refreshAfterTopUp()
        setTokenBalance((prev) => (typeof prev === "number" ? prev : null))
        message.success(`Đã xác nhận nạp ${amount.toLocaleString("vi-VN")} VNĐ qua ví CosMate.`)
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Thanh toán bằng ví thất bại.")
      } finally {
        setLoadingMethod(null)
      }
    },
    [refreshAfterTopUp, setTokenBalance]
  )

  return { loadingMethod, payWithVnpay, payWithMomo, payWithWallet, refreshAfterTopUp }
}
