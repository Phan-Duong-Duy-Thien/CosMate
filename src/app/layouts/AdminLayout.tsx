import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu';

export default function AdminLayout() {
  const { sidebarItems, setSidebarItems, loading } = useDynamicMenu();

  return (
    <DashboardLayout
      title="Bảng điều khiển Admin"
      sidebarItems={sidebarItems}
      onSidebarItemsChange={setSidebarItems}
      brandName="CosMate Admin"
      showChatButton={false}
      enableSidebarResize
      sidebarMenuLoading={loading}
    >
      {/* Không cần để <Outlet /> ở đây, vì bên trong DashboardLayout đã xử lý rỗng sẽ tự gọi Outlet rồi */}
    </DashboardLayout>
  );
}