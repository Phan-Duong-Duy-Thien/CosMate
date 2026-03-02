import * as walletApi from "../api/wallet.api"
import { PAYMENT_RETURN_URLS } from "@/features/order/utils/paymentReturnUrls"
import type { WalletInfo, WalletTransaction } from "../types"

/**
 * Fetch wallet information for a user
 * @param userId - Current user ID
 * @returns WalletInfo object
 */
export async function fetchWalletInfo(userId: number): Promise<WalletInfo> {
  const response = await walletApi.getWalletInfo(userId)
  if (response.code === 0) {
    return response.result
  }
  throw new Error(response.message || "Failed to fetch wallet info")
}

/**
 * Fetch wallet transactions for a user
 * @param userId - Current user ID
 * @returns Array of WalletTransaction objects
 */
export async function fetchWalletTransactions(
  userId: number
): Promise<WalletTransaction[]> {
  const response = await walletApi.getWalletTransactions(userId)
  if (response.code === 0) {
    return response.result
  }
  throw new Error(response.message || "Failed to fetch wallet transactions")
}

/**
 * Top up wallet using MoMo payment
 * @param userId - Current user ID
 * @param amount - Amount to top up (in VND)
 */
export async function topUpWithMomo(userId: number, amount: number): Promise<void> {
  const returnUrl = PAYMENT_RETURN_URLS.MOMO
  const response = await walletApi.createMomoTopUp(userId, amount, returnUrl)

  if (response.code === 0 && response.result?.paymentUrl) {
    window.location.href = response.result.paymentUrl
  } else {
    throw new Error(response.message || "Payment creation failed")
  }
}

/**
 * Top up wallet using VNPAY payment
 * @param userId - Current user ID
 * @param amount - Amount to top up (in VND)
 */
export async function topUpWithVnpay(userId: number, amount: number): Promise<void> {
  const returnUrl = PAYMENT_RETURN_URLS.VNPAY
  const response = await walletApi.createVnpayTopUp(userId, amount, returnUrl)

  if (response.code === 0 && response.result?.paymentUrl) {
    window.location.href = response.result.paymentUrl
  } else {
    throw new Error(response.message || "Payment creation failed")
  }
}
