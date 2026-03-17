import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Shirt, BarChart3, Settings, Folder } from 'lucide-react';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';

// Hàm map tên icon (string từ DB) sang Component của Lucide
const getIconComponent = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'dashboard': return <LayoutDashboard size={18} />;
    case 'users': return <Users size={18} />;
    case 'bookings': return <ShoppingBag size={18} />;
    case 'costumes': return <Shirt size={18} />;
    case 'reports': return <BarChart3 size={18} />;
    case 'settings': return <Settings size={18} />;
    default: return <Folder size={18} />; // Icon mặc định nếu DB không có
  }
};

export function useDynamicMenu() {
  const [sidebarItems, setSidebarItems] = useState<DashboardSidebarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Gọi API lấy Menu Active của Backend
        const response = await axiosInstance.get('/api/v1/menus/active');
        
        // Giả sử Backend trả về: { data: { menuItems: [...] } }
        // Cần xem response thực tế của ông để bóc tách cho đúng nhé
        const rawMenuItems = response.data?.result?.menuItems || response.data?.menuItems || [];

        // Hàm đệ quy map data từ Backend sang DashboardSidebarItem
        const mapBackendMenu = (items: any[]): DashboardSidebarItem[] => {
          return items.map((item: any) => ({
            key: item.id || item.url || item.title,
            label: item.title,
            path: item.url,
            icon: getIconComponent(item.icon),
            children: item.children && item.children.length > 0 
              ? mapBackendMenu(item.children) 
              : undefined,
          }));
        };

        setSidebarItems(mapBackendMenu(rawMenuItems));
      } catch (error) {
        console.error('Lỗi khi tải menu động:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { sidebarItems, loading };
}