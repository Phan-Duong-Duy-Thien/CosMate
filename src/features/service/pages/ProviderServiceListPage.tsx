/**
 * Provider Service List Page
 *
 * Lists all services created by the current provider.
 * Data flow: Page → hooks → services → API → axiosInstance
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { Table, Tag, Typography, Button, Spin, Image, Card, Modal, Tooltip as RCTooltip, Popconfirm } from 'antd';
import { ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { CreateServiceForm } from '../components/CreateServiceForm';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { useViewService } from '../hooks/useViewService';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderGate } from '@/features/provider/hooks/useProviderGate';
import { ProviderActivationGate } from '@/features/provider/components/ProviderActivationGate';
import { useProviderServices } from '../hooks/useProviderServices';
import { useProviderVerification } from '@/features/provider/hooks/useProviderVerification';
import type { ServiceItem } from '../types';
import { SERVICE_TYPE } from '../types';
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

function deriveServiceType(): string {
  const roles = getRoles();
  return roles.includes(ROLE.PROVIDER_PHOTOGRAPH)
    ? SERVICE_TYPE.PHOTOGRAPHER
    : SERVICE_TYPE.EVENT_STAFF;
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
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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
  const { services, loading, refetch, deletingId, removeService } = useProviderServices(profile?.id ?? 0);
  const { serviceDetail, loading: viewLoading, error: viewError, open: openView, close: closeView } = useViewService();

  const sidebarItems = deriveSidebarItems();
  const brandName = deriveBrandName();
  const createPath = deriveCreatePath();
  const serviceType = deriveServiceType();

  useEffect(() => {
    if (profile?.id) {
      refetch();
    }
  }, [profile?.id]);

  const columns: TableProps<ServiceItem>['columns'] = [
    {
      title: VI.service.list.table.serviceName,
      key: 'serviceName',
      width: 180,
      ellipsis: true,
      render: (_, record) => <Text>{record.serviceName || record.description || '-'}</Text>,
    },
    {
      title: VI.service.list.table.serviceType,
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 140,
      render: (val: string) => <Tag color="purple">{val}</Tag>,
    },
    {
      title: VI.service.list.table.coverImage,
      key: 'cover',
      width: 80,
      render: (_, record) =>
        record.imageUrls && record.imageUrls.length > 0 ? (
          <Image src={record.imageUrls[0]} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />
        ) : (
          <div style={{ width: 60, height: 60, background: 'var(--muted)', borderRadius: 8 }} />
        ),
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
    {
      title: VI.service.list.table.actions,
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
          <RCTooltip title={VI.service.list.detail.viewButton}>
            <EyeOutlined
              onClick={() => {
                setViewModalOpen(true);
                openView(record.id);
              }}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
            />
          </RCTooltip>
          <RCTooltip title={VI.common.actions.edit}>
            <EditOutlined
              onClick={() => {
                setEditingService(record);
                setEditModalOpen(true);
              }}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-success)' }}
            />
          </RCTooltip>
          <Popconfirm
            title={VI.service.list.delete.confirmTitle}
            description={VI.service.list.delete.confirmDescription}
            okText={VI.common.actions.delete}
            cancelText={VI.common.actions.cancel}
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => void removeService(record.id)}
          >
            <RCTooltip title={VI.common.actions.delete}>
              <DeleteOutlined style={{ cursor: 'pointer', fontSize: 16, color: 'var(--destructive)' }} />
            </RCTooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title={VI.service.list.pageTitle} sidebarItems={sidebarItems} brandName={brandName} showChatButton={false}>
      {profileLoading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <p className="mt-4 text-muted-foreground">{VI.provider.activation.loadingProfile}</p>
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

      <Modal
        open={editModalOpen}
        title={VI.service.edit?.pageTitle ?? 'Chỉnh sửa dịch vụ'}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingService(null);
        }}
        footer={null}
        width={720}
        destroyOnClose
      >
        {editingService && (
          <CreateServiceForm
            mode="edit"
            serviceType={serviceType as 'Photographer' | 'Event Staff'}
            providerId={profile?.id ?? 0}
            editingService={editingService}
            onSuccess={() => {
              setEditModalOpen(false);
              setEditingService(null);
              refetch();
            }}
          />
        )}
      </Modal>

      <ServiceDetailModal
        open={viewModalOpen}
        loading={viewLoading}
        service={serviceDetail}
        error={viewError}
        onClose={() => {
          setViewModalOpen(false);
          closeView();
        }}
      />
    </DashboardLayout>
  );
}
