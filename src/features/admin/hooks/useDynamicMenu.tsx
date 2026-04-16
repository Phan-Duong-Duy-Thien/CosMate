import { useState, useEffect, useCallback } from 'react';
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

export function useDynamicMenu() {
  const [sidebarItems, setSidebarItems] = useState<DashboardSidebarItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/menus/active');
      let menus = response.data?.result || response.data || [];
      menus = menus.filter((menu: any) => menu.isActive === true);

      const safeMenus: DashboardSidebarItem[] = [
        { key: '/admin', label: 'Trang chủ', path: '/admin', icon: <LayoutDashboard size={16} /> },
        { key: '/admin/users', label: 'Người dùng', path: '/admin/users', icon: <Users size={16} /> },
        { key: '/admin/providers', label: 'Provider', path: '/admin/providers', icon: <ShoppingBag size={16} /> },
        { key: '/admin/costumes', label: 'Trang phục', path: '/admin/costumes', icon: <Shirt size={16} /> },
        { key: '/admin/orders', label: 'Đơn hàng', path: '/admin/orders', icon: <BarChart3 size={16} /> },
        { key: '/admin/reports', label: 'Báo cáo', path: '/admin/reports', icon: <BarChart3 size={16} /> },
        { key: '/admin/menus', label: 'Quản lý menu', path: '/admin/menus', icon: <MenuIcon size={16} /> },
      ];

      const dynamicMenus: DashboardSidebarItem[] = menus.map((menu: any) => ({
        key: `group-${menu.id}`,
        label: menu.name,
        icon: <Folder size={16} />,
        children: (menu.menuItems || []).map((item: any) => {
          const Icon = getIconComponent(item.icon)
          return {
            key: item.url || item.id,
            label: item.title,
            path: item.url,
            icon: <Icon size={16} />,
          }
        })
      }));

      setSidebarItems([...safeMenus, ...dynamicMenus]);
    } catch (error) {
      console.error('Lỗi khi tải menu:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
    window.addEventListener('menuUpdated', fetchMenu);
    return () => window.removeEventListener('menuUpdated', fetchMenu);
  }, [fetchMenu]);

  return { sidebarItems, loading };
}
