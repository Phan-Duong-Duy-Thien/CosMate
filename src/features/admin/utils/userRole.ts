/**
 * User Role Utilities
 * * Centralized role normalization and tag styling for admin user management
 */

export type UserRole =
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'COSPLAYER'
  | 'PROVIDER'
  | 'PROVIDER_RENTAL'
  | 'PROVIDER_PHOTOGRAPH'
  | 'PROVIDER_EVENT_STAFF'
  | 'STAFF'
  | string;

/**
 * Normalize role string to uppercase, handling null/undefined safely
 */
export function normalizeRole(role?: string | number): string {
  return String(role || '').toUpperCase();
}

export function getRoleTagProps(role?: string | number): { color: string; label: string } {
  const normalized = normalizeRole(role);

  switch (normalized) {
    case 'SUPERADMIN':
    case '1':
      return { color: 'purple', label: 'SUPERADMIN' };
    case 'ADMIN':
    case '2':
      return { color: 'volcano', label: 'ADMIN' };
    case 'COSPLAYER':
    case '3':
      return { color: 'cyan', label: 'COSPLAYER' };
    case 'PROVIDER':
    case '4':
      return { color: 'magenta', label: 'PROVIDER' };
    case 'PROVIDER_RENTAL':
    case '5':
      return { color: 'geekblue', label: 'PROVIDER RENTAL' };
    case 'PROVIDER_PHOTOGRAPH':
    case '6':
      return { color: 'geekblue', label: 'PROVIDER PHOTOGRAPH' };
    case 'PROVIDER_EVENT_STAFF':
    case '7':
      return { color: 'geekblue', label: 'PROVIDER EVENT STAFF' };
    case 'STAFF':
    case '8':
      return { color: 'blue', label: 'STAFF' };
    default:
      return { color: 'default', label: String(role) || 'Không rõ' };
  }
}