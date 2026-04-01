/**
 * ProviderProfileCompletionPage
 *
 * 2-phase profile completion flow:
 * Phase 1: Address selection/creation
 * Phase 2: Provider info update (shopName, bio, bank info)
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Button, Steps, Form, Input, Select, Spin, Alert, Row, Col, Typography, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems, photographSidebarItems, eventStaffSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';
import { useProviderProfileCompletion } from '../hooks/useProviderProfileCompletion';
import { useProviderVerification } from '../hooks/useProviderVerification';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ProviderProfileCompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, refetch } = useProviderVerification();

  // Sync API profile data into form when profile loads
  useEffect(() => {
    if (profile) {
      if (profile.shopName) updateFormField('shopName', profile.shopName);
      if (profile.bio) updateFormField('bio', profile.bio);
      if (profile.bankAccountNumber) updateFormField('bankAccountNumber', profile.bankAccountNumber);
      if (profile.bankName) updateFormField('bankName', profile.bankName);
    }
  }, [profile]);

  // Determine which home page to navigate to based on current route
  const homePath = location.pathname.startsWith('/provider-photograph')
    ? '/provider-photograph'
    : location.pathname.startsWith('/provider-event-staff')
    ? '/provider-event-staff'
    : '/provider-rental';
  const [currentPhase, setCurrentPhase] = useState(0);

  const {
    addresses,
    addressesLoading,
    selectedAddressId,
    setSelectedAddressId,
    isCreatingAddress,
    createAddress,
    formData,
    updateFormField,
    saving,
    saveError,
    submit,
    provinces,
    districts,
    locationLoading,
    loadDistricts,
    providerId,
    uploadAvatar,
    uploadCoverImage,
  } = useProviderProfileCompletion();

  // Address creation form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');

  // Determine sidebar and brand based on current route role
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

  const handleCreateAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      const province = provinces.find((p) => p.code === Number(values.provinceCode));
      const district = districts.find((d) => d.code === Number(values.districtCode));

      await createAddress(
        {
          name: '',
          phone: values.phone,
          provinceCode: Number(values.provinceCode),
          districtCode: Number(values.districtCode),
          streetAddress: values.streetAddress,
          addressName: '',
        },
        province?.name || '',
        district?.name || ''
      );
      setShowAddressForm(false);
      addressForm.resetFields();
      setSelectedProvince(null);
    } catch {
      // Validation error handled by form
    }
  };

  const handleSubmit = async () => {
    const addrId = selectedAddressId;
    if (!addrId) return;
    const success = await submit(addrId);
    if (success) {
      // Refetch profile so the dashboard gets updated state
      await refetch();
      navigate(homePath);
    }
  };

  const canProceedToPhase2 = selectedAddressId !== null;
  const canProceedToPhase2Check = formData.shopName && formData.bio && formData.bankAccountNumber && formData.bankName;

  return (
    <DashboardLayout
      title={VI.provider.profileCompletion.pageTitle}
      sidebarItems={sidebarItems}
      brandName={brandName}
    >
      <Card style={{ borderRadius: 12 }}>
        {/* Phase indicator */}
        <Steps
          current={currentPhase}
          style={{ marginBottom: 32 }}
          items={[
            {
              title: VI.provider.profileCompletion.step1Title,
              subTitle: VI.provider.profileCompletion.step1SubTitle,
            },
            {
              title: VI.provider.profileCompletion.step2Title,
              subTitle: VI.provider.profileCompletion.step2SubTitle,
            },
          ]}
        />

        {/* Phase 1: Address */}
        {currentPhase === 0 && (
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              {VI.provider.profileCompletion.phase1Title}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              {VI.provider.profileCompletion.phase1Desc}
            </Paragraph>

            {addressesLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin />
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  {VI.provider.profileCompletion.loadingAddresses}
                </Text>
              </div>
            ) : (
              <>
                {/* Existing addresses */}
                {addresses.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                      {VI.provider.profileCompletion.existingAddresses}
                    </Text>
                    <Radio.Group
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value as number)}
                      style={{ width: '100%' }}
                    >
                      <Row gutter={[12, 12]}>
                        {addresses.map((addr) => (
                          <Col xs={24} sm={12} key={addr.id}>
                            <Card
                              hoverable
                              style={{
                                borderRadius: 8,
                                border: selectedAddressId === addr.id ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                                background: selectedAddressId === addr.id ? '#F5F3FF' : '#fff',
                              }}
                              onClick={() => setSelectedAddressId(addr.id)}
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
                  </div>
                )}

                {/* Create new address */}
                {showAddressForm ? (
                  <Card
                    title={VI.provider.profileCompletion.createNewAddress}
                    style={{ marginBottom: 16, borderRadius: 8 }}
                  >
                    <Form form={addressForm} layout="vertical">
                      <Row gutter={12}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="phone"
                            label={VI.provider.profileCompletion.formPhone}
                            rules={[{ required: true, message: VI.provider.profileCompletion.formPhoneRequired }]}
                          >
                            <Input placeholder={VI.provider.profileCompletion.formPhonePlaceholder} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="provinceCode"
                            label={VI.provider.profileCompletion.formCity}
                            rules={[{ required: true, message: VI.provider.profileCompletion.formCityRequired }]}
                          >
                            <Select
                              placeholder={VI.provider.profileCompletion.formCityPlaceholder}
                              loading={locationLoading}
                              onChange={(val) => {
                                const p = provinces.find((pr) => pr.code === Number(val));
                                setProvinceName(p?.name || '');
                                setSelectedProvince(Number(val));
                                addressForm.setFieldValue('districtCode', undefined);
                                loadDistricts(Number(val));
                              }}
                              showSearch
                              optionFilterProp="label"
                            >
                              {provinces.map((p) => (
                                <Select.Option key={p.code} value={p.code} label={p.name}>
                                  {p.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="districtCode"
                            label={VI.provider.profileCompletion.formDistrict}
                            rules={[{ required: true, message: VI.provider.profileCompletion.formDistrictRequired }]}
                          >
                            <Select
                              placeholder={VI.provider.profileCompletion.formDistrictPlaceholder}
                              loading={locationLoading}
                              disabled={!selectedProvince}
                              onChange={(val) => {
                                const d = districts.find((dt) => dt.code === Number(val));
                                setDistrictName(d?.name || '');
                              }}
                              showSearch
                              optionFilterProp="label"
                            >
                              {districts.map((d) => (
                                <Select.Option key={d.code} value={d.code} label={d.name}>
                                  {d.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="streetAddress"
                        label={VI.provider.profileCompletion.formStreet}
                        rules={[{ required: true, message: VI.provider.profileCompletion.formStreetRequired }]}
                      >
                        <Input placeholder={VI.provider.profileCompletion.formStreetPlaceholder} />
                      </Form.Item>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button onClick={() => { setShowAddressForm(false); addressForm.resetFields(); }}>
                          {VI.common.actions.cancel}
                        </Button>
                        <Button type="primary" loading={isCreatingAddress} onClick={handleCreateAddress}>
                          {VI.provider.profileCompletion.createAddressBtn}
                        </Button>
                      </div>
                    </Form>
                  </Card>
                ) : (
                  <Button onClick={() => setShowAddressForm(true)}>
                    + {VI.provider.profileCompletion.addNewAddress}
                  </Button>
                )}

                {/* Phase 1 nav */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    disabled={!canProceedToPhase2}
                    onClick={() => setCurrentPhase(1)}
                  >
                    {VI.common.actions.next}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}


        {/* Phase 2: Provider info */}
        {currentPhase === 1 && (
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              {VI.provider.profileCompletion.phase2Title}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              {VI.provider.profileCompletion.phase2Desc}
            </Paragraph>

            <Form layout="vertical" style={{ maxWidth: 600 }}>
              <Form.Item
                label={VI.provider.profileCompletion.formShopName}
                required
              >
                <Input
                  value={formData.shopName}
                  onChange={(e) => updateFormField('shopName', e.target.value)}
                  placeholder={VI.provider.profileCompletion.formShopNamePlaceholder}
                />
              </Form.Item>

              <Form.Item
                label={VI.provider.profileCompletion.formBio}
              >
                <TextArea
                  value={formData.bio}
                  onChange={(e) => updateFormField('bio', e.target.value)}
                  placeholder={VI.provider.profileCompletion.formBioPlaceholder}
                  rows={4}
                />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={VI.provider.profileCompletion.formBankNumber}
                  >
                    <Input
                      value={formData.bankAccountNumber}
                      onChange={(e) => updateFormField('bankAccountNumber', e.target.value)}
                      placeholder={VI.provider.profileCompletion.formBankNumberPlaceholder}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={VI.provider.profileCompletion.formBankName}
                  >
                    <Select
                      value={formData.bankName || undefined}
                      onChange={(val) => updateFormField('bankName', val)}
                      placeholder={VI.provider.profileCompletion.formBankNamePlaceholder}
                      showSearch
                      optionFilterProp="label"
                    >
                      {['Vietcombank', 'VietinBank', 'BIDV', 'Agribank', 'TPBank', 'MB Bank', 'ACB', 'Techcombank', 'VPBank', 'Sacombank', 'Shinhan Bank', 'Citibank'].map((bank) => (
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
            {providerId && (
              <div style={{ marginTop: 24 }}>
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
                        {profile?.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid #e2e8f0',
                              marginBottom: 12,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              background: '#ddd6fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 28,
                              fontWeight: 700,
                              color: '#7c3aed',
                              margin: '0 auto 12px',
                            }}
                          >
                            {formData.shopName?.charAt(0)?.toUpperCase() ?? 'S'}
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            await uploadAvatar(file);
                            await refetch();
                            e.target.value = '';
                          }}
                          style={{ display: 'none' }}
                          id="completion-avatar-upload"
                        />
                        <label
                          htmlFor="completion-avatar-upload"
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
                        {profile?.coverImageUrl ? (
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
                            await refetch();
                            e.target.value = '';
                          }}
                          style={{ display: 'none' }}
                          id="completion-cover-upload"
                        />
                        <label
                          htmlFor="completion-cover-upload"
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

            {saveError && (
              <Alert type="error" description={saveError} style={{ marginBottom: 16 }} showIcon />
            )}

            <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <Button onClick={() => setCurrentPhase(0)}>
                {VI.common.actions.previous}
              </Button>
              <Button
                type="primary"
                loading={saving}
                onClick={async () => {
                  const ok = await submit(selectedAddressId!);
                  if (ok) {
                    await refetch();
                    navigate(homePath);
                  }
                }}
                disabled={!canProceedToPhase2Check}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
