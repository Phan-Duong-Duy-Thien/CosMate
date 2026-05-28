/**
 * Provider Shop API
 * HTTP layer only — no business logic.
 */
import axiosInstance from '@/services/axiosInstance'
import { normalizeProviderProfile } from './provider.api'
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
  const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
    `/api/providers/role/${roleName}`
  )
  const list = response.data.result ?? []
  return list.map((item) => normalizeProviderProfile(item))
}
