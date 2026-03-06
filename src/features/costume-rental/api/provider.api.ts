import axiosInstance from "@/services/axiosInstance"
import type { ProviderProfile } from "@/features/provider/types"

type ApiResponse<T> = {
  code: number
  message: string
  result: T
}

export type ProviderDto = ProviderProfile & {
  shopAddressId: number
  avatarUrl: string | null
  bio: string | null
  bankAccountNumber: string | null
  bankName: string | null
}

export async function getProviderById(providerId: number): Promise<ProviderDto> {
  const res = await axiosInstance.get<ApiResponse<ProviderDto>>(
    `/api/providers/id/${providerId}`
  )
  return res.data.result
}
