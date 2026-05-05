/**
 * Rental Draft Storage Utility
 * Handles sessionStorage for persisting rental selections from detail page to checkout
 */
import type { RentalDraft, PaymentMethod } from '../types';

const DRAFT_KEY = 'cosmate_rental_draft';
const CHECKOUT_SELECTIONS_KEY = 'cosmate_checkout_selections';

/**
 * Checkout page selections that live in component state and are lost on unmount.
 * Persisted to sessionStorage before navigating to wallet top-up so the user
 * returns to the exact same checkout state.
 */
export interface CheckoutSelections {
  selectedAddressId: number | null;
  paymentMethod: PaymentMethod;
  policyAccepted: boolean;
}

// ── Rental Draft (costume / rental config) ──────────────────────────────────

/**
 * Save rental draft to sessionStorage
 */
export function saveDraft(draft: RentalDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save rental draft:', error);
  }
}

/**
 * Load rental draft from sessionStorage
 */
export function loadDraft(): RentalDraft | null {
  try {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as RentalDraft;
  } catch (error) {
    console.error('Failed to load rental draft:', error);
    return null;
  }
}

/**
 * Clear rental draft from sessionStorage
 */
export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear rental draft:', error);
  }
}

// ── Checkout Selections (address, payment method, policy) ───────────────────

/**
 * Save checkout page selections before navigating away (e.g. to wallet top-up)
 */
export function saveCheckoutSelections(selections: CheckoutSelections): void {
  try {
    sessionStorage.setItem(CHECKOUT_SELECTIONS_KEY, JSON.stringify(selections));
  } catch (error) {
    console.error('Failed to save checkout selections:', error);
  }
}

/**
 * Load previously saved checkout selections (returns null if none)
 */
export function loadCheckoutSelections(): CheckoutSelections | null {
  try {
    const stored = sessionStorage.getItem(CHECKOUT_SELECTIONS_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as CheckoutSelections;
  } catch (error) {
    console.error('Failed to load checkout selections:', error);
    return null;
  }
}

/**
 * Clear checkout selections (after successful order or manual reset)
 */
export function clearCheckoutSelections(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_SELECTIONS_KEY);
  } catch (error) {
    console.error('Failed to clear checkout selections:', error);
  }
}
