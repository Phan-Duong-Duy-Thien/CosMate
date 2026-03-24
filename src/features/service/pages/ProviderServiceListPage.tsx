/**
 * Provider Service List Page
 *
 * Lists all services created by the current provider.
 * Data flow: Page → hooks → services → API → axiosInstance
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Typography, Button, Spin, Image, Card } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderGate } from '@/features/provider/hooks/useProviderGate';
import { ProviderActivationGate } from '@/features/provider/components/ProviderActivationGate';
import { useProviderServices } from '../hooks/useProviderServices';
import { useProviderVerification } from '@/features/provider/hooks/useProviderVerification';
import type { ServiceItem } from '../types';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import { VI } from '@/shared/i18n/vi';

const { Text } = Typography;

function deriveSidebarItems(): DashboardSidebarItem[] {
  const roles = getRoles();
  const base = roles.includes(ROLE.PROVIDER_PHOTOGRAPH)
    ? photographSidebarItems
    : eventStaffSidebarItems;
  return base.map((item) => {
    const Icon = item.icon;
    return { key: item.key, label: item.label, icon: <Icon size={18} />, path: item.path };
  });
}

function deriveBrandName(): string {
  const roles = getRoles();
  return roles.includes(ROLE.PROVIDER_PHOTOGRAPH) ? 'CosMate Photographer' : 'CosMate Event Staff';
}

function deriveCreatePath(): string {
  const roles = getRoles();
  return roles.includes(ROLE.PROVIDER_PHOTOGRAPH)
    ? '/provider-photograph/serviceCreate'
    : '/provider-event-staff/serviceCreate';
}

function getStatusTagColor(status: string): string {
  if (status === 'ACTIVE') return 'green';
  if (status === 'INACTIVE') return 'red';
  return 'blue';
}

function getStatusLabel(status: string): string {
  if (status === 'ACTIVE') return VI.service.list.status.active;
  if (status === 'INACTIVE') return VI.service.list.status.inactive;
  return status;
}

function formatPrice(value: number | null): string {
  if (value === null || value === 0) return '-';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND';
}

export default function ProviderServiceListPage() {
  const navigate = useNavigate();
  const {
    verified,
    profileLoading,
    plans,
    plansLoading,
    plansError,
    selectedPlanId,
    setSelectedPlanId,
    selectedMethod,
    setSelectedMethod,
    handleSubscribe,
    subscribing,
    subscribeError,
  } = useProviderGate();

  const { profile } = useProviderVerification();
  const { services, loading, refetch } = useProviderServices(profile?.id ?? 0);

  const sidebarItems = deriveSidebarItems();
  const brandName = deriveBrandName();
  const createPath = deriveCreatePath();

  useEffect(() => {
    if (profile?.id) {
      refetch();
    }
  }, [profile?.id]);

  const columns: TableProps<ServiceItem>['columns'] = [
    {
      title: VI.service.list.table.coverImage,
      key: 'cover',
      width: 80,
      render: (_, record) =>
        record.imageUrls && record.imageUrls.length > 0 ? (
          <Image src={record.imageUrls[0]} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: 8 }} />
        ),
    },
    {
      title: VI.service.list.table.serviceType,
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 140,
      render: (val: string) => <Tag color="purple">{val}</Tag>,
    },
    {
      title: VI.service.list.table.description,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (val: string) => <Text type="secondary">{val}</Text>,
    },
    {
      title: VI.service.list.table.slotDuration,
      dataIndex: 'slotDurationHours',
      key: 'slotDurationHours',
      width: 120,
      render: (val: number) => `${val}h`,
    },
    {
      title: VI.service.list.table.pricePerSlot,
      dataIndex: 'pricePerSlot',
      key: 'pricePerSlot',
      width: 150,
      render: (val: number) => formatPrice(val),
    },
    {
      title: VI.service.list.table.status,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (val: string) => <Tag color={getStatusTagColor(val)}>{getStatusLabel(val)}</Tag>,
    },
  ];

  return (
    <DashboardLayout title={VI.service.list.pageTitle} sidebarItems={sidebarItems} brandName={brandName}>
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
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Button icon={<ReloadOutlined />} onClick={refetch} loading={loading}>
              {VI.service.list.messages.refresh}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(createPath)}>
              {VI.service.list.createButton}
            </Button>
          </div>

          <Card style={{ borderRadius: 12 }}>
            {loading && services.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            )}

            {!loading && services.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary" style={{ fontSize: 16 }}>{VI.service.list.empty}</Text>
                <br />
                <Text type="secondary">{VI.service.list.emptyHint}</Text>
              </div>
            )}

            {services.length > 0 && (
              <Table
                columns={columns}
                dataSource={services}
                rowKey="id"
                pagination={false}
              />
            )}
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
