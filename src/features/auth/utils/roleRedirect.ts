import { ROLE, type UserRole } from '@/types/auth';

/**
 * Determine the redirect path based on user roles
 * 
 * Priority order (first match wins):
 * 1. ADMIN → /admin
 * 2. PROVIDER_RENTAL → /provider-rental
 * 3. PROVIDER_PHOTOGRAPH → /no-permission (not yet supported)
 * 4. PROVIDER_EVENT_STAFF → /no-permission (not yet supported)
 * 5. COSPLAYER → /
 * 6. Default → /no-permission
 * 
 * @param roles - Array of user roles from JWT
 * @returns Path to redirect to
 */
export function getRedirectPath(roles: UserRole[]): string {
  if (!roles || roles.length === 0) {
    return '/login';
  }

  // Priority 1: Admin
  if (roles.includes(ROLE.ADMIN)) {
    return '/admin';
  }

  // Priority 2: Provider Rental
  if (roles.includes(ROLE.PROVIDER_RENTAL)) {
    return '/provider-rental';
  }

  // Priority 3: Unsupported provider types
  if (
    roles.includes(ROLE.PROVIDER_PHOTOGRAPH) ||
    roles.includes(ROLE.PROVIDER_EVENT_STAFF)
  ) {
    return '/no-permission';
  }

  // Priority 4: Cosplayer
  if (roles.includes(ROLE.COSPLAYER)) {
    return '/';
  }

  // Fallback: No matching role
  return '/no-permission';
}
