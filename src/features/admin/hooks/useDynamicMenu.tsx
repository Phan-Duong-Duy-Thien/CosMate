import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Shirt, BarChart3, Settings, Folder, Menu as MenuIcon } from 'lucide-react';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import type { LucideIcon } from 'lucide-react';

const getIconComponent = (iconName?: string): LucideIcon => {
  switch (iconName?.toLowerCase()) {
    case 'dashboard': return LayoutDashboard;
    case 'users': return Users;
    case 'bookings': return ShoppingBag;
    case 'costumes': return Shirt;
    case 'reports': return BarChart3;
    case 'settings': return Settings;
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

      // 1. Code cứng 2 nút quan trọng nhất
      const safeMenus: DashboardSidebarItem[] = [
        { key: '/admin', label: 'Trang chủ', path: '/admin', icon: LayoutDashboard },
        { key: '/admin/menus', label: 'Quản lý menu', path: '/admin/menus', icon: MenuIcon },
      ];

      // 2. MENU ĐỘNG TỪ DATABASE
      const dynamicMenus: DashboardSidebarItem[] = menus.map((menu: any) => ({
        key: `group-${menu.id}`,
        label: menu.name,
        icon: Folder,
        children: (menu.menuItems || []).map((item: any) => ({
          key: item.url || item.id,
          label: item.title,
          path: item.url,
          icon: getIconComponent(item.icon),
        }))
      }));

      // Gộp menu cứng và menu động lại
      setSidebarItems([...safeMenus, ...dynamicMenus]);
    } catch (error) {
      console.error('Lỗi khi tải menu:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. AUTO-RELOAD KHI CÓ SỰ THAY ĐỔI TỪ TRANG QUẢN LÝ
  useEffect(() => {
    fetchMenu();
    window.addEventListener('menuUpdated', fetchMenu);
    return () => window.removeEventListener('menuUpdated', fetchMenu);
  }, [fetchMenu]);

  return { sidebarItems, loading };
}