/**
 * ProviderRenewSubscriptionModal — renew / buy more subscription days (reuses subscribe API).
 */
import { useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import { useProviderSubscribe } from '../hooks/useProviderSubscribe';
import { ProviderSubscribePlanForm } from './ProviderSubscribePlanForm';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';
import { VI } from '@/shared/i18n/vi';

const { Paragraph } = Typography;

interface ProviderRenewSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  initialPlanId?: number | null;
}

export function ProviderRenewSubscriptionModal({
  open,
  onClose,
  initialPlanId = null,
}: ProviderRenewSubscriptionModalProps) {
  const { plans, loading: plansLoading, error: plansError } = useSubscriptionPlans(open);
  const { subscribe, loading: subscribing, error: subscribeError } = useProviderSubscribe();

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'VNPAY' | 'MOMO' | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedPlanId(null);
      setSelectedMethod(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && initialPlanId != null) {
      setSelectedPlanId(initialPlanId);
    }
  }, [open, initialPlanId]);

  const handleSubscribe = () => {
    if (!selectedPlanId || !selectedMethod) return;
    subscribe({
      subscriptionPlanId: selectedPlanId,
      returnUrl: getReturnUrl(selectedMethod),
      paymentMethod: selectedMethod,
    });
  };

  return (
    <Modal
      title={VI.provider.subscription.renewModalTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      destroyOnClose
      styles={{ body: { paddingTop: 8, maxHeight: 'min(75vh, 720px)', overflowY: 'auto' } }}
    >
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        {VI.provider.subscription.renewModalSubtitle}
      </Paragraph>
      <ProviderSubscribePlanForm
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
        submitLabel={VI.provider.subscription.renewSubmit}
        submittingLabel={VI.provider.subscription.renewSubmitting}
      />
    </Modal>
  );
}
