/**
 * ProviderProfileEditPage
 *
 * Edit page for provider profile — fetched from GET /api/providers/id/{providerId}.
 * Form is pre-filled with current data. Saves via PUT /api/providers/{id}.
 */
import { useLocation } from 'react-router-dom';
import { Card, Spin, Button, Form, Input, Select, Row, Col, Typography, Radio, Modal, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from '../constants/sidebar';
import { useProviderProfileEdit } from '../hooks/useProviderProfileEdit';
import { useEffect, useState } from 'react';
import type { UpsertUserAddressPayload, UserAddress } from '@/features/profile/types';
import { useVnLocation } from '@/features/profile/hooks/useVnLocation';
import { ProvinceSelect, DistrictSelect } from '@/features/profile/components/AddressLocationSelects';
import { matchAdminUnitByName } from '@/shared/utils/vnLocationNormalize';
import { VI } from '@/shared/i18n/vi';
import { buildLegacyAddressPayload } from '@/features/profile/services/addressPayload.service';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ProviderProfileEditPage() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [editingAddressCity, setEditingAddressCity] = useState<string | null>(null);
  const [editingAddressDistrict, setEditingAddressDistrict] = useState<string | null>(null);
  const [addressForm] = Form.useForm<UpsertUserAddressPayload>();
  const {
    provinceCode,
    setProvinceCode,
    districtCode,
    setDistrictCode,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
  } = useVnLocation();
  const { items: breadcrumbItems } = useBreadcrumb();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    addresses,
    loading,
    saving,
    error,
    formData,
    updateField,
    save,
    uploadAvatar,
    uploadCoverImage,
    addressSaving,
    updateAddress,
    removeAddress,
  } =
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

  const isRentalProviderEdit = location.pathname === '/provider/settings/edit';
  const showBackButton = !isRentalProviderEdit && breadcrumbItems.length < 2;

  const handleSave = async () => {
    const ok = await save();
    if (ok) {
      navigate(settingsPath);
    }
  };

  const handleOpenEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setEditingAddressCity(address.city);
    setEditingAddressDistrict(address.district);
    setProvinceCode(null);
    setDistrictCode(null);
    addressForm.setFieldsValue({
      name: address.name,
      phone: address.phone,
      city: address.city,
      district: address.district,
      address: address.address,
      addressName: '',
    });
    setIsAddressModalOpen(true);
  };

  useEffect(() => {
    if (!isAddressModalOpen || !editingAddressCity || provinceCode != null || provinces.length === 0) {
      return;
    }
    const matched = matchAdminUnitByName(provinces, editingAddressCity);
    if (matched) setProvinceCode(matched.code);
  }, [isAddressModalOpen, editingAddressCity, provinceCode, provinces, setProvinceCode]);

  useEffect(() => {
    if (
      !isAddressModalOpen ||
      !editingAddressDistrict ||
      provinceCode == null ||
      districtCode != null ||
      districts.length === 0
    ) {
      return;
    }
    const matched = matchAdminUnitByName(districts, editingAddressDistrict);
    if (matched) setDistrictCode(matched.code);
  }, [
    isAddressModalOpen,
    editingAddressDistrict,
    provinceCode,
    districtCode,
    districts,
    setDistrictCode,
  ]);

  const handleSubmitAddress = async () => {
    if (!editingAddress) return;
    const values = await addressForm.validateFields();
    const province = provinces.find((p) => p.code === provinceCode);
    const district = districts.find((d) => d.code === districtCode);
    if (!province || !district) {
      message.error(VI.profile.address.validation.required);
      return;
    }
    const ok = await updateAddress(
      editingAddress.id,
      buildLegacyAddressPayload({
        name: values.name.trim(),
        phone: values.phone.trim(),
        addressName: values.addressName?.trim() ?? '',
        provinceName: province.name,
        wardName: district.name,
        detailAddress: values.address.trim(),
      })
    );
    if (!ok) return;
    setIsAddressModalOpen(false);
    setEditingAddress(null);
    setEditingAddressCity(null);
    setEditingAddressDistrict(null);
    setProvinceCode(null);
    setDistrictCode(null);
    addressForm.resetFields();
  };

  const handleDeleteAddress = async (addressId: number) => {
    const ok = await removeAddress(addressId);
    if (!ok) return;
    if (formData.shopAddressId === addressId) {
      updateField('shopAddressId', null);
    }
  };

  return (
    <DashboardLayout
      title="Chỉnh sửa hồ sơ"
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName={brandName}
    >
      <div className="mx-auto w-full max-w-2xl space-y-4">
      {showBackButton && (
        <Button type="link" icon={<ArrowLeft size={16} />} onClick={() => navigate(settingsPath)} className="px-0 text-foreground hover:text-muted-foreground">
          Quay lại
        </Button>
      )}

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

          <Form layout="vertical" className="w-full">
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
                                ? "2px solid var(--primary)"
                                : "1px solid var(--border)",
                            background:
                              formData.shopAddressId === addr.id ? "var(--cosmate-lavender-surface)" : "var(--card)",
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
                              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                <Button size="small" onClick={() => handleOpenEditAddress(addr)}>
                                  Sửa
                                </Button>
                                <Popconfirm
                                  title="Xóa địa chỉ này?"
                                  okText="Xóa"
                                  cancelText="Hủy"
                                  okButtonProps={{ danger: true }}
                                  onConfirm={() => void handleDeleteAddress(addr.id)}
                                >
                                  <Button size="small" danger loading={addressSaving}>
                                    Xóa
                                  </Button>
                                </Popconfirm>
                              </div>
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
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--cosmate-page)",
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar"
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: "3px solid var(--border)",
                            marginBottom: 12,
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: "color-mix(in oklch, var(--primary) 30%, var(--background))",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            fontWeight: 700,
                            color: "var(--primary)",
                            marginBottom: 12,
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
                          background: "color-mix(in oklch, var(--cosmate-pink) 14%, var(--background))",
                          color: "var(--cosmate-rose-tag-text)",
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
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--cosmate-page)",
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
                            border: "2px solid var(--border)",
                            marginBottom: 12,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: 72,
                            borderRadius: 6,
                            background: "color-mix(in oklch, var(--primary) 16%, var(--background))",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: "var(--primary)",
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
                          background: "color-mix(in oklch, var(--primary) 16%, var(--background))",
                          color: "var(--primary)",
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

      </div>

      <Modal
        open={isAddressModalOpen}
        title="Cập nhật địa chỉ"
        okText="Lưu địa chỉ"
        cancelText="Hủy"
        onCancel={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
          setEditingAddressCity(null);
          setEditingAddressDistrict(null);
          setProvinceCode(null);
          setDistrictCode(null);
          addressForm.resetFields();
        }}
        confirmLoading={addressSaving}
        onOk={() => void handleSubmitAddress()}
      >
        <Form form={addressForm} layout="vertical">
          <Form.Item name="name" label="Người nhận" rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}>
            <Input placeholder="Người nhận" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^\+?[0-9]{9,15}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item label={VI.profile.address.form.city} required>
            <ProvinceSelect
              variant="modal"
              provinceCode={provinceCode}
              provinces={provinces}
              loading={loadingProvinces}
              hasError={isAddressModalOpen && provinceCode == null}
              onProvinceChange={(code, province) => {
                setProvinceCode(code);
                setDistrictCode(null);
                setEditingAddressDistrict(null);
                addressForm.setFieldValue('city', province?.name ?? '');
                addressForm.setFieldValue('district', '');
              }}
            />
          </Form.Item>
          <Form.Item label={VI.profile.address.form.district} required>
            <DistrictSelect
              variant="modal"
              provinceCode={provinceCode}
              districtCode={districtCode}
              districts={districts}
              loading={loadingDistricts}
              hasError={isAddressModalOpen && districtCode == null}
              onDistrictChange={(code, district) => {
                setDistrictCode(code);
                addressForm.setFieldValue('district', district?.name ?? '');
              }}
            />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}>
            <Input placeholder="Số nhà, đường..." />
          </Form.Item>
          <Form.Item name="addressName" label="Tên địa chỉ">
            <Input placeholder="VD: Nhà riêng" />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
