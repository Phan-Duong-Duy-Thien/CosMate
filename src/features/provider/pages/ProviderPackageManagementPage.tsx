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
import { ProviderSubscriptionPlansPreview } from '../components/ProviderSubscriptionPlansPreview';
import { ProviderRenewSubscriptionModal } from '../components/ProviderRenewSubscriptionModal';
import { VI } from '@/shared/i18n/vi';

export default function ProviderPackageManagementPage() {
  const location = useLocation();
  const { info, loading, error } = useProviderSubscriptionInfo();
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [preselectedPlanId, setPreselectedPlanId] = useState<number | null>(null);

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

  const openRenew = (planId?: number) => {
    setPreselectedPlanId(planId ?? null);
    setRenewModalOpen(true);
  };

  const closeRenew = () => {
    setRenewModalOpen(false);
    setPreselectedPlanId(null);
  };

  return (
    <DashboardLayout
      title={VI.provider.subscription.pageTitle}
      sidebarItems={sidebarItems}
      brandName={brandName}
      showChatButton={false}
    >
      <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cosmate-lavender-border bg-gradient-to-r from-cosmate-soft-pink/30 to-transparent px-4 py-3 sm:px-5">
          <p className="max-w-2xl text-sm leading-relaxed text-cosmate-mauve">
            {VI.provider.subscription.pageSubtitle}
          </p>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => openRenew()}
            className="!h-10 !rounded-lg !px-5 !font-semibold shadow-[0_4px_14px_color-mix(in_oklch,var(--cosmate-pink)_35%,transparent)]"
          >
            {VI.provider.subscription.renewButton}
          </Button>
        </div>

        <ProviderSubscriptionOverview info={info} loading={loading} error={error} />

        {!loading && !error && info && (
          <ProviderSubscriptionPlansPreview onSelectPlan={(id) => openRenew(id)} />
        )}

        <ProviderRenewSubscriptionModal
          open={renewModalOpen}
          onClose={closeRenew}
          initialPlanId={preselectedPlanId}
        />
      </>
    </DashboardLayout>
  );
}
