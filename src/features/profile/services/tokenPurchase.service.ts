import axiosInstance from "@/services/axiosInstance"

export async function initiateTokenPurchase(payload: {
  userId: number
  planId: number
  paymentMethod: "VNPAY" | "MOMO" | "WALLET"
}): Promise<{ paymentUrl?: string }> {
  const response = await axiosInstance.post<{ code: number; message: string; result: string }>(
    "/api/ai-token-purchases/initiate",
    null,
    {
      params: {
        planId: payload.planId,
        paymentMethod: payload.paymentMethod,
      },
    }
  )

  if (response.data.code !== 0) {
    throw new Error(response.data.message || "Không thể tạo giao dịch nạp Token")
  }

  const paymentUrl = response.data.result || undefined
  return paymentUrl ? { paymentUrl } : {}
}
