/**
 * Rental Draft Storage Utility
 * Handles sessionStorage for persisting rental selections from detail page to checkout
 */
import type { RentalDraft } from '../types';

const DRAFT_KEY = 'cosmate_rental_draft';

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
