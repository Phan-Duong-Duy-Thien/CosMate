import { ROLE } from '@/types/auth';

// Hàm tiện ích dịch ID sang chữ để đồng bộ với ProtectedRoute
function normalizeToRoleName(role: any): string {
  const strRole = String(role).toUpperCase();
  if (strRole === '1') return 'SUPERADMIN';
  if (strRole === '2') return 'ADMIN';
  if (strRole === '3') return 'COSPLAYER';
  if (strRole === '4') return 'PROVIDER';
  if (strRole === '5') return 'PROVIDER_RENTAL';
  if (strRole === '6') return 'PROVIDER_PHOTOGRAPH';
  if (strRole === '7') return 'PROVIDER_EVENT_STAFF';
  if (strRole === '8') return 'STAFF';
  return strRole;
}

export function getRedirectPath(roles: any[]): string {
  if (!roles || roles.length === 0) {
    return '/login';
  }

  // Dịch toàn bộ ID số (nếu có) thành chữ để dễ check
  const normalizedRoles = roles.map(normalizeToRoleName);

  // Priority 1: Admin & Superadmin
  if (
    normalizedRoles.includes(ROLE.ADMIN) || 
    normalizedRoles.includes('ADMIN') ||
    normalizedRoles.includes('SUPERADMIN')
  ) {
    return '/admin';
  }

  // Priority 2: Provider Rental
  if (
    normalizedRoles.includes(ROLE.PROVIDER_RENTAL) ||
    normalizedRoles.includes('PROVIDER_RENTAL')
  ) {
    return '/provider-rental';
  }

  // Priority 3: Provider Photograph
  if (
    normalizedRoles.includes(ROLE.PROVIDER_PHOTOGRAPH) ||
    normalizedRoles.includes('PROVIDER_PHOTOGRAPH')
  ) {
    return '/provider-photograph';
  }

  // Priority 4: Provider Event Staff
  if (
    normalizedRoles.includes(ROLE.PROVIDER_EVENT_STAFF) ||
    normalizedRoles.includes('PROVIDER_EVENT_STAFF')
  ) {
    return '/provider-event-staff';
  }

  // Priority 5: Cosplayer
  if (
    normalizedRoles.includes(ROLE.COSPLAYER) || 
    normalizedRoles.includes('COSPLAYER')
  ) {
    return '/';
  }

  // Priority 6: Staff
  if (normalizedRoles.includes('STAFF')) {
    // Tạm thời tui đẩy STAFF về trang Admin nhé. 
    // Nếu sau này ông có trang riêng (ví dụ '/staff') thì sửa lại chỗ này!
    return '/admin'; 
  }

  // Fallback: No matching role
  return '/no-permission';
}