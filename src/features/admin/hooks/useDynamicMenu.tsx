import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Shirt, BarChart3, Settings, Folder, Menu as MenuIcon } from 'lucide-react';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';

const getIconComponent = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'dashboard': return <LayoutDashboard size={18} />;
    case 'users': return <Users size={18} />;
    case 'bookings': return <ShoppingBag size={18} />;
    case 'costumes': return <Shirt size={18} />;
    case 'reports': return <BarChart3 size={18} />;
    case 'settings': return <Settings size={18} />;
    case 'menu': return <MenuIcon size={18} />;
    default: return <Folder size={18} />;
  }
};

export function useDynamicMenu() {
  const [sidebarItems, setSidebarItems] = useState<DashboardSidebarItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/menus/active');
      const menus = response.data?.result || response.data || [];

      // 1. Code cứng 2 nút quan trọng nhất
      const safeMenus: DashboardSidebarItem[] = [
        { key: '/admin', label: 'Trang chủ', path: '/admin', icon: <LayoutDashboard size={18} /> },
        { key: '/admin/menus', label: 'Quản lý Menu', path: '/admin/menus', icon: <MenuIcon size={18} /> },
      ];

      // 2. MENU ĐỘNG TỪ DATABASE
      const dynamicMenus: DashboardSidebarItem[] = menus.map((menu: any) => ({
        key: `group-${menu.id}`,
        label: menu.name,
        icon: <Folder size={18} />,
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