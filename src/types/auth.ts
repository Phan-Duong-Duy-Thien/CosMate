/**
 * Global authentication types and constants
 * Shared across the entire application
 */

// User role type (matches backend)
export type UserRole = 
  | 'ADMIN'
  | 'COSPLAYER' 
  | 'PROVIDER_RENTAL'
  | 'PROVIDER_PHOTOGRAPH'
  | 'PROVIDER_EVENT_STAFF';

// Role constants (use these instead of string literals)
export const ROLE = {
  ADMIN: 'ADMIN',
  COSPLAYER: 'COSPLAYER',
  PROVIDER_RENTAL: 'PROVIDER_RENTAL',
  PROVIDER_PHOTOGRAPH: 'PROVIDER_PHOTOGRAPH',
  PROVIDER_EVENT_STAFF: 'PROVIDER_EVENT_STAFF',
} as const;

// Provider roles array (for easy role checking)
export const PROVIDER_ROLES: UserRole[] = [
  ROLE.PROVIDER_RENTAL,
  ROLE.PROVIDER_PHOTOGRAPH,
  ROLE.PROVIDER_EVENT_STAFF,
];
