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
  if (normalized === 'ACTIVE') return '#52c41a';
  if (normalized === 'INACTIVE') return '#faad14';
  if (normalized === 'PENDING') return '#1677ff';
  if (normalized === 'DELETED') return '#ff4d4f';
  if (normalized === 'RENTED') return '#722ed1';
  if (normalized === 'AVAILABLE') return '#13c2c2';
  return '#d9d9d9';
}
