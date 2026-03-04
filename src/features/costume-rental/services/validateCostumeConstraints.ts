/**
 * validateCostumeConstraints
 *
 * Pure validation functions for costume business rules.
 * No React, no API calls. Returns structured error strings (i18n keys resolved by caller).
 */

import type { RentalOptionInput, AccessoryInput, RentalOptionName } from '../types'

const MAX_RENTAL_OPTIONS = 4
const REQUIRED_RENTAL_OPTIONS = 4
const REQUIRED_RENTAL_OPTION_NAMES: RentalOptionName[] = ['FEST', 'SHOOT', 'TEST', 'EVENT']

/** Normalize a name for duplicate comparison */
function normalize(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export interface ValidationResult {
  valid: boolean
  /** i18n key or null */
  errorKey: string | null
}

/**
 * Validate rental options list before submit.
 * Rules:
 *  1. Must have exactly 4 options.
 *  2. Must have all required names: FEST, SHOOT, TEST, EVENT.
 *  3. Names must be unique (case-insensitive, trimmed).
 */
export function validateRentalOptions(
  rentalOptions: RentalOptionInput[],
): ValidationResult {
  if (rentalOptions.length !== REQUIRED_RENTAL_OPTIONS) {
    return { valid: false, errorKey: 'costume.rentalOptions.requireExactlyFour' }
  }

  // Check all required names are present
  const providedNames = new Set(rentalOptions.map(opt => normalize(opt.name)))
  for (const requiredName of REQUIRED_RENTAL_OPTION_NAMES) {
    if (!providedNames.has(requiredName.toLowerCase())) {
      return { valid: false, errorKey: 'costume.rentalOptions.missingRequiredName' }
    }
  }

  // Check for duplicates
  const seen = new Set<string>()
  for (const opt of rentalOptions) {
    const key = normalize(opt.name)
    if (seen.has(key)) {
      return { valid: false, errorKey: 'costume.rentalOptions.duplicateName' }
    }
    seen.add(key)
  }

  return { valid: true, errorKey: null }
}

/**
 * Check whether adding one more rental option is allowed.
 */
export function canAddRentalOption(currentCount: number): boolean {
  return currentCount < MAX_RENTAL_OPTIONS
}

/**
 * Validate accessories against numberOfItems constraint.
 * Rule: 1 (costume) + accessories.length must NOT exceed numberOfItems.
 */
export function validateAccessories(
  accessories: AccessoryInput[],
  numberOfItems: number,
): ValidationResult {
  if (1 + accessories.length > numberOfItems) {
    return { valid: false, errorKey: 'costume.accessories.reachedMaxItems' }
  }
  return { valid: true, errorKey: null }
}

/**
 * Check whether adding one more accessory is allowed.
 */
export function canAddAccessory(
  currentCount: number,
  numberOfItems: number,
): boolean {
  return 1 + currentCount < numberOfItems
}
