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

const ADMIN_SAFE_MENUS: DashboardSidebarItem[] = [
  { key: '/admin', label: 'Trang chủ', path: '/admin', icon: <LayoutDashboard size={16} /> },
  { key: '/admin/users', label: 'Người dùng', path: '/admin/users', icon: <Users size={16} /> },
  { key: '/admin/providers', label: 'Provider', path: '/admin/providers', icon: <ShoppingBag size={16} /> },
  { key: '/admin/costumes', label: 'Trang phục', path: '/admin/costumes', icon: <Shirt size={16} /> },
  { key: '/admin/orders', label: 'Đơn hàng', path: '/admin/orders', icon: <BarChart3 size={16} /> },
  { key: '/admin/reports', label: 'Báo cáo', path: '/admin/reports', icon: <BarChart3 size={16} /> },
  { key: '/admin/menus', label: 'Quản lý menu', path: '/admin/menus', icon: <MenuIcon size={16} /> },
];

const canShowForRole = (item: any, roles: string[]) => {
  const allowed = item.visibleForRoles as string[] | undefined;
  if (!allowed || allowed.length === 0) return true;
  return roles.some((role) => allowed.includes(role));
};

const normalizeChildren = (children: any[] = [], roles: string[]): DashboardSidebarItem[] => {
  return children
    .filter((item) => item?.isActive !== false && item?.url && canShowForRole(item, roles) && (!item.requiredPermission || roles.includes(item.requiredPermission)))
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
      const response = await axiosInstance.get('/api/v1/menus/active');
      const menus = (response.data?.result || response.data || [])
        .filter((menu: any) => menu?.isActive !== false && canShowForRole(menu, roles))
        .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      const dynamicMenus: DashboardSidebarItem[] = menus.map((menu: any) => ({
        key: `group-${menu.id}`,
        label: menu.name,
        icon: <Folder size={16} />,
        children: normalizeChildren(menu.menuItems || [], roles),
      })).filter((menu: DashboardSidebarItem) => menu.children && menu.children.length > 0);

      setSidebarItems([...ADMIN_SAFE_MENUS, ...dynamicMenus]);
    } catch (error) {
      console.error('Lỗi khi tải menu:', error);
      setSidebarItems(ADMIN_SAFE_MENUS);
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
