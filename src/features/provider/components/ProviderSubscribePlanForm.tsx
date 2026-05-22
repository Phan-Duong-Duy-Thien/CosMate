/**
 * ProviderSubscribePlanForm — shared plan + payment UI (Ant Design).
 * Used by activation gate and subscription renew modal.
 */
import { Alert, Button, Card, Col, Radio, Row, Spin, Tag, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import type { SubscriptionPlan } from '../types';

const { Text } = Typography;

type PaymentMethod = 'VNPAY' | 'MOMO';

export interface ProviderSubscribePlanFormProps {
  plans: SubscriptionPlan[];
  plansLoading: boolean;
  plansError: string | null;
  selectedPlanId: number | null;
  onSelectPlan: (planId: number) => void;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onSubscribe: () => void;
  subscribing: boolean;
  subscribeError: string | null;
  submitLabel?: string;
  submittingLabel?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getPlanLabel(months: number): string {
  if (months === 1) return VI.provider.activation.planMonth;
  if (months === 3) return VI.provider.activation.planQuarter;
  if (months === 12) return VI.provider.activation.planYear;
  return `${months} ${VI.provider.activation.planCustom}`;
}

export function ProviderSubscribePlanForm({
  plans,
  plansLoading,
  plansError,
  selectedPlanId,
  onSelectPlan,
  selectedMethod,
  onSelectMethod,
  onSubscribe,
  subscribing,
  subscribeError,
  submitLabel = VI.provider.activation.ctaSubscribe,
  submittingLabel = VI.provider.activation.subscribing,
}: ProviderSubscribePlanFormProps) {
  const canSubmit = Boolean(selectedPlanId && selectedMethod && !subscribing && !plansLoading);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          {VI.provider.activation.choosePlan}
        </Text>

        {plansLoading && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin />
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              {VI.provider.activation.loadingPlans}
            </Text>
          </div>
        )}

        {plansError && !plansLoading && (
          <Alert type="error" showIcon description={VI.provider.activation.errorGeneric} />
        )}

        {!plansLoading && !plansError && (
          <Row gutter={[12, 12]}>
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <Col xs={24} sm={8} key={plan.id}>
                  <Card
                    hoverable
                    onClick={() => onSelectPlan(plan.id)}
                    style={{
                      borderRadius: 12,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--cosmate-lavender-surface)' : 'var(--card)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                    styles={{ body: { padding: '16px 12px' } }}
                  >
                    {isSelected && (
                      <CheckCircleOutlined
                        style={{
                          color: 'var(--primary)',
                          fontSize: 18,
                          marginBottom: 4,
                          display: 'block',
                        }}
                      />
                    )}
                    <Tag color="purple" style={{ marginBottom: 8 }}>
                      {getPlanLabel(plan.billingCycleMonths)}
                    </Tag>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                      {formatPrice(plan.price)}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {plan.name}
                    </Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          {VI.provider.activation.paymentMethod}
        </Text>
        <Radio.Group
          value={selectedMethod}
          onChange={(e) => onSelectMethod(e.target.value as PaymentMethod)}
          style={{ width: '100%' }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <Radio.Button
                value="VNPAY"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  height: 44,
                  lineHeight: '42px',
                  borderRadius: 8,
                }}
              >
                {VI.provider.activation.payWithVnpay}
              </Radio.Button>
            </Col>
            <Col xs={24} sm={12}>
              <Radio.Button
                value="MOMO"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  height: 44,
                  lineHeight: '42px',
                  borderRadius: 8,
                }}
              >
                {VI.provider.activation.payWithMomo}
              </Radio.Button>
            </Col>
          </Row>
        </Radio.Group>
      </div>

      {subscribeError && (
        <Alert
          type="error"
          description={VI.provider.activation.errorGeneric}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        loading={subscribing}
        disabled={!canSubmit}
        onClick={onSubscribe}
        style={{ borderRadius: 8, height: 48, fontSize: 16 }}
      >
        {subscribing ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}
