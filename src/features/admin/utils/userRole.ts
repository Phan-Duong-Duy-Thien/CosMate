/**
 * User Role Utilities
 * 
 * Centralized role normalization and tag styling for admin user management
 */

export type UserRole =
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'STAFF'
  | 'PROVIDER_RENTAL'
  | 'PROVIDER_PHOTOGRAPH'
  | 'PROVIDER_EVENT_STAFF'
  | 'COSPLAYER'
  | string;

/**
 * Normalize role string to uppercase, handling null/undefined safely
 */
export function normalizeRole(role?: string | number): string {
  return String(role || '').toUpperCase();
}

export function getRoleTagProps(role?: string | number): { color: string; label: string } {
  const normalized = normalizeRole(role);

  if (normalized === 'SUPERADMIN' || normalized === '1') {
    return { color: 'purple', label: 'SUPERADMIN' };
  }
  
  if (normalized === 'ADMIN' || normalized === '2') {
    return { color: 'volcano', label: 'ADMIN' };
  }
  
  if (normalized === 'STAFF' || normalized === '3') {
    return { color: 'blue', label: 'STAFF' };
  }

  if (normalized === 'COSPLAYER' || normalized === '4') {
    return { color: 'cyan', label: 'COSPLAYER' };
  }

  return { color: 'default', label: String(role) || 'Không rõ' };
}