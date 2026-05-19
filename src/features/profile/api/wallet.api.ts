import axiosInstance from "@/services/axiosInstance"

interface PaymentResult {
  paymentUrl: string
}

interface CreatePaymentResponse {
  code: number
  message: string
  result: PaymentResult
}

// ============ WALLET TYPES ============

export interface WalletInfoResponse {
  code: number
  message: string
  result: {
    walletId: number
    userId: number
    balance: number
    depositBalance: number
  }
}

export interface WalletTransactionsResponse {
  code: number
  message: string
  result: Array<{
    id: number
    amount: number
    type: string
    status: string
    createdAt: string
  }>
}

/**
 * Get wallet information for a user
 * @param userId - Current user ID
 */
export async function getWalletInfo(
  userId: number
): Promise<WalletInfoResponse> {
  const response = await axiosInstance.get<WalletInfoResponse>(
    `/api/wallets/user/${userId}`
  )
  return response.data
}

/**
 * Get wallet transactions for a user
 * @param userId - Current user ID
 */
export async function getWalletTransactions(
  userId: number
): Promise<WalletTransactionsResponse> {
  const response = await axiosInstance.get<WalletTransactionsResponse>(
    `/api/wallets/user/${userId}/transactions`
  )
  return response.data
}

/**
 * Create MoMo payment for wallet top-up
 * @param userId - Current user ID
 * @param amount - Amount to top up (in VND)
 * @param returnUrl - URL to redirect after payment
 */
export async function createMomoTopUp(
  userId: number,
  amount: number,
  returnUrl: string
): Promise<CreatePaymentResponse> {
  const response = await axiosInstance.post<CreatePaymentResponse>(
    "/api/payment/api/momo/create",
    null,
    {
      params: {
        userId,
        amount,
        returnUrl,
      },
      timeout: 120000,
    }
  )
  return response.data
}

/**
 * Create VNPAY payment for wallet top-up
 * @param userId - Current user ID
 * @param amount - Amount to top up (in VND)
 * @param returnUrl - URL to redirect after payment
 */
export async function createVnpayTopUp(
  userId: number,
  amount: number,
  returnUrl: string
): Promise<CreatePaymentResponse> {
  const response = await axiosInstance.post<CreatePaymentResponse>(
    "/api/payment/api/vnpay/create",
    null,
    {
      params: {
        userId,
        amount,
        returnUrl,
      },
      timeout: 120000,
    }
  )
  return response.data
}
