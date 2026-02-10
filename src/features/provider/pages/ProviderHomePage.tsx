import { Card, Row, Col, Statistic } from 'antd';
import { Package, ShoppingBag, Calendar, Star } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '../constants/sidebar';

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
      title: 'Active Listings',
      value: 24,
      icon: <Package size={24} />,
      color: '#7C3AED',
    },
    {
      title: 'Pending Bookings',
      value: 8,
      icon: <ShoppingBag size={24} />,
      color: '#EC4899',
    },
    {
      title: 'Upcoming Schedule',
      value: 15,
      icon: <Calendar size={24} />,
      color: '#10B981',
    },
    {
      title: 'Average Rating',
      value: 4.8,
      icon: <Star size={24} />,
      color: '#F59E0B',
      precision: 1,
    },
  ];

  return (
    <DashboardLayout title="Provider Dashboard" sidebarItems={sidebarItems} brandName="CosMate Provider">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Welcome back, Provider!</h2>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          Manage your services, bookings, and schedule from here.
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
            title="Recent Bookings"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
              TODO: Display recent booking requests and status updates
            </p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Performance Overview"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>
              TODO: Display charts for bookings, revenue, and ratings over time
            </p>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="Quick Tips"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <ul style={{ color: '#6B7280', marginBottom: 0 }}>
              <li>Keep your service listings up to date with accurate descriptions and photos</li>
              <li>Respond to booking requests within 24 hours to improve your rating</li>
              <li>Update your availability calendar regularly to avoid scheduling conflicts</li>
              <li>Encourage satisfied customers to leave reviews</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
