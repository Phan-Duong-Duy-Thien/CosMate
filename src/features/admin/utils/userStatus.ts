/**
 * User Status Utilities
 * 
 * Centralized status normalization and tag styling for admin user management
 */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | string;

/**
 * Normalize status string to uppercase, handling null/undefined safely
 */
export function normalizeStatus(status?: string): string {
  return (status || '').toUpperCase();
}

/**
 * Get Tag color and label for a given status
 * Ensures consistent status display across table and detail views
 */
export function getStatusTagProps(status?: string): { color: string; label: string } {
  const normalized = normalizeStatus(status);

  // Check for exact matches first
  if (normalized === 'ACTIVE') {
    return { color: 'green', label: 'Hoạt động' };
  }
  
  if (normalized === 'BANNED' || normalized.includes('BAN')) {
    return { color: 'red', label: 'Bị ban' };
  }
  
  if (normalized === 'INACTIVE' || normalized.includes('LOCK') || normalized.includes('INACTIVE')) {
    return { color: 'orange', label: 'Bị khoá' };
  }

  // Fallback for unknown status
  return { color: 'default', label: status || 'Không rõ' };
}
