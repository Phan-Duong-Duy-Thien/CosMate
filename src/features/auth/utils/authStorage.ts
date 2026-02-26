/**
 * Auth storage utilities
 * Read-only helpers for UI to check auth state without touching localStorage directly.
 * Token read/clear is delegated to services/tokenStorage.
 */

import { getAuth } from '../services/tokenStorage';

export { clearAuth } from '../services/tokenStorage';

/**
 * Get access token from storage (via tokenStorage service).
 */
export function getAccessToken(): string | null {
  const auth = getAuth();
  return auth?.token ?? null;
}

/**
 * Whether the user is considered logged in (has a valid token).
 * Rejects empty strings, "undefined", "null" as not authenticated.
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  
  // Reject null, undefined, empty string
  if (!token) {
    return false;
  }
  
  // Reject empty/whitespace-only tokens
  const trimmed = token.trim();
  if (trimmed.length === 0) {
    return false;
  }
  
  return true;
}
