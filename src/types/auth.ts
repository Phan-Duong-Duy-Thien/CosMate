/**
 * Global authentication types and constants
 * Shared across the entire application
 */

// User role type
export type UserRole = 'COSPLAYER' | 'PROVIDER';

// Role constants (use these instead of string literals)
export const ROLE = {
  COSPLAYER: 'COSPLAYER',
  PROVIDER: 'PROVIDER',
} as const;
