import { getRoles } from '@/features/auth/services/tokenStorage';

/** Admin-only endpoint GET /api/users/{id}/profile — provider must not call. */
export function canFetchOtherUserProfiles(): boolean {
  const roles = getRoles().map((r) => String(r).toUpperCase());
  return roles.some((r) => r === 'ADMIN' || r === 'SUPERADMIN' || r === '1' || r === '2');
}
