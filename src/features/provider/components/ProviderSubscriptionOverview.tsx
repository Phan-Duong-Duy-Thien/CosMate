/**
 * ProviderSubscriptionOverview — presentational subscription summary (Ant Design).
 */
import { Alert, Card, Col, Row, Spin, Statistic } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import type { ProviderSubscriptionInfo } from '../types';

const STAT_CARD_STYLE = {
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
} as const;

interface ProviderSubscriptionOverviewProps {
  info: ProviderSubscriptionInfo | null;
  loading: boolean;
  error: string | null;
}

export function ProviderSubscriptionOverview({
  info,
  loading,
  error,
}: ProviderSubscriptionOverviewProps) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" showIcon message={error} />;
  }

  if (!info) {
    return <Alert type="info" showIcon message={VI.provider.subscription.empty} />;
  }

  return (
    <div className="space-y-4">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={STAT_CARD_STYLE}>
            <Statistic
              title={VI.provider.subscription.currentPlan}
              value={info.currentPlanName}
              prefix={<CrownOutlined style={{ color: 'var(--cosmate-pink)' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: 'var(--cosmate-pink)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={STAT_CARD_STYLE}>
            <Statistic
              title={VI.provider.subscription.currentDaysRemaining}
              value={info.currentDaysRemaining}
              suffix={VI.provider.subscription.daysSuffix}
              valueStyle={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={STAT_CARD_STYLE}>
            <Statistic
              title={VI.provider.subscription.totalRemainingDays}
              value={info.totalRemainingDays}
              suffix={VI.provider.subscription.daysSuffix}
              valueStyle={{ fontSize: 22, fontWeight: 700, color: 'var(--cosmate-success)' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        title={VI.provider.subscription.summaryTitle}
        style={STAT_CARD_STYLE}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} md={8}>
            <div className="text-sm text-muted-foreground">{VI.provider.subscription.currentPlan}</div>
            <div className="mt-1 text-base font-semibold text-foreground">{info.currentPlanName}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-sm text-muted-foreground">{VI.provider.subscription.currentDaysRemaining}</div>
            <div className="mt-1 text-base font-semibold text-foreground">
              {info.currentDaysRemaining} {VI.provider.subscription.daysSuffix}
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-sm text-muted-foreground">{VI.provider.subscription.totalRemainingDays}</div>
            <div className="mt-1 text-base font-semibold text-foreground">
              {info.totalRemainingDays} {VI.provider.subscription.daysSuffix}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
