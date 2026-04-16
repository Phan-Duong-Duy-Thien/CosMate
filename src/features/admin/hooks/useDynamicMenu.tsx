import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Shirt, BarChart3, Folder, Menu as MenuIcon } from 'lucide-react';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import type { LucideIcon } from 'lucide-react';

const getIconComponent = (iconName?: string): LucideIcon => {
  switch (iconName?.toLowerCase()) {
    case 'dashboard': return LayoutDashboard;
    case 'users': return Users;
    case 'bookings': return ShoppingBag;
    case 'costumes': return Shirt;
    case 'reports': return BarChart3;
    case 'menu': return MenuIcon;
    default: return Folder;
  }
};

const ADMIN_CORE_MENUS: DashboardSidebarItem[] = [
  { key: '/admin', label: 'Trang chủ', path: '/admin', icon: <LayoutDashboard size={16} /> },
  { key: '/admin/menus', label: 'Quản lý menu', path: '/admin/menus', icon: <MenuIcon size={16} /> },
];


const ADMIN_DERIVED_MENUS: DashboardSidebarItem[] = [
  { key: '/admin/users', label: 'Người dùng', path: '/admin/users', icon: <Users size={16} /> },
  { key: '/admin/providers', label: 'Provider', path: '/admin/providers', icon: <ShoppingBag size={16} /> },
  { key: '/admin/costumes', label: 'Trang phục', path: '/admin/costumes', icon: <Shirt size={16} /> },
  { key: '/admin/orders', label: 'Đơn hàng', path: '/admin/orders', icon: <BarChart3 size={16} /> },
  { key: '/admin/reports', label: 'Báo cáo', path: '/admin/reports', icon: <BarChart3 size={16} /> },
  { key: '/admin/audit-logs', label: 'Nhật ký hệ thống', path: '/admin/audit-logs', icon: <Folder size={16} /> },
];

const ADMIN_SAFE_MENUS: DashboardSidebarItem[] = [...ADMIN_CORE_MENUS, ...ADMIN_DERIVED_MENUS];
const ADMIN_ROLE_ALLOWLIST = ['SUPERADMIN', 'ADMIN'];

const normalizeChildren = (children: any[] = [], roles: string[]): DashboardSidebarItem[] => {
  return children
    .filter((item) => item?.isActive !== false && item?.url)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((item: any) => {
      const Icon = getIconComponent(item.icon);
      return {
        key: String(item.url),
        label: item.title,
        path: item.url,
        icon: <Icon size={16} />,
        children: normalizeChildren(item.children || [], roles),
      };
    });
};

export function useDynamicMenu() {
  const [sidebarItems, setSidebarItems] = useState<DashboardSidebarItem[]>(ADMIN_SAFE_MENUS);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const roles = JSON.parse(localStorage.getItem('roles') || '[]') as string[];
      const isAdminContext = roles.some((role) => ADMIN_ROLE_ALLOWLIST.includes(String(role).toUpperCase()));
      if (!isAdminContext) {
        setSidebarItems(ADMIN_CORE_MENUS);
        return;
      }

      const response = await axiosInstance.get('/api/v1/menus/active');
      const menus = (response.data?.result || response.data || [])
        .filter((menu: any) => menu?.isActive !== false)
        .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      const dynamicMenus: DashboardSidebarItem[] = menus.map((menu: any) => ({
        key: `group-${menu.id}`,
        label: menu.name,
        icon: <Folder size={16} />,
        children: normalizeChildren(menu.menuItems || [], roles),
      }));

      setSidebarItems([...ADMIN_CORE_MENUS, ...dynamicMenus]);
    } catch (error) {
      console.error('Lỗi khi tải menu:', error);
      setSidebarItems(ADMIN_CORE_MENUS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
    const onMenuUpdated = () => fetchMenu();
    window.addEventListener('menuUpdated', onMenuUpdated);
    return () => window.removeEventListener('menuUpdated', onMenuUpdated);
  }, [fetchMenu]);

  return { sidebarItems, loading };
}
