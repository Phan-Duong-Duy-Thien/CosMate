/**
 * ProviderProfileViewPage
 *
 * Public view of provider's own profile — fetched from GET /api/providers/id/{providerId}.
 * Shows shop info, stats, and an Edit button to navigate to the completion page.
 */
import { useLocation } from 'react-router-dom';
import { Card, Spin, Button, Avatar, Tag, Row, Col, Statistic, Descriptions, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Edit, Star, CheckCircle, ShoppingBag } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from '../constants/sidebar';
import { useCurrentProviderProfile } from '../hooks/useCurrentProviderProfile';

const { Title, Paragraph, Text } = Typography;

export default function ProviderProfileViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider, loading, error, refetch } = useCurrentProviderProfile();

  const isPhotograph = location.pathname.startsWith('/provider-photograph');
  const isEventStaff = location.pathname.startsWith('/provider-event-staff');
  const isRental = !isPhotograph && !isEventStaff;

  const rawSidebarItems = isPhotograph
    ? photographSidebarItems
    : isEventStaff
    ? eventStaffSidebarItems
    : providerSidebarItems;

  const sidebarItems: DashboardSidebarItem[] = rawSidebarItems.map((item) => {
    const Icon = item.icon;
    return { key: item.key, label: item.label, icon: <Icon size={18} />, path: item.path };
  });

  const brandName = isPhotograph
    ? 'CosMate Photographer'
    : isEventStaff
    ? 'CosMate Event Staff'
    : 'CosMate Provider';

  const handleEdit = () => {
    navigate(`${location.pathname}/edit`);
  };

  const coverBg =
    provider?.coverImageUrl ||
    "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1200";

  return (
    <DashboardLayout
      title="Hồ sơ cửa hàng"
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName={brandName}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Đang tải hồ sơ...
          </Text>
        </div>
      ) : error || !provider ? (
        <Card style={{ borderRadius: 12 }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="danger">{error ?? 'Không tìm thấy hồ sơ nhà cung cấp'}</Text>
            <br />
            <Button style={{ marginTop: 16 }} onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Cover + Avatar */}
          <Card
            style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                height: 200,
                backgroundImage: `url(${coverBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -48,
                  left: 24,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 16,
                }}
              >
                <Avatar
                  size={96}
                  src={provider.avatarUrl}
                  style={{
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                />
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Title level={4} style={{ margin: 0, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                      {provider.shopName ?? 'Chưa có tên cửa hàng'}
                    </Title>
                    {provider.verified && (
                      <Tag
                        color="blue"
                        icon={<CheckCircle size={12} />}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Đã xác minh
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '60px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                icon={<Edit size={14} />}
                onClick={handleEdit}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </Card>

          {/* Stats Row */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center' }}>
                <Statistic
                  title="Đơn hoàn thành"
                  value={provider.completedOrders ?? 0}
                  prefix={<ShoppingBag size={16} style={{ marginRight: 4 }} />}
                />
              </Card>
            </Col>
            <Col xs={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center' }}>
                <Statistic
                  title="Đánh giá"
                  value={provider.totalRating ?? 0}
                  precision={1}
                  prefix={<Star size={16} style={{ marginRight: 4, color: '#f59e0b' }} />}
                  suffix={`(${provider.totalReviews ?? 0})`}
                />
              </Card>
            </Col>
            <Col xs={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center' }}>
                <Statistic
                  title="Trạng thái"
                  value={provider.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                  prefix={provider.verified ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : null}
                />
              </Card>
            </Col>
          </Row>

          {/* Bio */}
          {provider.bio && (
            <Card title="Giới thiệu" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                {provider.bio}
              </Paragraph>
            </Card>
          )}

          {/* Bank Info */}
          <Card title="Thông tin thanh toán" style={{ borderRadius: 12, marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              {provider.bankName && (
                <Descriptions.Item label="Ngân hàng">{provider.bankName}</Descriptions.Item>
              )}
              {provider.bankAccountNumber && (
                <Descriptions.Item label="Số tài khoản">
                  <Text copyable={{ text: provider.bankAccountNumber }}>
                    {provider.bankAccountNumber}
                  </Text>
                </Descriptions.Item>
              )}
              {!provider.bankName && !provider.bankAccountNumber && (
                <Text type="secondary">Chưa cập nhật thông tin thanh toán</Text>
              )}
            </Descriptions>
          </Card>

        </>
      )}
    </DashboardLayout>
  );
}
