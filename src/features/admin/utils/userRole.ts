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
export function normalizeRole(role?: string): string {
  return (role || '').toUpperCase();
}

/**
 * Get Tag color and label for a given role
 * Ensures consistent role display across admin views
 * Label returns original role name (no translation)
 */
export function getRoleTagProps(role?: string): { color: string; label: string } {
  const normalized = normalizeRole(role);

  // Admin roles
  if (normalized === 'SUPERADMIN') {
    return { color: 'purple', label: role || 'SUPERADMIN' };
  }
  
  if (normalized === 'ADMIN') {
    return { color: 'volcano', label: role || 'ADMIN' };
  }
  
  if (normalized === 'STAFF') {
    return { color: 'blue', label: role || 'STAFF' };
  }

  // Provider roles
  if (normalized === 'PROVIDER_RENTAL') {
    return { color: 'gold', label: role || 'PROVIDER_RENTAL' };
  }
  
  if (normalized === 'PROVIDER_PHOTOGRAPH') {
    return { color: 'gold', label: role || 'PROVIDER_PHOTOGRAPH' };
  }
  
  if (normalized === 'PROVIDER_EVENT_STAFF') {
    return { color: 'gold', label: role || 'PROVIDER_EVENT_STAFF' };
  }

  // Cosplayer role
  if (normalized === 'COSPLAYER') {
    return { color: 'cyan', label: role || 'COSPLAYER' };
  }

  // Fallback for unknown role
  return { color: 'default', label: role || 'Không rõ' };
}
