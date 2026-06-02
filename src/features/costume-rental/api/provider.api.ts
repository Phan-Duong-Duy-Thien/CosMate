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

const providerCache: Record<number, ProviderDto> = {}

export async function getProviderById(providerId: number): Promise<ProviderDto> {
  if (providerCache[providerId]) {
    return providerCache[providerId]
  }
  const res = await axiosInstance.get<ApiResponse<ProviderDto>>(
    `/api/providers/id/${providerId}`
  )
  const provider = res.data.result
  if (provider) {
    providerCache[providerId] = provider
  }
  return provider
}
