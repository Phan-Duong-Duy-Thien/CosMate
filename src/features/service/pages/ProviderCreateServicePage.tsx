/**
 * Provider Create Service Page
 *
 * Service creation page for PROVIDER_PHOTOGRAPH and PROVIDER_EVENT_STAFF.
 * Wraps CreateServiceForm with DashboardLayout + subscription gate.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { CreateServiceForm } from '../components/CreateServiceForm';
import { useProviderGate } from '@/features/provider/hooks/useProviderGate';
import { useProviderVerification } from '@/features/provider/hooks/useProviderVerification';
import { ProviderActivationGate } from '@/features/provider/components/ProviderActivationGate';
import { VI } from '@/shared/i18n/vi';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import type { ServiceType } from '../types';
import { SERVICE_TYPE } from '../types';
import { getProviderShopAddress } from '@/features/provider/services/provider.service';
import { getUserId } from '@/features/auth/services/tokenStorage';
import type { UserAddress } from '@/features/profile/types';

function deriveServiceType(): ServiceType {
  const roles = getRoles();
  if (roles.includes(ROLE.PROVIDER_PHOTOGRAPH)) return SERVICE_TYPE.PHOTOGRAPHER;
  if (roles.includes(ROLE.PROVIDER_EVENT_STAFF)) return SERVICE_TYPE.EVENT_STAFF;
  return SERVICE_TYPE.PHOTOGRAPHER;
}

function deriveSidebarItems(serviceType: ServiceType): DashboardSidebarItem[] {
  const base =
    serviceType === SERVICE_TYPE.PHOTOGRAPHER
      ? photographSidebarItems
      : eventStaffSidebarItems;
  return base.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });
}

function deriveBrandName(serviceType: ServiceType): string {
  return serviceType === SERVICE_TYPE.PHOTOGRAPHER
    ? 'CosMate Photographer'
    : 'CosMate Event Staff';
}

export default function ProviderCreateServicePage() {
  const navigate = useNavigate();
  const [serviceType] = useState<ServiceType>(deriveServiceType);
  const [sidebarItems] = useState<DashboardSidebarItem[]>(() =>
    deriveSidebarItems(serviceType)
  );
  const [brandName] = useState<string>(() => deriveBrandName(serviceType));

  const {
    verified,
    profileLoading,
    plans,
    plansLoading,
    plansError,
    selectedPlanId,
    setSelectedPlanId,
    selectedMethod,
    setSelectedMethod,
    handleSubscribe,
    subscribing,
    subscribeError,
  } = useProviderGate();

  const { profile } = useProviderVerification();
  const [shopAddress, setShopAddress] = useState<UserAddress | null>(null);

  // Fetch shop address from profile when profile loads
  useEffect(() => {
    if (profile?.shopAddressId) {
      const userId = getUserId();
      if (userId) {
        getProviderShopAddress(userId, profile.shopAddressId)
          .then(setShopAddress)
          .catch(() => setShopAddress(null));
      }
    }
  }, [profile]);

  const handleSuccess = () => {
    const listPath =
      serviceType === SERVICE_TYPE.PHOTOGRAPHER
        ? '/provider-photograph/services'
        : '/provider-event-staff/services';
    navigate(listPath);
  };

  return (
    <DashboardLayout
      title={VI.service.create.pageTitle}
      sidebarItems={sidebarItems}
      brandName={brandName}
    >
      {profileLoading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <p style={{ color: '#6B7280', marginTop: 16 }}>{VI.provider.activation.loadingProfile}</p>
        </div>
      )}

      {!profileLoading && verified === false && (
        <ProviderActivationGate
          plans={plans}
          plansLoading={plansLoading}
          plansError={plansError}
          selectedPlanId={selectedPlanId}
          onSelectPlan={setSelectedPlanId}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          onSubscribe={handleSubscribe}
          subscribing={subscribing}
          subscribeError={subscribeError}
        />
      )}

      {!profileLoading && verified === true && (
        <div className="mx-auto max-w-3xl">
          <CreateServiceForm
            serviceType={serviceType}
            providerId={profile?.id ?? 0}
            shopAddress={shopAddress}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
