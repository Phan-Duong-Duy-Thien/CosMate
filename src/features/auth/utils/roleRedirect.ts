import { ROLE} from '@/types/auth';

export function getRedirectPath(roles: any[]): string {
  if (!roles || roles.length === 0) {
    return '/login';
  }

  // Chuẩn hóa tất cả role về dạng chuỗi viết hoa để dễ so sánh
  const normalizedRoles = roles.map(r => String(r).toUpperCase());

  // Priority 1: Admin & Superadmin (Cho phép 'ADMIN', 'SUPERADMIN', '1', '2')
  if (
    normalizedRoles.includes(ROLE.ADMIN) || 
    normalizedRoles.includes('2') ||
    normalizedRoles.includes('SUPERADMIN') ||
    normalizedRoles.includes('1')
  ) {
    return '/admin';
  }

  // Priority 2: Provider Rental
  if (normalizedRoles.includes(ROLE.PROVIDER_RENTAL)) {
    return '/provider-rental';
  }

  // Priority 3: Unsupported provider types
  if (
    normalizedRoles.includes(ROLE.PROVIDER_PHOTOGRAPH) ||
    normalizedRoles.includes(ROLE.PROVIDER_EVENT_STAFF)
  ) {
    return '/no-permission';
  }

  // Priority 4: Cosplayer (Giả sử role_id = 4 là cosplayer)
  if (normalizedRoles.includes(ROLE.COSPLAYER) || normalizedRoles.includes('4')) {
    return '/';
  }

  // Fallback: No matching role
  return '/no-permission';
}