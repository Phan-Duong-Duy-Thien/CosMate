/**
 * ProviderPackageManagementPage — subscription info + renew for all provider portals.
 */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import {
  providerSidebarItems,
  photographSidebarItems,
  eventStaffSidebarItems,
} from '../constants/sidebar';
import { useProviderSubscriptionInfo } from '../hooks/useProviderSubscriptionInfo';
import { ProviderSubscriptionOverview } from '../components/ProviderSubscriptionOverview';
import { ProviderRenewSubscriptionModal } from '../components/ProviderRenewSubscriptionModal';
import { VI } from '@/shared/i18n/vi';

export default function ProviderPackageManagementPage() {
  const location = useLocation();
  const { info, loading, error } = useProviderSubscriptionInfo();
  const [renewModalOpen, setRenewModalOpen] = useState(false);

  const isPhotograph = location.pathname.startsWith('/provider-photograph');
  const isEventStaff = location.pathname.startsWith('/provider-event-staff');

  const rawSidebarItems = isPhotograph
    ? photographSidebarItems
    : isEventStaff
      ? eventStaffSidebarItems
      : providerSidebarItems;

  const sidebarItems: DashboardSidebarItem[] = rawSidebarItems.map((item) => {
    const Icon = item.icon;
    return { key: item.key, label: item.label, icon: <Icon size={18} />, path: item.path };
  });

  const brandName = isPhotograph
    ? 'CosMate Photographer'
    : isEventStaff
      ? 'CosMate Event Staff'
      : 'CosMate Provider';

  return (
    <DashboardLayout
      title={VI.provider.subscription.pageTitle}
      sidebarItems={sidebarItems}
      brandName={brandName}
      showChatButton={false}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-4 flex shrink-0 flex-wrap items-start justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
              {VI.provider.subscription.pageTitle}
            </h2>
            <p className="text-[13px] text-muted-foreground">{VI.provider.subscription.pageSubtitle}</p>
          </div>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setRenewModalOpen(true)}
          >
            {VI.provider.subscription.renewButton}
          </Button>
        </div>
        <ProviderSubscriptionOverview info={info} loading={loading} error={error} />
      </div>

      <ProviderRenewSubscriptionModal
        open={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
      />
    </DashboardLayout>
  );
}
