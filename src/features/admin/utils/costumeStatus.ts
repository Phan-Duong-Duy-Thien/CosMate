/**
 * Costume Status Utilities
 * Centralized status normalization and tag styling for admin costume management
 */

export type CostumeStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED' | 'RENTED' | 'AVAILABLE' | string;

/**
 * Get Tag color and label for a given costume status
 */
export function getCostumeStatusTagProps(status?: string): { color: string; label: string } {
  const normalized = (status || '').toUpperCase();

  if (normalized === 'ACTIVE') {
    return { color: 'green', label: 'Hoạt động' };
  }
  if (normalized === 'INACTIVE') {
    return { color: 'orange', label: 'Không hoạt động' };
  }
  if (normalized === 'PENDING') {
    return { color: 'blue', label: 'Chờ duyệt' };
  }
  if (normalized === 'DELETED') {
    return { color: 'red', label: 'Đã xóa' };
  }
  if (normalized === 'RENTED') {
    return { color: 'purple', label: 'Đang thuê' };
  }
  if (normalized === 'AVAILABLE') {
    return { color: 'cyan', label: 'Còn trống' };
  }

  return { color: 'default', label: status || 'Không rõ' };
}

/**
 * Get dot indicator color for status filter button
 */
export function getCostumeStatusDotColor(status?: string): string {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'ACTIVE') return 'var(--cosmate-success)';
  if (normalized === 'INACTIVE') return 'var(--cosmate-warning)';
  if (normalized === 'PENDING') return 'var(--cosmate-info)';
  if (normalized === 'DELETED') return 'var(--destructive)';
  if (normalized === 'RENTED') return 'var(--primary)';
  if (normalized === 'AVAILABLE') return 'var(--chart-3)';
  return 'var(--border)';
}
