import { Card, Row, Col, Statistic, Button, Space, Typography, Spin } from 'antd';
import { Package, ShoppingBag, Calendar, Star } from 'lucide-react';
import { ProviderChatPanel } from '@/features/chat/components/ProviderChatPanel';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';
import { useProviderGate } from '../hooks/useProviderGate';
import { ProviderActivationGate } from '../components/ProviderActivationGate';
import { ProviderProfileCompletionGate } from '../components/ProviderProfileCompletionGate';

const { Text }= Typography;

export default function ProviderHomePage() {
  const navigate = useNavigate();

  // Verification gating
  const {
    verified, profileComplete, profileLoading,
    plans, plansLoading, plansError,
    selectedPlanId, setSelectedPlanId,
    selectedMethod, setSelectedMethod,
    handleSubscribe, subscribing, subscribeError,
  } = useProviderGate();

  // Convert provider sidebar items to DashboardLayout format
  const sidebarItems: DashboardSidebarItem[] = providerSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  // TODO: Fetch real stats from API when implemented
  const stats = [
    {
      title: VI.provider.dashboard.stats.activeListings,
      value: 24,
      icon: <Package size={24} />,
      color: '#7C3AED',
    },
    {
      title: VI.provider.dashboard.stats.pendingBookings,
      value: 8,
      icon: <ShoppingBag size={24} />,
      color: '#EC4899',
    },
    {
      title: VI.provider.dashboard.stats.upcomingSchedule,
      value: 15,
      icon: <Calendar size={24}/>,
      color: '#10B981',
    },
    {
      title: VI.provider.dashboard.stats.averageRating,
      value: 4.8,
      icon: <Star size={24} />,
      color: '#F59E0B',
      precision: 1,
    },
  ];

  return (
    <DashboardLayout title={VI.provider.dashboard.title} sidebarItems={sidebarItems} brandName="CosMate Provider">
      {/* Profile loading state */}
      {profileLoading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <p style={{ color: '#6B7280', marginTop: 16 }}>{VI.provider.activation.loadingProfile}</p>
        </div>
      )}

      {/* Activation gate — shown when verified === false */}
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

      {/* Profile completion gate — shown when verified but profile incomplete */}
      {!profileLoading && verified === true && profileComplete === false && (
        <ProviderProfileCompletionGate
          onComplete={() => navigate('/provider/settings/completion')}
        />
      )}

      {/* Dashboard content — shown only when verified and profile complete */}
      {!profileLoading && verified === true && profileComplete === true && (
        <>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{VI.provider.dashboard.welcome}</h2>
        <p style={{ color: '#6B7280', fontSize: 13 }}>
          {VI.provider.dashboard.overview}
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[12, 12]}>
        {stats.map((stat, index) => (
          <Col xs={24}sm={12} lg={6}key={index}>
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
                  precision={stat.precision}
                  valueStyle={{ color: stat.color, fontSize: 22, fontWeight: 700 }}
                />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
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

      {/* Costume Management Section */}
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
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
        <Col xs={24}lg={12}>
          <Card
            title={VI.provider.dashboard.sections.recentBookings}
            bordered={false}
            style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '32px 0' }}>
              {VI.provider.dashboard.sections.recentBookingsPlaceholder}
            </p>
          </Card>
        </Col>
        <Col xs={24}lg={12}>
          <Card
            title={VI.provider.dashboard.sections.performanceOverview}
            bordered={false}
            style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '32px 0' }}>
              {VI.provider.dashboard.sections.performancePlaceholder}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Messages Section */}
      <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="Messages"
            bordered={false}
            style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            styles={{ body: { padding: 0 } }}
          >
            <ProviderChatPanel />
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title={VI.provider.dashboard.sections.quickTips}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <ul style={{ color: '#6B7280', marginBottom: 0 }}>
              {VI.provider.dashboard.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
      </>
      )}
    </DashboardLayout>
  );
}
