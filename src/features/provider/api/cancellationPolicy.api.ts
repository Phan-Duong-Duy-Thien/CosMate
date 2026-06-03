import axiosInstance from '@/services/axiosInstance';

export interface CancellationPolicy {
  id?: number;
  providerId?: number;
  minHoursBefore: number;
  maxHoursBefore: number;
  penaltyType: string; // "PERCENT" | "FIXED" | "NONE"
  penaltyValue: number;
  description: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export async function getCancellationPolicies(providerId: number): Promise<CancellationPolicy[]> {
  const response = await axiosInstance.get<ApiResponse<CancellationPolicy[]>>(
    `/api/providers/cancellation-policies/provider/${providerId}`
  );
  return response.data.result ?? [];
}

export async function createCancellationPolicy(payload: CancellationPolicy): Promise<CancellationPolicy> {
  const response = await axiosInstance.post<ApiResponse<CancellationPolicy>>(
    `/api/providers/cancellation-policies`,
    payload
  );
  return response.data.result;
}

export async function updateCancellationPolicy(id: number, payload: Partial<CancellationPolicy>): Promise<CancellationPolicy> {
  const response = await axiosInstance.put<ApiResponse<CancellationPolicy>>(
    `/api/providers/cancellation-policies/${id}`,
    payload
  );
  return response.data.result;
}

export async function deleteCancellationPolicy(id: number): Promise<void> {
  await axiosInstance.delete(`/api/providers/cancellation-policies/${id}`);
}
