/**
 * Costume Rental Service
 *
 * Orchestration layer â€“ coordinates multiple API calls.
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
}from '../types'

export interface Phase2Lists {
  surcharges: SurchargeInput[]
  accessories: AccessoryInput[]
  rentalOptions: RentalOptionInput[]
}

/**
 * Phase 1 â€“ create the costume record and return its id.
 */
export async function submitPhase1(
  payload: CreateCostumeBasicPayload,
): Promise<CostumeCreatedResponse> {
  return createCostumeMultipart(payload)
}

/**
 * Phase 2 â€“ batch-submit surcharges, accessories, and rental options.
 * Runs sequentially to avoid race conditions on the backend.
 */
export async function submitPhase2Batch(
  costumeId: number,
  lists: Phase2Lists,
): Promise<void> {
  for (const item of lists.surcharges) {
    await createSurcharge(costumeId, item)
  }
  for (const item of lists.accessories) {
    await createAccessory(costumeId, item)
  }
  for (const item of lists.rentalOptions) {
    await createRentalOption(costumeId, item)
  }
}

// â”€â”€â”€ Edit Costume Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  updateCostumeBasic as apiUpdateCostumeBasic,
  updateSurcharge as apiUpdateSurcharge,
  updateRentalOption as apiUpdateRentalOption,
}from '../api/costumeRental.api'
import type {
  UpdateCostumeBasicInput,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
} from '../types'

/**
 * Build FormData for PUT /api/costumes/{id}.
 * Mirrors createCostumeMultipart but omits surcharges/accessories/rentalOptions.
 */
export function buildUpdateCostumeFormData(
  input: UpdateCostumeBasicInput,
  providerId: number,
): FormData {
  const form = new FormData()
  form.append('name', input.name)
  form.append('description', input.description ?? '')
  form.append('size', input.size)
  form.append('numberOfItems', String(input.numberOfItems))
  form.append('pricePerDay', String(input.pricePerDay))
  form.append('depositAmount', String(input.depositAmount))
  form.append('providerId', String(providerId))
  if (input.imageFiles && input.imageFiles.length > 0) {
    input.imageFiles.forEach((file) => form.append('imageFiles', file))
  }
  return form
}

/** PUT /api/costumes/{id} */
export async function updateCostumeBasic(
  id: number,
  input: UpdateCostumeBasicInput,
  providerId: number,
): Promise<void> {
  const formData = buildUpdateCostumeFormData(input, providerId)
  await apiUpdateCostumeBasic(id, formData)
}

/** PUT /api/surcharges/{id}*/
export async function updateSurcharge(
  id: number,
  input: SurchargeUpdateInput,
): Promise<void> {
  await apiUpdateSurcharge(id, input)
}

/** PUT /api/rental-options/{id} */
export async function updateRentalOption(
  id: number,
  input: RentalOptionUpdateInput,
): Promise<void> {
  await apiUpdateRentalOption(id, input)
}
