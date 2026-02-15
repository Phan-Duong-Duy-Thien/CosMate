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
 * Whether the user is considered logged in (has a token).
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
