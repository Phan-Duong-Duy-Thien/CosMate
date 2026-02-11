import { Card, Row, Col, Statistic } from 'antd';
import { Package, ShoppingBag, Calendar, Star } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';

export default function ProviderHomePage() {
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
      icon: <Calendar size={24} />,
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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{VI.provider.dashboard.welcome}</h2>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          {VI.provider.dashboard.overview}
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
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

      {/* Quick Actions */}
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

      {/* Additional Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
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
    </DashboardLayout>
  );
}
