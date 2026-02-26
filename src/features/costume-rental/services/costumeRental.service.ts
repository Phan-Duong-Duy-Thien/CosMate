/**
 * Costume Rental Service
 *
 * Orchestration layer – coordinates multiple API calls.
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
 * Phase 1 – create the costume record and return its id.
 */
export async function submitPhase1(
  payload: CreateCostumeBasicPayload,
): Promise<CostumeCreatedResponse> {
  return createCostumeMultipart(payload)
}

/**
 * Phase 2 – batch-submit surcharges, accessories, and rental options.
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
