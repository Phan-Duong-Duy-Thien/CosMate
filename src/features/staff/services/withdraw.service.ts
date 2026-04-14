import * as withdrawApi from '@/features/profile/api/withdraw.api'
import type { WithdrawResult } from '@/features/profile/api/withdraw.api'

export async function fetchWithdrawRequests(): Promise<WithdrawResult[]> {
  const response = await withdrawApi.getWithdrawRequests()
  if (response.code === 0) return response.result
  throw new Error(response.message || 'Failed to fetch withdraw requests')
}
