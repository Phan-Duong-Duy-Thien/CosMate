/**
 * Provider Service List Page
 *
 * Lists services for photograph / event-staff dashboards.
 * UI aligned with other provider dashboard list pages (toolbar + bordered table region).
 *
 * Data flow: Page → hooks → services → API → axiosInstance
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { Table, Tag, Spin, Modal, Tooltip, Popconfirm, Alert, Image } from 'antd';
import { ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { CreateServiceForm } from '../components/CreateServiceForm';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { useViewService } from '../hooks/useViewService';
import { useEditService } from '../hooks/useEditService';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderServices } from '../hooks/useProviderServices';
import { useProviderVerification } from '@/features/provider/hooks/useProviderVerification';
import type { ServiceItem } from '../types';
import { SERVICE_TYPE } from '../types';
import { getServiceTypeDisplayLabel } from '../utils/serviceTypeDisplay';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import { VI } from '@/shared/i18n/vi';
import { Button as UiButton } from '@/components/ui/button';

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
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProviderServiceListPage() {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { profile } = useProviderVerification();
  const {
    services,
    loading,
    error,
    refetch,
    deletingId,
    removeService,
  } = useProviderServices(profile?.id ?? 0);
  const { serviceDetail, loading: viewLoading, error: viewError, open: openView, close: closeView } = useViewService();
  const {
    editingService,
    loading: editLoading,
    error: editError,
    open: openEdit,
    close: closeEdit,
  } = useEditService();

  const sidebarItems = deriveSidebarItems();
  const brandName = deriveBrandName();
  const createPath = deriveCreatePath();
  const serviceType = deriveServiceType();

  const columns: TableProps<ServiceItem>['columns'] = [
    {
      title: VI.service.list.table.serviceName,
      key: 'serviceName',
      width: 180,
      ellipsis: true,
      render: (_, record) => (
        <span className="text-sm text-foreground">
          {record.serviceName || record.description || '-'}
        </span>
      ),
    },
    {
      title: VI.service.list.table.serviceType,
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 150,
      render: (val: string) => <Tag color="purple">{getServiceTypeDisplayLabel(val)}</Tag>,
    },
    {
      title: VI.service.list.table.coverImage,
      key: 'cover',
      width: 90,
      render: (_, record) =>
        record.imageUrls && record.imageUrls.length > 0 ? (
          <Image
            src={record.imageUrls[0]}
            alt=""
            width={60}
            height={60}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="h-[60px] w-[60px] shrink-0 rounded-lg bg-muted" aria-hidden />
        ),
    },
    {
      title: VI.service.list.table.description,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (val: string) => <span className="text-sm text-muted-foreground">{val}</span>,
    },
    {
      title: VI.service.list.table.slotDuration,
      dataIndex: 'slotDurationHours',
      key: 'slotDurationHours',
      width: 130,
      render: (val: number) => <span className="text-sm text-foreground">{`${val}h`}</span>,
    },
    {
      title: VI.service.list.table.pricePerSlot,
      dataIndex: 'pricePerSlot',
      key: 'pricePerSlot',
      width: 160,
      render: (val: number) => <span className="text-sm text-foreground">{formatPrice(val)}</span>,
    },
    {
      title: VI.service.list.table.status,
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (val: string) => <Tag color={getStatusTagColor(val)}>{getStatusLabel(val)}</Tag>,
    },
    {
      title: VI.service.list.table.actions,
      key: 'actions',
      width: 130,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Tooltip title={VI.service.list.detail.viewButton}>
            <EyeOutlined
              onClick={() => {
                setViewModalOpen(true);
                openView(record.id);
              }}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
            />
          </Tooltip>
          <Tooltip title={VI.common.actions.edit}>
            <EditOutlined
              onClick={() => {
                setEditModalOpen(true);
                void openEdit(record.id);
              }}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-success)' }}
            />
          </Tooltip>
          <Popconfirm
            title={VI.service.list.delete.confirmTitle}
            description={VI.service.list.delete.confirmDescription}
            okText={VI.common.actions.delete}
            cancelText={VI.common.actions.cancel}
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => void removeService(record.id)}
          >
            <Tooltip title={VI.common.actions.delete}>
              <DeleteOutlined style={{ cursor: 'pointer', fontSize: 16, color: 'var(--destructive)' }} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title={VI.service.list.pageTitle} sidebarItems={sidebarItems} brandName={brandName} showChatButton={false}>
          {error && <Alert type="error" message={error} className="mb-4" />}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <UiButton variant="cosmateOutline" disabled={loading} type="button" onClick={() => void refetch()}>
              <ReloadOutlined className={loading ? 'animate-spin' : ''} />
              {VI.service.list.messages.refresh}
            </UiButton>
            <UiButton variant="cosmate" type="button" onClick={() => navigate(createPath)}>
              <PlusOutlined />
              {VI.service.list.createButton}
            </UiButton>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {loading && services.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <Spin />
              </div>
            )}

            {!loading && services.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1 px-4 py-16 text-center">
                <p className="text-base text-muted-foreground">{VI.service.list.empty}</p>
                <p className="text-sm text-muted-foreground">{VI.service.list.emptyHint}</p>
              </div>
            )}

            {services.length > 0 && (
              <Table
                columns={columns}
                dataSource={services}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                loading={loading && services.length > 0}
                locale={{ emptyText: VI.common.status.noData }}
              />
            )}
          </div>

      <Modal
        open={editModalOpen}
        title={VI.service.edit?.pageTitle ?? 'Chỉnh sửa dịch vụ'}
        onCancel={() => {
          setEditModalOpen(false);
          closeEdit();
        }}
        footer={null}
        width={720}
        destroyOnClose
      >
        {editLoading && (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <Spin />
            <span className="text-sm text-muted-foreground">{VI.common.status.loading}</span>
          </div>
        )}
        {editError && !editLoading && (
          <Alert type="error" message={editError} className="mb-4" />
        )}
        {editingService && !editLoading && (
          <CreateServiceForm
            key={editingService.id}
            mode="edit"
            serviceType={serviceType as 'Photographer' | 'Event Staff'}
            providerId={profile?.id ?? 0}
            editingService={editingService}
            onSuccess={() => {
              setEditModalOpen(false);
              closeEdit();
              void refetch();
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
