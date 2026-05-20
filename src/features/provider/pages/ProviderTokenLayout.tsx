import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '../constants/sidebar';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { VI } from '@/shared/i18n/vi';

function mapSidebar(items: typeof providerSidebarItems): DashboardSidebarItem[] {
  return items.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });
}

export function ProviderTokenLayout() {
  return (
    <DashboardLayout
      title={VI.profile.token.hubTitle}
      sidebarItems={mapSidebar(providerSidebarItems)}
      brandName="CosMate"
      brandShort="CM"
      showChatButton
    >
      <Outlet />
    </DashboardLayout>
  );
}
