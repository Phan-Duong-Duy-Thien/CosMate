/**
 * normalizeCostumeInputs
 *
 * Shared PURE normalization functions for costume create/update flows.
 * No React, no API calls, no side effects.
 *
 * Used by:
 *  - submitPhase2Batch (CREATE flow)
 *  - useEditCostumeModal handlers (UPDATE flow)
 */

import type {
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
  AccessoryUpdateInput,
} from '../types'

/**
 * Normalize a money value from antd InputNumber or form state.
 * - Accepts number | string | null | undefined
 * - Strips thousand-separator commas if value is a string
 * - Returns null for empty/null/undefined
 * - Returns null for NaN — never falls back to a magic default
 */
export function normalizeMoneyInput(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') {
    return isNaN(value) ? null : value
  }
  if (typeof value === 'string') {
    // Strip thousand separators (commas used as separators in vi-VN locale)
    const stripped = value.replace(/,/g, '')
    const parsed = Number(stripped)
    return isNaN(parsed) ? null : parsed
  }
  return null
}

/** Trim and collapse internal whitespace in a name string */
function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/**
 * Normalize surcharge inputs before API submission.
 * Trims names; ensures price is a number (0 if unparseable — field is required so this is a fallback only).
 */
export function normalizeSurcharges(surcharges: SurchargeInput[]): SurchargeInput[] {
  return surcharges.map((s) => ({
    ...s,
    name: normalizeName(s.name),
    description: s.description?.trim() ?? '',
    price: normalizeMoneyInput(s.price) ?? 0,
  }))
}

/**
 * Normalize rental option inputs before API submission.
 */
export function normalizeRentalOptions(options: RentalOptionInput[]): RentalOptionInput[] {
  return options.map((o) => ({
    ...o,
    description: o.description?.trim() ?? '',
    price: normalizeMoneyInput(o.price) ?? 0,
  }))
}

/**
 * Normalize accessory inputs before API submission.
 */
export function normalizeAccessories(accessories: AccessoryInput[]): AccessoryInput[] {
  return accessories.map((a) => ({
    ...a,
    name: normalizeName(a.name),
    description: a.description?.trim() ?? '',
    price: normalizeMoneyInput(a.price) ?? 0,
  }))
}

/**
 * Normalize a surcharge update payload.
 */
export function normalizeSurchargeUpdate(input: SurchargeUpdateInput): SurchargeUpdateInput {
  return {
    ...input,
    name: normalizeName(input.name),
    description: input.description?.trim() ?? '',
    price: normalizeMoneyInput(input.price) ?? 0,
  }
}

/**
 * Normalize a rental option update payload.
 */
export function normalizeRentalOptionUpdate(input: RentalOptionUpdateInput): RentalOptionUpdateInput {
  return {
    ...input,
    description: input.description?.trim() ?? '',
    price: normalizeMoneyInput(input.price) ?? 0,
  }
}

/**
 * Normalize an accessory update payload.
 */
export function normalizeAccessoryUpdate(input: AccessoryUpdateInput): AccessoryUpdateInput {
  return {
    ...input,
    name: normalizeName(input.name),
    description: input.description?.trim() ?? '',
    price: normalizeMoneyInput(input.price) ?? 0,
  }
}
