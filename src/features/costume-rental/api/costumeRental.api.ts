/**
 * Costume Rental API
 *
 * HTTP layer only - no business logic.
 * All requests go through axiosInstance.
 */

import axiosInstance from '@/services/axiosInstance'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
  Costume,
  CostumeApiResponse,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
} from '../types'

export interface CostumeCreatedResponse {
  id: number
  [key: string]: unknown
}

interface ApiWrapper<T> {
  code: number
  message?: string
  result: T
}

export async function createCostumeMultipart(payload: CreateCostumeBasicPayload): Promise<CostumeCreatedResponse> {
  const form = new FormData()
  const safeNumber = (value: unknown, fallback = 0) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  form.append('name', String(payload.name ?? ''))
  form.append('description', String(payload.description ?? ''))
  form.append('size', String(payload.size ?? ''))
  if (payload.rentPurpose) form.append('rentPurpose', String(payload.rentPurpose))
  form.append('numberOfItems', String(safeNumber(payload.numberOfItems, 0)))
  form.append('pricePerDay', String(safeNumber(payload.pricePerDay, 0)))
  form.append('rentDiscount', String(safeNumber(payload.rentDiscount, 0)))
  form.append('depositAmount', String(safeNumber(payload.depositAmount, 0)))
  form.append('providerId', String(safeNumber(payload.providerId, 0)))
  ;(payload.characterIds ?? []).forEach((id) => {
    const safeId = safeNumber(id, 0)
    if (safeId > 0) form.append('characterIds', String(safeId))
  })
  form.append('surcharges', '[]')
  form.append('accessories', '[]')
  form.append('rentalOptions', '[]')
  payload.imageFiles.forEach((file) => form.append('imageFiles', file))
  const response = await axiosInstance.post<ApiWrapper<CostumeCreatedResponse>>('/api/costumes', form, { headers: { 'Content-Type': 'multipart/form-data' }})
  const wrapped = response.data
  if (import.meta.env.DEV) { console.log('[createCostumeMultipart] raw response:', wrapped); console.log('[createCostumeMultipart] extracted costumeId:', wrapped?.result?.id) }
  if (!wrapped?.result?.id) { throw new Error('POST /api/costumes succeeded but response.result.id is missing. Got: ' + JSON.stringify(wrapped)) }
  return wrapped.result
}

export async function createSurcharge(costumeId: number, payload: SurchargeInput): Promise<void> {
  if (!costumeId || typeof costumeId !== 'number') throw new Error('createSurcharge: invalid costumeId')
  await axiosInstance.post('/api/surcharges/costume/' + costumeId, payload)
}

export async function createAccessory(costumeId: number, payload: AccessoryInput): Promise<void> {
  if (!costumeId || typeof costumeId !== 'number') throw new Error('createAccessory: invalid costumeId')
  await axiosInstance.post('/api/accessories/costume/' + costumeId, payload)
}

export async function createRentalOption(costumeId: number, payload: RentalOptionInput): Promise<void> {
  if (!costumeId || typeof costumeId !== 'number') throw new Error('createRentalOption: invalid costumeId')
  await axiosInstance.post('/api/rental-options/costume/' + costumeId, payload)
}

export async function getCostumesByProvider(providerId: number): Promise<CostumeApiResponse<Costume[]>> {
  const response = await axiosInstance.get<CostumeApiResponse<Costume[]>>('/api/costumes/provider/' + providerId)
  return response.data
}

export async function getCostumeById(id: number): Promise<CostumeApiResponse<Costume>> {
  const response = await axiosInstance.get<CostumeApiResponse<Costume>>('/api/costumes/' + id)
  return response.data
}

/**
 * DELETE /api/costumes/{id}
 * Success example: { code: 0, message: "Xóa bộ đồ thành công!" }
 */
export async function deleteCostume(id: number): Promise<void> {
  const response = await axiosInstance.delete<{ code: number; message?: string }>(`/api/costumes/${id}`)
  const body = response.data
  if (body && typeof body.code === 'number' && body.code !== 0) {
    throw new Error(body.message || 'Xóa trang phục thất bại')
  }
}

export async function updateCostumeBasic(id: number, formData: FormData): Promise<void> {
  await axiosInstance.put('/api/costumes/' + id, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
}

export async function updateSurcharge(id: number, payload: SurchargeUpdateInput): Promise<void> {
  await axiosInstance.put('/api/surcharges/' + id, payload)
}

export async function updateRentalOption(id: number, payload: RentalOptionUpdateInput): Promise<void> {
  await axiosInstance.put('/api/rental-options/' + id, payload)
}

export async function updateAccessory(id: number, payload: AccessoryInput): Promise<void> {
  await axiosInstance.put('/api/accessories/' + id, payload)
}

export async function getAllCostumes(): Promise<CostumeApiResponse<Costume[]>> {
  const response = await axiosInstance.get<CostumeApiResponse<Costume[]>>('/api/costumes')
  return response.data
}

export async function generateCostumeDescriptionByAI(
  name: string,
  imageFiles: File[],
  personaId: number,
): Promise<string> {
  const form = new FormData()
  if (name?.trim()) {
    form.append('name', name.trim())
  }
  form.append('personaId', String(personaId))
  imageFiles.forEach((file) => form.append('files', file))

  const response = await axiosInstance.post<ApiWrapper<string>>(
    '/api/search/generate-description',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  const wrapped = response.data
  return wrapped?.result ?? ''
}
export async function searchCostumes(keyword: string): Promise<CostumeApiResponse<Costume[]>> {
  const response = await axiosInstance.get<CostumeApiResponse<Costume[]>>('/api/costumes/search', {
    params: { keyword },
  })
  return response.data
}
