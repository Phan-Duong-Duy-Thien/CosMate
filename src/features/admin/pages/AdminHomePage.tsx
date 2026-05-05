import { Card, Col, Row, Statistic, Skeleton, Typography } from 'antd';
import { Users, ShoppingBag, Shirt, TrendingUp } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const DASHBOARD_STATS = (summary: any) => [
  { title: VI.admin.dashboard.stats.totalUsers, value: summary?.totalUsers ?? 0, icon: <Users size={24} />, color: '#7C3AED' },
  { title: VI.admin.dashboard.stats.activeBookings, value: summary?.totalOrders ?? 0, icon: <ShoppingBag size={24} />, color: '#EC4899' },
  { title: VI.admin.dashboard.stats.totalCostumes, value: summary?.totalCostumes ?? 0, icon: <Shirt size={24} />, color: '#10B981' },
  { title: VI.admin.dashboard.stats.revenue, value: summary?.revenueThisMonth ?? 0, icon: <TrendingUp size={24} />, color: '#F59E0B', prefix: '₫' },
];

export default function AdminHomePage() {
  const { summary, loading } = useAdminDashboard();

  const stats = DASHBOARD_STATS(summary);

  return (
    <div className="w-full h-full">
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>{VI.admin.dashboard.welcome}</Typography.Title>
        <Typography.Text type="secondary">{VI.admin.dashboard.todayOverview}</Typography.Text>
      </div>

      <Row gutter={[12, 12]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
              {loading ? <Skeleton active paragraph={false} /> : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Statistic title={stat.title} value={stat.value} prefix={stat.prefix} valueStyle={{ color: stat.color, fontSize: 22, fontWeight: 700 }} />
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
