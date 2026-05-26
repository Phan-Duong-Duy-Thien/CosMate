/**
 * ProviderSubscriptionPlansPreview — inline plan cards; selection opens renew modal.
 */
import { Alert, Button, Col, Row, Spin, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { formatBillingCycleMonths } from '@/features/admin/utils/formatBillingCycleMonths';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import { VI } from '@/shared/i18n/vi';
import type { SubscriptionPlan } from '../types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getPlanCycleLabel(plan: SubscriptionPlan): string {
  if (plan.cycleLabel && plan.cycleLabel !== '—') {
    return plan.cycleLabel;
  }
  return formatBillingCycleMonths(
    plan.billingCycleMonths ?? plan.cycleMonths ?? 0,
    plan.billingCycle ?? '',
  );
}

interface ProviderSubscriptionPlansPreviewProps {
  onSelectPlan: (planId: number) => void;
}

export function ProviderSubscriptionPlansPreview({
  onSelectPlan,
}: ProviderSubscriptionPlansPreviewProps) {
  const { plans, loading, error } = useSubscriptionPlans(true);

  return (
    <section className="mt-8">
      <div className="mb-5 border-l-4 border-cosmate-pink pl-4">
        <h3 className="text-lg font-bold text-cosmate-ink">
          {VI.provider.subscription.plansSectionTitle}
        </h3>
        <p className="mt-1 text-sm text-cosmate-mauve">
          {VI.provider.subscription.plansSectionSubtitle}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center rounded-2xl border border-dashed border-cosmate-lavender-border py-14">
          <Spin />
        </div>
      )}

      {error && !loading && (
        <Alert type="error" showIcon message={VI.provider.subscription.plansLoadError} />
      )}

      {!loading && !error && plans.length === 0 && (
        <Alert type="info" showIcon message={VI.provider.subscription.plansEmpty} />
      )}

      {!loading && !error && plans.length > 0 && (
        <Row gutter={[16, 16]}>
          {plans.map((plan) => {
            const cycleLabel = getPlanCycleLabel(plan);
            const showCycleTag = cycleLabel && cycleLabel !== '—';

            return (
              <Col xs={24} sm={12} lg={8} key={plan.id}>
                <div className="group flex h-full flex-col rounded-2xl border border-cosmate-lavender-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cosmate-pink/35 hover:shadow-[0_8px_24px_color-mix(in_oklch,var(--cosmate-pink)_14%,transparent)]">
                  {showCycleTag && (
                    <Tag
                      color="magenta"
                      className="mb-3 w-fit border-0 font-medium"
                      style={{ marginInlineEnd: 0 }}
                    >
                      {cycleLabel}
                    </Tag>
                  )}
                  <p className="text-2xl font-bold text-cosmate-pink">{formatPrice(plan.price)}</p>
                  <p className="mt-1 font-semibold text-cosmate-ink">{plan.name}</p>
                  {plan.description && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-cosmate-mauve">
                      {plan.description}
                    </p>
                  )}
                  <Button
                    type="primary"
                    block
                    icon={<CheckCircleOutlined />}
                    className="mt-4 !h-10 !rounded-lg !font-semibold"
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {VI.provider.subscription.selectPlanCta}
                  </Button>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </section>
  );
}
