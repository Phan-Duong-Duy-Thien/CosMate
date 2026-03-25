import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu';

export default function AdminLayout() {
  const { sidebarItems, loading } = useDynamicMenu();

  if (loading) return <div>Đang tải giao diện...</div>;

  return (
    <DashboardLayout title="Bảng điều khiển Admin" sidebarItems={sidebarItems} brandName="CosMate Admin">
      {/* Không cần để <Outlet /> ở đây, vì bên trong DashboardLayout đã xử lý rỗng sẽ tự gọi Outlet rồi */}
    </DashboardLayout>
  );
}