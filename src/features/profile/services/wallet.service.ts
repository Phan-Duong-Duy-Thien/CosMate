import * as walletApi from "../api/wallet.api"
import { PAYMENT_RETURN_URLS } from "@/features/order/utils/paymentReturnUrls"
import type { WalletInfo, WalletTransaction } from "../types"

export async function fetchWalletInfo(userId: number): Promise<WalletInfo> {
  const response = await walletApi.getWalletInfo(userId)
  if (response.code === 0) return response.result
  throw new Error(response.message || "Failed to fetch wallet info")
}

export async function fetchWalletTransactions(userId: number): Promise<WalletTransaction[]> {
  const response = await walletApi.getWalletTransactions(userId)
  if (response.code === 0) return response.result
  throw new Error(response.message || "Failed to fetch wallet transactions")
}

export async function topUpWithMomo(userId: number, amount: number, redirectUrl?: string): Promise<void> {
  let returnUrl = PAYMENT_RETURN_URLS.MOMO
  if (redirectUrl) {
    const separator = returnUrl.includes("?") ? "&" : "?"
    returnUrl += `${separator}redirect=${encodeURIComponent(redirectUrl)}`
  }
  const response = await walletApi.createMomoTopUp(userId, amount, returnUrl)
  if (response.code === 0 && response.result?.paymentUrl) {
    window.location.href = response.result.paymentUrl
    return
  }
  throw new Error(response.message || "Payment creation failed")
}

export async function topUpWithVnpay(userId: number, amount: number, redirectUrl?: string): Promise<void> {
  let returnUrl = PAYMENT_RETURN_URLS.VNPAY
  if (redirectUrl) {
    const separator = returnUrl.includes("?") ? "&" : "?"
    returnUrl += `${separator}redirect=${encodeURIComponent(redirectUrl)}`
  }
  const response = await walletApi.createVnpayTopUp(userId, amount, returnUrl)
  if (response.code === 0 && response.result?.paymentUrl) {
    window.location.href = response.result.paymentUrl
    return
  }
  throw new Error(response.message || "Payment creation failed")
}
