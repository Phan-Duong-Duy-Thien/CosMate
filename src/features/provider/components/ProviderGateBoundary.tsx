/**
 * Blocks provider portal content until subscription is paid (verified)
 * and profile is complete. Applied globally via DashboardLayout.
 */
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { VI } from '@/shared/i18n/vi';
import { useProviderGate } from '../hooks/useProviderGate';
import { ProviderActivationGate } from './ProviderActivationGate';
import { ProviderProfileCompletionGate } from './ProviderProfileCompletionGate';
import {
  getProviderSettingsCompletionPath,
  isProviderProfileSettingsPath,
} from '../utils/providerGatePaths';
import type { DashboardContentMode } from '@/app/layouts/dashboardContentMode';
import { cn } from '@/lib/utils';

type ProviderGateBoundaryProps = {
  children: ReactNode;
  contentMode?: DashboardContentMode;
};

export function ProviderGateBoundary({
  children,
  contentMode = 'scroll',
}: ProviderGateBoundaryProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    verified,
    profileComplete,
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

  const settingsPath = isProviderProfileSettingsPath(location.pathname);

  if (profileLoading && verified === null && profileComplete === null) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-20">
        <Spin size="large" />
        <p className="mt-4 text-muted-foreground">{VI.provider.activation.loadingProfile}</p>
      </div>
    );
  }

  if (verified === false) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
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
      </div>
    );
  }

  if (verified === true && profileComplete === false && !settingsPath) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ProviderProfileCompletionGate
          onComplete={() => navigate(getProviderSettingsCompletionPath(location.pathname))}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-0 w-full',
        contentMode === 'fill' ? 'flex min-h-0 flex-1 flex-col' : undefined,
      )}
    >
      {children}
    </div>
  );
}
