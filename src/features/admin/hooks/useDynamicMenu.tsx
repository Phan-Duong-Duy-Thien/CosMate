import { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  BarChart3,
  Folder,
  Menu as MenuIcon,
  CreditCard,
  Coins,
  Settings,
} from 'lucide-react';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import type { LucideIcon } from 'lucide-react';
import { getRoles } from '@/features/auth/services/tokenStorage';
import * as menuApi from '@/features/admin/api/menu.api';

type MenuItemDto = {
  id?: string;
  title?: string;
  url?: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
  children?: MenuItemDto[];
};

type MenuGroupDto = {
  id?: string;
  name?: string;
  displayOrder?: number;
  isActive?: boolean;
  menuItems?: MenuItemDto[];
};

const getIconComponent = (iconName?: string): LucideIcon => {
  switch (iconName?.toLowerCase()) {
    case 'dashboard': return LayoutDashboard;
    case 'users': return Users;
    case 'bookings': return ShoppingBag;
    case 'costumes': return Shirt;
    case 'reports': return BarChart3;
    case 'menu': return MenuIcon;
    case 'subscription':
    case 'credit-card':
    case 'creditcard': return CreditCard;
    case 'coins':
    case 'token':
    case 'ai-token': return Coins;
    default: return Folder;
  }
};

const ADMIN_CORE_MENUS: DashboardSidebarItem[] = [
  { key: '/admin', label: 'Trang chủ', path: '/admin', icon: <LayoutDashboard size={16} /> },
  { key: '/admin/menus', label: 'Quản lý menu', path: '/admin/menus', icon: <MenuIcon size={16} /> },
  { key: '/admin/system-configs', label: 'Cấu hình hệ thống', path: '/admin/system-configs', icon: <Settings size={16} /> },
];

const ADMIN_ROLE_ALLOWLIST = ['SUPERADMIN', 'ADMIN', '2'];
const CORE_MENU_PATHS = new Set(ADMIN_CORE_MENUS.map((item) => item.path).filter(Boolean) as string[]);

const normalizeChildren = (children: MenuItemDto[] = []): DashboardSidebarItem[] => {
  return children
    .filter((item) => item?.isActive !== false && item?.url && !CORE_MENU_PATHS.has(item.url))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((item) => {
      const Icon = getIconComponent(item.icon);
      return {
        key: String(item.url),
        label: item.title || item.url || 'Menu item',
        path: item.url,
        icon: <Icon size={16} />,
        children: normalizeChildren(item.children || []),
      };
    });
};

const getMenuGroupItems = async (menu: MenuGroupDto): Promise<MenuItemDto[]> => {
  if (menu.menuItems && menu.menuItems.length > 0) return menu.menuItems;
  if (!menu.id) return [];

  try {
    const response = await menuApi.getMenuItems(String(menu.id));
    return (response?.result || response || []) as MenuItemDto[];
  } catch {
    return [];
  }
};

export function useDynamicMenu() {
  const [sidebarItems, setSidebarItems] = useState<DashboardSidebarItem[]>(ADMIN_CORE_MENUS);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const roles = getRoles().map((role) => String(role).toUpperCase());
      const isAdminContext = roles.some((role) => ADMIN_ROLE_ALLOWLIST.includes(role));
      if (!isAdminContext) {
        setSidebarItems(ADMIN_CORE_MENUS);
        return;
      }

      const menus = (await menuApi.getMenus()) as MenuGroupDto[];
      const safeMenus = Array.isArray(menus) ? menus : [];

      const dynamicMenus: DashboardSidebarItem[] = [];
      for (const menu of safeMenus.filter((menu) => menu?.isActive !== false).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))) {
        const menuItems = await getMenuGroupItems(menu);
        const children = normalizeChildren(menuItems);
        if (!children.length) continue;

        dynamicMenus.push({
          key: `group-${menu.id || menu.name}`,
          label: menu.name || 'Menu',
          icon: <Folder size={16} />,
          children,
        });
      }

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
