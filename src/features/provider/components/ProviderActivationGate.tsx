/**
 * ProviderActivationGate
 * Presentational blocking screen shown when provider.verified === false.
 * No API calls — receives data and callbacks via props.
 */
import { Card, Radio, Button, Alert, Spin, Typography, Row, Col, Tag } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import type { SubscriptionPlan } from '../types';

const { Title, Text, Paragraph } = Typography;

type PaymentMethod = 'VNPAY' | 'MOMO';

interface ProviderActivationGateProps {
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

export function ProviderActivationGate({
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
}: ProviderActivationGateProps) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{ maxWidth: 640, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: "color-mix(in oklch, var(--cosmate-warning) 22%, var(--background))",
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "var(--cosmate-warning)" }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>
            {VI.provider.activation.title}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {VI.provider.activation.subtitle}
          </Paragraph>
        </div>

        {/* Plans */}
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
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                        background: isSelected ? "var(--cosmate-lavender-surface)" : "var(--card)",
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                      styles={{ body: { padding: '16px 12px' } }}
                    >
                      {isSelected && (
                        <CheckCircleOutlined
                          style={{ color: "var(--primary)", fontSize: 18, marginBottom: 4, display: "block" }}
                        />
                      )}
                      <Tag color="purple" style={{ marginBottom: 8 }}>
                        {getPlanLabel(plan.billingCycleMonths)}
                      </Tag>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>
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

        {/* Payment method */}
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

        {/* Error */}
        {subscribeError && (
          <Alert
            type="error"
            description={VI.provider.activation.errorGeneric}
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        {/* CTA */}
        <Button
          type="primary"
          size="large"
          block
          loading={subscribing}
          disabled={subscribing || plansLoading}
          onClick={onSubscribe}
          style={{ borderRadius: 8, height: 48, fontSize: 16 }}
        >
          {subscribing ? VI.provider.activation.subscribing : VI.provider.activation.ctaSubscribe}
        </Button>
      </Card>
    </div>
  );
}
