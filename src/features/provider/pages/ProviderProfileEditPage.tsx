/**
 * ProviderProfileEditPage
 *
 * Edit page for provider profile — fetched from GET /api/providers/id/{providerId}.
 * Form is pre-filled with current data. Saves via PUT /api/providers/{id}.
 */
import { useLocation } from 'react-router-dom';
import { Card, Spin, Button, Form, Input, Select, Row, Col, Typography, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from '../constants/sidebar';
import { useProviderProfileEdit } from '../hooks/useProviderProfileEdit';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ProviderProfileEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, addresses, loading, saving, error, formData, updateField, save, refetch, uploadAvatar, uploadCoverImage } =
    useProviderProfileEdit();

  const isPhotograph = location.pathname.startsWith('/provider-photograph');
  const isEventStaff = location.pathname.startsWith('/provider-event-staff');

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

  const settingsPath = location.pathname.replace('/edit', '');

  const handleSave = async () => {
    const ok = await save();
    if (ok) {
      navigate(settingsPath);
    }
  };

  return (
    <DashboardLayout
      title="Chỉnh sửa hồ sơ"
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName={brandName}
    >
      <Button
        type="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate(settingsPath)}
        style={{ marginBottom: 16, paddingLeft: 4 }}
      >
        Quay lại
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Đang tải...
          </Text>
        </div>
      ) : error || !profile ? (
        <Card style={{ borderRadius: 12 }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="danger">{error ?? 'Không tìm thấy hồ sơ'}</Text>
          </div>
        </Card>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <Title level={4} style={{ marginBottom: 8 }}>
            Thông tin cửa hàng
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            Cập nhật thông tin cửa hàng và thông tin thanh toán của bạn.
          </Paragraph>

          <Form layout="vertical" style={{ maxWidth: 600 }}>
            {/* Shop Name */}
            <Form.Item label="Tên cửa hàng" required>
              <Input
                value={formData.shopName}
                onChange={(e) => updateField('shopName', e.target.value)}
                placeholder="VD: Cosplay Store Dũng"
              />
            </Form.Item>

            {/* Bio */}
            <Form.Item label="Giới thiệu">
              <TextArea
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Mô tả ngắn về cửa hàng của bạn..."
                rows={4}
              />
            </Form.Item>

            {/* Address */}
            {addresses.length > 0 && (
              <Form.Item label="Địa chỉ cửa hàng">
                <Radio.Group
                  value={formData.shopAddressId}
                  onChange={(e) => updateField('shopAddressId', e.target.value as number)}
                  style={{ width: '100%' }}
                >
                  <Row gutter={[12, 12]}>
                    {addresses.map((addr) => (
                      <Col xs={24} sm={12} key={addr.id}>
                        <Card
                          hoverable
                          style={{
                            borderRadius: 8,
                            border:
                              formData.shopAddressId === addr.id
                                ? '2px solid #7C3AED'
                                : '1px solid #E5E7EB',
                            background:
                              formData.shopAddressId === addr.id ? '#F5F3FF' : '#fff',
                          }}
                          onClick={() => updateField('shopAddressId', addr.id)}
                        >
                          <Radio value={addr.id}>
                            <div>
                              <Text strong>{addr.name}</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {addr.address}, {addr.district}, {addr.city}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {addr.phone}
                              </Text>
                            </div>
                          </Radio>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </Form.Item>
            )}

            {/* Bank Info */}
            <Title level={5} style={{ marginTop: 24 }}>
              Thông tin thanh toán
            </Title>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item label="Số tài khoản">
                  <Input
                    value={formData.bankAccountNumber}
                    onChange={(e) => updateField('bankAccountNumber', e.target.value)}
                    placeholder="VD: 1234567890"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Ngân hàng">
                  <Select
                    value={formData.bankName || undefined}
                    onChange={(val) => updateField('bankName', val)}
                    placeholder="Chọn ngân hàng"
                    showSearch
                    optionFilterProp="label"
                  >
                    {[
                      'Vietcombank',
                      'VietinBank',
                      'BIDV',
                      'Agribank',
                      'TPBank',
                      'MB Bank',
                      'ACB',
                      'Techcombank',
                      'VPBank',
                      'Sacombank',
                      'Shinhan Bank',
                      'Citibank',
                    ].map((bank) => (
                      <Select.Option key={bank} value={bank} label={bank}>
                        {bank}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* Avatar & Cover Image Upload */}
          {profile && (
            <div style={{ marginTop: 32 }}>
              <Title level={5} style={{ marginBottom: 12 }}>
                Ảnh đại diện & Ảnh bìa
              </Title>
              <Row gutter={[16, 16]}>
                {/* Avatar */}
                <Col xs={24} md={12}>
                  <Card
                    style={{
                      border: '1px solid #f1f5f9',
                      borderRadius: 8,
                      background: '#f8fafc',
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar"
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #e2e8f0',
                            marginBottom: 12,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: '#ddd6fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            fontWeight: 700,
                            color: '#7c3aed',
                            margin: '0 auto 12px',
                          }}
                        >
                          {profile.shopName?.charAt(0)?.toUpperCase() ?? 'P'}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await uploadAvatar(file);
                          e.target.value = '';
                        }}
                        style={{ display: 'none' }}
                        id="edit-avatar-upload"
                      />
                      <label
                        htmlFor="edit-avatar-upload"
                        style={{
                          display: 'inline-block',
                          borderRadius: 9999,
                          background: '#fce7f3',
                          color: '#be185d',
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Đổi ảnh
                      </label>
                      <Text
                        type="secondary"
                        style={{ display: 'block', marginTop: 6, fontSize: 11 }}
                      >
                        Tối thiểu 200x200px
                      </Text>
                    </div>
                  </Card>
                </Col>

                {/* Cover Image */}
                <Col xs={24} md={12}>
                  <Card
                    style={{
                      border: '1px solid #f1f5f9',
                      borderRadius: 8,
                      background: '#f8fafc',
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {profile.coverImageUrl ? (
                        <img
                          src={profile.coverImageUrl}
                          alt="Cover"
                          style={{
                            width: '100%',
                            height: 72,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '2px solid #e2e8f0',
                            marginBottom: 12,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: 72,
                            borderRadius: 6,
                            background: '#ede9fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: '#7c3aed',
                            marginBottom: 12,
                          }}
                        >
                          Chưa có ảnh bìa
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await uploadCoverImage(file);
                          e.target.value = '';
                        }}
                        style={{ display: 'none' }}
                        id="edit-cover-upload"
                      />
                      <label
                        htmlFor="edit-cover-upload"
                        style={{
                          display: 'inline-block',
                          borderRadius: 9999,
                          background: '#ede9fe',
                          color: '#7c3aed',
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Đổi ảnh bìa
                      </label>
                      <Text
                        type="secondary"
                        style={{ display: 'block', marginTop: 6, fontSize: 11 }}
                      >
                        Tỷ lệ 16:6, tối thiểu 1200x450px
                      </Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate(settingsPath)}>Hủy</Button>
            <Button
              type="primary"
              icon={<Save size={14} />}
              loading={saving}
              onClick={handleSave}
              disabled={!formData.shopName}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
