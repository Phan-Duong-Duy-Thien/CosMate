/**
 * Costume Rental Service
 *
 * Orchestration layer - coordinates multiple API calls.
 * Called by hooks only; never by components or pages.
 */

import {
  createCostumeMultipart,
  createSurcharge,
  createAccessory,
  createRentalOption,
  type CostumeCreatedResponse,
} from '../api/costumeRental.api'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
} from '../types'
import {
  normalizeSurcharges,
  normalizeRentalOptions,
  normalizeAccessories,
} from './normalizeCostumeInputs'

export interface Phase2Lists {
  surcharges: SurchargeInput[]
  accessories: AccessoryInput[]
  rentalOptions: RentalOptionInput[]
}

/**
 * Phase 1 - create the costume record and return its id.
 */
export async function submitPhase1(
  payload: CreateCostumeBasicPayload,
): Promise<CostumeCreatedResponse> {
  return createCostumeMultipart(payload)
}

/**
 * Phase 2 - batch-submit surcharges, accessories, and rental options.
 * Normalizes all inputs before sending to prevent coercion bugs.
 * Runs sequentially to avoid race conditions on the backend.
 */
export async function submitPhase2Batch(
  costumeId: number,
  lists: Phase2Lists,
): Promise<void> {
  const surcharges = normalizeSurcharges(lists.surcharges)
  const accessories = normalizeAccessories(lists.accessories)
  const rentalOptions = normalizeRentalOptions(lists.rentalOptions)

  for (const item of surcharges) {
    await createSurcharge(costumeId, item)
  }
  for (const item of accessories) {
    await createAccessory(costumeId, item)
  }
  for (const item of rentalOptions) {
    await createRentalOption(costumeId, item)
  }
}

import {
  updateCostumeBasic as apiUpdateCostumeBasic,
  updateSurcharge as apiUpdateSurcharge,
  updateRentalOption as apiUpdateRentalOption,
  updateAccessory as apiUpdateAccessory,
} from '../api/costumeRental.api'
import type {
  UpdateCostumeBasicInput,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
  AccessoryUpdateInput,
} from '../types'
import {
  normalizeSurchargeUpdate,
  normalizeRentalOptionUpdate,
  normalizeAccessoryUpdate,
} from './normalizeCostumeInputs'

export function buildUpdateCostumeFormData(
  input: UpdateCostumeBasicInput,
  providerId: number,
): FormData {
  const form = new FormData()
  form.append('name', input.name)
  form.append('description', input.description ?? '')
  form.append('size', input.size)
  if (input.rentPurpose) form.append('rentPurpose', input.rentPurpose)
  form.append('numberOfItems', String(input.numberOfItems))
  form.append('pricePerDay', String(input.pricePerDay))
  form.append('depositAmount', String(input.depositAmount))
  if (typeof input.rentDiscount === 'number') form.append('rentDiscount', String(input.rentDiscount))
  form.append('providerId', String(providerId))
  if (input.imageFiles && input.imageFiles.length > 0) {
    input.imageFiles.forEach((file) => form.append('imageFiles', file))
  }
  return form
}

export async function updateCostumeBasic(
  id: number,
  input: UpdateCostumeBasicInput,
  providerId: number,
): Promise<void> {
  const formData = buildUpdateCostumeFormData(input, providerId)
  await apiUpdateCostumeBasic(id, formData)
}

export async function updateSurcharge(
  id: number,
  input: SurchargeUpdateInput,
): Promise<void> {
  await apiUpdateSurcharge(id, normalizeSurchargeUpdate(input))
}

export async function updateRentalOption(
  id: number,
  input: RentalOptionUpdateInput,
): Promise<void> {
  await apiUpdateRentalOption(id, normalizeRentalOptionUpdate(input))
}

import { getCostumeById } from '../api/costumeRental.api'
import type { Costume } from '../types'

export async function createSurchargeService(
  costumeId: number,
  payload: SurchargeInput,
): Promise<Costume> {
  await createSurcharge(costumeId, normalizeSurcharges([payload])[0])
  const res = await getCostumeById(costumeId)
  return res.result
}

export async function createRentalOptionService(
  costumeId: number,
  payload: RentalOptionInput,
): Promise<Costume> {
  await createRentalOption(costumeId, normalizeRentalOptions([payload])[0])
  const res = await getCostumeById(costumeId)
  return res.result
}

export async function createAccessoryService(
  costumeId: number,
  payload: AccessoryInput,
): Promise<Costume> {
  await createAccessory(costumeId, normalizeAccessories([payload])[0])
  const res = await getCostumeById(costumeId)
  return res.result
}

export async function updateAccessoryService(
  accessoryId: number,
  payload: AccessoryUpdateInput,
  costumeId: number,
): Promise<Costume> {
  await apiUpdateAccessory(accessoryId, normalizeAccessoryUpdate(payload))
  const res = await getCostumeById(costumeId)
  return res.result
}
