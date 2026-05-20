import { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin, Select, Alert } from 'antd';
import { Package, ShoppingBag, CheckCircle2, Banknote, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';
import { useProviderGate } from '../hooks/useProviderGate';
import { useProviderStatistics } from '../hooks/useProviderStatistics';
import { ProviderActivationGate } from '../components/ProviderActivationGate';
import { ProviderProfileCompletionGate } from '../components/ProviderProfileCompletionGate';
import { ProviderRevenueChart } from '../components/ProviderRevenueChart';

const { Text } = Typography;

const MONTHS_OPTIONS = [3, 6, 12] as const;

export default function ProviderHomePage() {
  const navigate = useNavigate();
  const [chartMonths, setChartMonths] = useState<number>(6);

  const {
    verified, profileComplete, profileLoading,
    plans, plansLoading, plansError,
    selectedPlanId, setSelectedPlanId,
    selectedMethod, setSelectedMethod,
    handleSubscribe, subscribing, subscribeError,
  } = useProviderGate();

  const { statistics, loading: statsLoading, error: statsError, refetch } =
    useProviderStatistics(chartMonths);

  const sidebarItems: DashboardSidebarItem[] = providerSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  const stats = useMemo(() => {
    const s = statistics;
    return [
      {
        title: VI.provider.dashboard.stats.totalCostumes,
        value: s?.totalCostumes ?? 0,
        icon: <Shirt size={24} />,
        color: 'var(--primary)',
      },
      {
        title: VI.provider.dashboard.stats.totalOrders,
        value: s?.totalOrders ?? 0,
        icon: <ShoppingBag size={24} />,
        color: 'var(--cosmate-pink)',
      },
      {
        title: VI.provider.dashboard.stats.completedOrders,
        value: s?.completedOrders ?? 0,
        icon: <CheckCircle2 size={24} />,
        color: 'var(--cosmate-success)',
      },
      {
        title: VI.provider.dashboard.stats.totalRevenue,
        value: s?.totalRevenue ?? 0,
        icon: <Banknote size={24} />,
        color: 'var(--cosmate-warning)',
        suffix: 'đ',
      },
    ];
  }, [statistics]);

  const showDashboard = !profileLoading && verified === true && profileComplete === true;

  return (
    <DashboardLayout title={VI.provider.dashboard.title} sidebarItems={sidebarItems} brandName="CosMate Provider" showChatButton={false}>
      {profileLoading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <p className="mt-4 text-muted-foreground">{VI.provider.activation.loadingProfile}</p>
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

      {!profileLoading && verified === true && profileComplete === false && (
        <ProviderProfileCompletionGate
          onComplete={() => navigate('/provider/settings/completion')}
        />
      )}

      {showDashboard && (
        <>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{VI.provider.dashboard.welcome}</h2>
              <p className="text-muted-foreground text-[13px]">{VI.provider.dashboard.overview}</p>
            </div>
            <Space>
              <span className="text-sm text-muted-foreground">{VI.provider.dashboard.charts.monthsFilter}</span>
              <Select
                value={chartMonths}
                onChange={setChartMonths}
                style={{ width: 160 }}
                options={MONTHS_OPTIONS.map((m) => ({
                  value: m,
                  label: VI.provider.dashboard.charts.monthsOption.replace('{count}', String(m)),
                }))}
              />
              <Button onClick={() => void refetch()} loading={statsLoading}>
                {VI.common.actions.refresh}
              </Button>
            </Space>
          </div>

          {statsError && (
            <Alert
              type="error"
              message={statsError}
              className="mb-4"
              showIcon
            />
          )}

          {statsLoading && !statistics ? (
            <div className="py-12 text-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[12, 12]}>
                {stats.map((stat, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{ color: stat.color, fontSize: 22, fontWeight: 700 }}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: `color-mix(in oklch, ${stat.color} 14%, transparent)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color,
                          }}
                        >
                          {stat.icon}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {statistics && statistics.totalOrderItems > 0 && (
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  <Col span={24}>
                    <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                      <Statistic
                        title={VI.provider.dashboard.stats.totalOrderItems}
                        value={statistics.totalOrderItems}
                        valueStyle={{ fontSize: 18, fontWeight: 600 }}
                      />
                    </Card>
                  </Col>
                </Row>
              )}

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card
                    title={VI.provider.costumeManagement.sectionTitle}
                    bordered={false}
                    style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                      {VI.provider.costumeManagement.sectionDesc}
                    </Text>
                    <Space>
                      <Button
                        type="primary"
                        icon={<Package size={16} />}
                        onClick={() => navigate('/provider-rental/costumes/create')}
                      >
                        {VI.provider.costumeManagement.createBtn}
                      </Button>
                      <Button onClick={() => navigate('/provider-rental/costumes')}>
                        {VI.provider.costumeManagement.listBtn}
                      </Button>
                      <Button onClick={() => navigate('/provider-rental/orders')}>
                        {VI.provider.orders.title}
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={VI.provider.dashboard.charts.revenueByMonth}
                    bordered={false}
                    style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    <ProviderRevenueChart
                      title=""
                      data={statistics?.revenueByMonth ?? []}
                      emptyText={VI.provider.dashboard.charts.noData}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={VI.provider.dashboard.charts.revenueByQuarter}
                    bordered={false}
                    style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    <ProviderRevenueChart
                      title=""
                      data={statistics?.revenueByQuarter ?? []}
                      emptyText={VI.provider.dashboard.charts.noData}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card
                    title={VI.provider.dashboard.sections.quickTips}
                    bordered={false}
                    style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <ul className="mb-0 text-muted-foreground">
                      {VI.provider.dashboard.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
