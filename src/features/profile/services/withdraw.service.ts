import * as withdrawApi from "../api/withdraw.api"
import type { WithdrawPayload, WithdrawResult } from "../api/withdraw.api"

export async function requestWithdraw(payload: WithdrawPayload): Promise<WithdrawResult> {
  const response = await withdrawApi.createWithdraw(payload)
  if (response.code === 0) return response.result
  throw new Error(response.message || "Failed to create withdraw request")
}
