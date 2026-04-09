/**
 * Provider Shop API
 * HTTP layer only — no business logic.
 */
import axiosInstance from '@/services/axiosInstance'
import type { ProviderProfile } from '../types'

interface ApiResponse<T> {
  code: number
  message: string
  result: T
}

/**
 * GET /api/providers/id/{providerId}
 * Returns the provider profile for the given provider ID.
 */
export async function getProviderById(providerId: number): Promise<ProviderProfile> {
  const response = await axiosInstance.get<ApiResponse<ProviderProfile>>(
    `/api/providers/id/${providerId}`
  )
  return response.data.result
}

/**
 * GET /api/providers/role/{roleName}
 * Returns providers filtered by role.
 */
export async function getProvidersByRole(roleName: string): Promise<ProviderProfile[]> {
  const response = await axiosInstance.get<ApiResponse<ProviderProfile[]>>(
    `/api/providers/role/${roleName}`
  )
  return response.data.result
}
