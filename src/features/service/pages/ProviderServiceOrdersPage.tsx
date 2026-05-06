/**
 * Provider Service Orders Page
 *
 * Displays all service orders for the provider (photographer/event-staff)
 * with server-side status filtering.
 *
 * Data flow: Page → hook → service → API → axiosInstance
 */
import { useState } from 'react';
import { Table, Tabs, Tag, Tooltip, Modal, Input } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderServiceOrders, type ProviderServiceOrderTab } from '../hooks/useProviderServiceOrders';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import { VI } from '@/shared/i18n/vi';
import type { ServiceOrder } from '../api/booking.api';
import { ORDER_STATUS_UI, type OrderStatusValue } from '@/constants/orderStatus';

// ─── Sidebar / Layout Helpers ─────────────────────────────────────────────────

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

// ─── Status Tabs ───────────────────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: ProviderServiceOrderTab; label: string }> = [
  { key: 'all', label: VI.profile.orders.tabAll },
  { key: 'UNCONFIRM', label: VI.profile.serviceOrders.statusUnconfirm },
  { key: 'UNPAID', label: VI.profile.serviceOrders.statusUnpaid },
  { key: 'PAID', label: VI.profile.serviceOrders.statusPaid },
  { key: 'WAITING_SERVICE_DATE', label: VI.profile.serviceOrders.statusWaitingServiceDate },
  { key: 'IN_SERVICE', label: VI.profile.serviceOrders.statusInService },
  { key: 'COMPLETED', label: VI.profile.serviceOrders.statusCompleted },
  { key: 'DISPUTE', label: VI.profile.serviceOrders.statusDispute },
  { key: 'CANCELLED', label: VI.profile.serviceOrders.statusCancelled },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProviderServiceOrdersPage() {
  const {
    orders,
    loading,
    error,
    selectedStatus,
    setStatus,
    setWaitingStatus,
    startService,
    completeService,
    loadingAction,
    tabCounts,
  } = useProviderServiceOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState<{ open: boolean; order: ServiceOrder | null }>({
    open: false,
    order: null,
  });

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; orderId: number | null; type: 'setWaiting' | 'startService' | 'completeService' }>({
    open: false,
    orderId: null,
    type: 'setWaiting',
  });

  const sidebarItems: DashboardSidebarItem[] = deriveSidebarItems();
  const brandName = deriveBrandName();

  const filteredBySearch = orders.filter((order) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      String(order.id).includes(q) ||
      (order.cosplayerName ?? '').toLowerCase().includes(q) ||
      String(order.cosplayerId).includes(q)
    );
  });

  const handleSetWaitingClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'setWaiting' });
  };

  const handleStartServiceClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'startService' });
  };

  const handleCompleteServiceClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'completeService' });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.orderId !== null) {
      if (confirmModal.type === 'startService') {
        await startService(confirmModal.orderId);
      } else if (confirmModal.type === 'completeService') {
        await completeService(confirmModal.orderId);
      } else {
        await setWaitingStatus(confirmModal.orderId);
      }
      setConfirmModal({ open: false, orderId: null, type: 'setWaiting' });
    }
  };

  const handleCancelConfirm = () => {
    setConfirmModal({ open: false, orderId: null, type: 'setWaiting' });
  };

  const columns: TableProps<ServiceOrder>['columns'] = [
    {
      title: VI.provider.orders.table.orderId,
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id: number) => `#${id}`,
    },
    {
      title: VI.provider.orders.table.cosplayer,
      key: 'cosplayer',
      render: (_, record) => record.cosplayerName ?? `ID: ${record.cosplayerId}`,
    },
    {
      title: VI.profile.serviceOrders.cardBookings,
      key: 'bookings',
      render: (_, record) => record.bookings.length,
      width: 110,
    },
    {
      title: VI.provider.orders.table.total,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
      width: 160,
    },
    {
      title: VI.provider.orders.table.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      width: 160,
    },
    {
      title: VI.provider.orders.table.status,
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: string) => {
        const uiConfig = ORDER_STATUS_UI[status as OrderStatusValue];
        return <Tag className={uiConfig?.badgeClass}>{uiConfig?.label ?? status}</Tag>;
      },
    },
    {
      title: VI.provider.orders.table.action,
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => {
        const uiConfig = ORDER_STATUS_UI[record.status as OrderStatusValue];
        const canSetWaiting = uiConfig?.actions.includes('SET_WAITING');
        const canStartService = uiConfig?.actions.includes('START_SERVICE');
        const canCompleteService = uiConfig?.actions.includes('COMPLETE_SERVICE');
        return (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <Tooltip title={VI.order.actions.viewDetail}>
              <EyeOutlined
                onClick={() => setDetailModal({ open: true, order: record })}
                style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
              />
            </Tooltip>
            {canSetWaiting && (
              <Tooltip title={VI.profile.serviceOrders.setWaiting}>
                <ClockCircleOutlined
                  onClick={() => handleSetWaitingClick(record.id)}
                  style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)', opacity: loadingAction === record.id ? 0.5 : 1 }}
                />
              </Tooltip>
            )}
            {canStartService && (
              <Tooltip title={VI.profile.serviceOrders.startService}>
                <PlayCircleOutlined
                  onClick={() => handleStartServiceClick(record.id)}
                  style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)', opacity: loadingAction === record.id ? 0.5 : 1 }}
                />
              </Tooltip>
            )}
            {canCompleteService && (
              <Tooltip title={VI.profile.serviceOrders.completeService}>
                <CheckCircleOutlined
                  onClick={() => handleCompleteServiceClick(record.id)}
                  style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-success)', opacity: loadingAction === record.id ? 0.5 : 1 }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const tabItems = STATUS_TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span>
        {tab.label}
        <span style={{ marginLeft: 4, opacity: 0.6 }}>
          ({tabCounts[tab.key] ?? 0})
        </span>
      </span>
    ),
    children: (
      <Table<ServiceOrder>
        dataSource={filteredBySearch}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: VI.common.status.noData }}
      />
    ),
  }));

  return (
    <>
      <Modal
        title={
          confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalTitle
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalTitle
              : VI.profile.serviceOrders.setWaitingModalTitle
        }
        open={confirmModal.open}
        onOk={handleConfirmAction}
        onCancel={handleCancelConfirm}
        okText={
          confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalOk
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalOk
              : VI.profile.serviceOrders.setWaitingModalOk
        }
        cancelText={VI.common.actions.cancel}
        confirmLoading={confirmModal.orderId !== null && loadingAction === confirmModal.orderId}
      >
        <p>
          {confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalMessage
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalMessage
              : VI.profile.serviceOrders.setWaitingModalMessage}
        </p>
      </Modal>

      <DashboardLayout
        title={VI.provider.serviceOrders.title}
        sidebarItems={sidebarItems}
        showChatButton={false}
        brandName={brandName}
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder={VI.provider.orders.searchPlaceholder}
            allowClear
            enterButton={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={setSearchTerm}
            style={{ maxWidth: 400 }}
          />
        </div>
        <Tabs
          activeKey={selectedStatus}
          onChange={(key) => setStatus(key as ProviderServiceOrderTab)}
          items={tabItems}
        />
      </DashboardLayout>

      <Modal
        open={detailModal.open}
        title={VI.profile.serviceOrders.orderTitle}
        onCancel={() => setDetailModal({ open: false, order: null })}
        footer={null}
        width={680}
      >
        {detailModal.order && (
          <div className="space-y-3">
            <p><strong>{VI.provider.orders.table.orderId}:</strong> #{detailModal.order.id}</p>
            <p><strong>{VI.provider.orders.table.cosplayer}:</strong> {detailModal.order.cosplayerName ?? `ID: ${detailModal.order.cosplayerId}`}</p>
            <p><strong>{VI.provider.orders.table.total}:</strong> {formatCurrency(detailModal.order.totalAmount)}</p>
            <p><strong>{VI.provider.orders.table.createdAt}:</strong> {formatDate(detailModal.order.createdAt)}</p>
            <div>
              <strong>{VI.profile.serviceOrders.cardBookings}:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {detailModal.order.bookings.map((b) => (
                  <li key={b.id}>
                    {formatDate(b.bookingDate)} - {b.timeSlot} - {b.numberOfHuman} {VI.profile.serviceOrders.cardPeopleCount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
