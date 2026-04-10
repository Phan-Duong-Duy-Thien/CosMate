import axiosInstance from "@/services/axiosInstance"

export interface WithdrawListResponse {
  code: number
  message: string
  result: WithdrawResult[]
}

export async function getWithdrawRequests(): Promise<WithdrawListResponse> {
  const response = await axiosInstance.get<WithdrawListResponse>("/api/withdraws")
  return response.data
}

export interface WithdrawPayload {
  amount: number
  bankAccountNumber: string
  bankName: string
}

export interface WithdrawResult {
  id: number
  userId: number
  walletId: number
  amount: number
  bankAccountNumber: string
  bankName: string
  status: string
  requestedAt: string
}

export interface WithdrawResponse {
  code: number
  message: string
  result: WithdrawResult
}

export async function createWithdraw(payload: WithdrawPayload): Promise<WithdrawResponse> {
  const response = await axiosInstance.post<WithdrawResponse>("/api/withdraws", payload)
  return response.data
}

export interface RejectWithdrawResponse {
  code: number
  message: string
  result: WithdrawResult
}

export async function rejectWithdraw(id: number, reason: string): Promise<RejectWithdrawResponse> {
  const response = await axiosInstance.post<RejectWithdrawResponse>(
    `/api/withdraws/${id}/reject`,
    null,
    { params: { reason } }
  )
  return response.data
}

export interface ApproveWithdrawResponse {
  code: number
  message: string
  result: WithdrawResult
}

export async function approveWithdraw(id: number): Promise<ApproveWithdrawResponse> {
  const response = await axiosInstance.post<ApproveWithdrawResponse>(`/api/withdraws/${id}/approve`)
  return response.data
}
