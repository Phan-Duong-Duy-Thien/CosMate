import { Card, Row, Col, Statistic } from 'antd';
import { Users, ShoppingBag, Shirt, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { useDynamicMenu } from '../hooks/useDynamicMenu';
import { VI } from '@/shared/i18n/vi';

export default function AdminHomePage() {
  // Lấy data đệ quy từ Backend
  const { sidebarItems } = useDynamicMenu();

  // TODO: Fetch real stats from API when implemented
  const stats = [
    {
      title: VI.admin.dashboard.stats.totalUsers,
      value: 2458,
      icon: <Users size={24} />,
      color: '#7C3AED',
    },
    {
      title: VI.admin.dashboard.stats.activeBookings,
      value: 128,
      icon: <ShoppingBag size={24} />,
      color: '#EC4899',
    },
    {
      title: VI.admin.dashboard.stats.totalCostumes,
      value: 5432,
      icon: <Shirt size={24} />,
      color: '#10B981',
    },
    {
      title: VI.admin.dashboard.stats.revenue,
      value: 123456789,
      icon: <TrendingUp size={24} />,
      color: '#F59E0B',
      prefix: '₫',
    },
  ];

  return (
    <DashboardLayout 
      title={VI.admin.dashboard.title} 
      sidebarItems={sidebarItems} 
      brandName={VI.common.appNameAdmin}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{VI.admin.dashboard.welcome}</h2>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          {VI.admin.dashboard.todayOverview}
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
                  prefix={stat.prefix}
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
            title={VI.admin.dashboard.sections.recentActivity}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
              {VI.admin.dashboard.sections.recentActivityPlaceholder}
            </p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={VI.admin.dashboard.sections.quickStats}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
              {VI.admin.dashboard.sections.quickStatsPlaceholder}
            </p>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}