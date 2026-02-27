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

export async function updateCostumeBasic(id: number, formData: FormData): Promise<void> {
  await axiosInstance.put('/api/costumes/' + id, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
}

export async function updateSurcharge(id: number, payload: SurchargeUpdateInput): Promise<void> {
  await axiosInstance.put('/api/surcharges/' + id, payload)
}

export async function updateRentalOption(id: number, payload: RentalOptionUpdateInput): Promise<void> {
  await axiosInstance.put('/api/rental-options/' + id, payload)
}

export async function getAllCostumes(): Promise<CostumeApiResponse<Costume[]>> {
  const response = await axiosInstance.get<CostumeApiResponse<Costume[]>>('/api/costumes')
  return response.data
}
