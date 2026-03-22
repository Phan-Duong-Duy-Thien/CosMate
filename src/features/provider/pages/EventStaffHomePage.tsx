/**
 * Event Staff Provider Home Page
 * Portal entry page for PROVIDER_EVENT_STAFF role.
 * Uses DashboardLayout + subscription gating via useProviderGate.
 */
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin } from 'antd';
import { Briefcase, Calendar, Star } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { eventStaffSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';
import { useProviderGate } from '../hooks/useProviderGate';
import { ProviderActivationGate } from '../components/ProviderActivationGate';

const { Text } = Typography;

export default function EventStaffHomePage() {
  const {
    verified, profileLoading,
    plans, plansLoading, plansError,
    selectedPlanId, setSelectedPlanId,
    selectedMethod, setSelectedMethod,
    handleSubscribe, subscribing, subscribeError,
  } = useProviderGate();

  const sidebarItems: DashboardSidebarItem[] = eventStaffSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  const stats = [
    {
      title: VI.provider.dashboard.stats.pendingBookings,
      value: 0,
      icon: <Briefcase size={24} />,
      color: '#7C3AED',
    },
    {
      title: VI.provider.dashboard.stats.upcomingSchedule,
      value: 0,
      icon: <Calendar size={24} />,
      color: '#10B981',
    },
    {
      title: VI.provider.dashboard.stats.averageRating,
      value: 0,
      icon: <Star size={24} />,
      color: '#F59E0B',
      precision: 1,
    },
  ];

  return (
    <DashboardLayout title={VI.provider.dashboardEventStaff.title} sidebarItems={sidebarItems} brandName="CosMate Event Staff">
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
        <>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{VI.provider.dashboardEventStaff.welcome}</h2>
            <p style={{ color: '#6B7280', fontSize: 14 }}>
              {VI.provider.dashboardEventStaff.overview}
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      precision={stat.precision}
                      valueStyle={{ color: stat.color, fontSize: 24, fontWeight: 700 }}
                    />
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${stat.color}15`,
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

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card
                title={VI.provider.dashboard.sections.recentBookings}
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
                  {VI.provider.dashboard.sections.recentBookingsPlaceholder}
                </p>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={VI.provider.dashboard.sections.performanceOverview}
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
                  {VI.provider.dashboard.sections.performancePlaceholder}
                </p>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </DashboardLayout>
  );
}
