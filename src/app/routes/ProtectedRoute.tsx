import { Navigate, Outlet } from 'react-router-dom';
import { getRoles } from '@/features/auth/services/tokenStorage';

type ProtectedRouteProps = {
  // Để any[] để không bị lỗi TypeScript khi truyền cả chữ lẫn số
  allowedRoles: any[];
  redirectTo?: string;
};

export function ProtectedRoute({
  allowedRoles,
  redirectTo = '/no-permission',
}: ProtectedRouteProps) {
  // Lấy data từ token ra
  const rawUserRoles = getRoles();
  
  // Đảm bảo roles luôn là 1 mảng (đề phòng API trả về số lẻ thay vì mảng)
  const userRoles = Array.isArray(rawUserRoles) ? rawUserRoles : (rawUserRoles != null ? [rawUserRoles] : []);

  if (userRoles.length === 0) {
    console.warn('🔒 ProtectedRoute: Không tìm thấy Role, chuyển về Login');
    return <Navigate to="/login" replace />;
  }

  // BƯỚC 1: DỊCH ID SANG CHỮ CHO USER
  const normalizedUserRoles = userRoles.map(role => {
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
  });

  // BƯỚC 2: CHUẨN HÓA DANH SÁCH CHO PHÉP (Từ Route truyền vào)
  const normalizedAllowedRoles = allowedRoles.map(role => String(role).toUpperCase());

  // BƯỚC 3: KIỂM TRA QUYỀN
  const hasPermission = normalizedUserRoles.some((role) => {
    // Nếu role nằm trong danh sách cho phép -> Duyệt
    if (normalizedAllowedRoles.includes(role)) return true;
    
    // ĐẶC QUYỀN: SUPERADMIN (1) luôn được phép truy cập vào các trang của ADMIN (2)
    if (role === 'SUPERADMIN' && normalizedAllowedRoles.includes('ADMIN')) return true;

    return false;
  });

  console.log('[ProtectedRoute] Roles của User:', normalizedUserRoles);
  console.log('[ProtectedRoute] Roles được phép vào:', normalizedAllowedRoles);
  console.log('[ProtectedRoute] Cấp quyền:', hasPermission ? '✅ CHO QUA' : '🚫 CHẶN LẠI');

  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}