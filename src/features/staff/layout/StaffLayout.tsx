import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { staffSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';

export default function StaffLayout() {
  return (
    <DashboardLayout
      title={VI.staff.layout.title}
      sidebarItems={staffSidebarItems}
      brandName={VI.staff.layout.brandName}
      brandShort={VI.staff.layout.brandShort}
      showChatButton={true}
    />
  );
}
