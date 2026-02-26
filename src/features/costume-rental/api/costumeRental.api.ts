/**
 * Costume Rental API
 *
 * HTTP layer only – no business logic.
 * All requests go through axiosInstance.
 */

import axiosInstance from '@/services/axiosInstance'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
} from '../types'

export interface CostumeCreatedResponse {
  id: number
  [key: string]: unknown
}

/**
 * POST /api/costumes  (multipart/form-data)
 */
export async function createCostumeMultipart(
  payload: CreateCostumeBasicPayload,
): Promise<CostumeCreatedResponse> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  form.append('size', payload.size)
  form.append('numberOfItems', String(payload.numberOfItems))
  form.append('pricePerDay', String(payload.pricePerDay))
  form.append('depositAmount', String(payload.depositAmount))
  form.append('providerId', String(payload.providerId))
  form.append('surcharges', '[]')
  form.append('accessories', '[]')
  form.append('rentalOptions', '[]')
  payload.imageFiles.forEach((file) => form.append('imageFiles', file))

  const response = await axiosInstance.post<CostumeCreatedResponse>(
    '/api/costumes',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data
}

/**
 * POST /api/surcharges/costume/{costumeId}
 */
export async function createSurcharge(
  costumeId: number,
  payload: SurchargeInput,
): Promise<void> {
  await axiosInstance.post(`/api/surcharges/costume/${costumeId}`, payload)
}

/**
 * POST /api/accessories/costume/{costumeId}
 */
export async function createAccessory(
  costumeId: number,
  payload: AccessoryInput,
): Promise<void> {
  await axiosInstance.post(`/api/accessories/costume/${costumeId}`, payload)
}

/**
 * POST /api/rental-options/costume/{costumeId}
 */
export async function createRentalOption(
  costumeId: number,
  payload: RentalOptionInput,
): Promise<void> {
  await axiosInstance.post(`/api/rental-options/costume/${costumeId}`, payload)
}
