/**
 * ProviderOrdersPage
 *
 * Provider rental dashboard page for order management
 * Orchestrates: tabs, table, actions
 * No axios calls - uses hook for data/actions
 */

import { useState } from 'react';
import { Alert, Input, Table, Tag, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SendOutlined,
  EyeOutlined,
  FlagOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderOrders, ORDER_STATUS_TABS } from '../hooks/useProviderOrders';
import { ShipOrderModal } from '../components/ShipOrderModal';
import { OrderDetailDrawer } from '../components/OrderDetailDrawer';
import { CreateDisputeModal } from '../components/CreateDisputeModal';
import { useCreateDispute } from '../hooks/useCreateDispute';
import { VI } from '@/shared/i18n/vi';
import type { OrderItem } from '../types';
import { Button as UiButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProviderOrdersPage() {
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    tabCounts,
    refetch,
    prepareOrder,
    preparingOrderId,
    deliverOutOrder,
    deliveringOutOrderId,
    shipOrder,
    shippingOrderId,
    completeOrder,
    completingOrderId,
  } = useProviderOrders();
  const { createDispute, disputingOrderId } = useCreateDispute();

  // Ship modal state
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [shipOrderId, setShipOrderId] = useState<number | null>(null);

  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Dispute modal state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeOrderId, setDisputeOrderId] = useState<number | null>(null);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusMeta = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      UNPAID: { color: 'default', text: VI.provider.orders.tabs.unpaid },
      PAID: { color: 'orange', text: VI.provider.orders.tabs.paid },
      PREPARING: { color: 'blue', text: VI.provider.orders.tabs.preparing },
      SHIPPING_OUT: { color: 'cyan', text: VI.provider.orders.tabs.shippingOut },
      DELIVERING_OUT: { color: 'cyan', text: VI.provider.orders.tabs.deliveringOut },
      IN_USE: { color: 'purple', text: VI.provider.orders.tabs.inUse },
      SHIPPING_BACK: { color: 'volcano', text: VI.provider.orders.tabs.shippingBack },
      RETURNED: { color: 'green', text: VI.provider.orders.tabs.returned },
      COMPLETED: { color: 'green', text: VI.provider.orders.tabs.completed },
      CANCELLED: { color: 'red', text: VI.provider.orders.tabs.cancelled },
      DISPUTE: { color: 'magenta', text: VI.provider.orders.tabs.dispute },
      EXTENDING: { color: 'gold', text: VI.provider.orders.tabs.extending },
    };

    return statusConfig[status] || { color: 'default', text: status };
  };

  const getStatusTag = (status: string) => {
    const config = getStatusMeta(status);
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Handle prepare action
  const handlePrepare = async (orderId: number) => {
    const success = await prepareOrder(orderId);
    if (success) {
      message.success(VI.provider.orders.toast.prepareSuccess);
    } else {
      message.error(VI.provider.orders.toast.prepareFailed);
    }
  };

  // Handle deliver out action
  const handleDeliverOut = async (orderId: number) => {
    const success = await deliverOutOrder(orderId);
    if (success) {
      message.success(VI.provider.orders.toast.deliverOutSuccess);
    } else {
      message.error(VI.provider.orders.toast.deliverOutFailed);
    }
  };

  // Handle complete action
  const handleComplete = async (orderId: number) => {
    const success = await completeOrder(orderId);
    if (success) {
      message.success(VI.provider.orders.toast.completeSuccess);
    } else {
      message.error(VI.provider.orders.toast.completeFailed);
    }
  };

  // Handle ship action
  const handleShip = (orderId: number) => {
    setShipOrderId(orderId);
    setShipModalOpen(true);
  };

  // Handle dispute
  const handleDispute = (orderId: number, status: string) => {
    if (status !== 'SHIPPING_BACK') {
      return;
    }
    setDisputeOrderId(orderId);
    setDisputeModalOpen(true);
  };

  const handleDisputeSubmit = async (payload: { reason: string; files: File[] }) => {
    if (!disputeOrderId) return;
    const success = await createDispute(disputeOrderId, payload);
    if (success) {
      message.success(VI.profile.orders.toastDisputeSuccess);
      setDisputeModalOpen(false);
      setDisputeOrderId(null);
      refetch();
    } else {
      message.error(VI.profile.orders.toastDisputeFailed);
    }
  };

  // Handle ship submit
  const handleShipSubmit = async (data: { trackingCode: string; shippingCarrierName: string; notes: string[]; images: File[] }) => {
    if (!shipOrderId) return;

    const success = await shipOrder(shipOrderId, data.trackingCode, data.shippingCarrierName, data.notes, data.images);
    if (success) {
      message.success(VI.provider.orders.toast.shipSuccess);
      setShipModalOpen(false);
      setShipOrderId(null);
    } else {
      message.error(VI.provider.orders.toast.shipFailed);
    }
  };

  // Table columns
  const columns: TableProps<OrderItem>['columns'] = [
    {
      title: VI.provider.orders.table.orderId,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => `#${id}`,
    },
    {
      title: VI.provider.orders.table.cosplayer,
      dataIndex: 'cosplayerName',
      key: 'cosplayerName',
      render: (name: string) => name || '-',
    },
    {
      title: VI.provider.orders.table.total,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: VI.provider.orders.table.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: VI.provider.orders.table.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: VI.provider.orders.table.action,
      key: 'action',
      width: 220,
      align: 'center',
      render: (_: unknown, record: OrderItem) => (
        <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Tooltip title={VI.order.actions.viewDetail}>
            <EyeOutlined
              onClick={() => {
                setSelectedOrderId(record.id);
                setDetailDrawerOpen(true);
              }}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
            />
          </Tooltip>
          {record.status === 'PAID' && (
            <Tooltip title={VI.provider.orders.actions.prepare}>
              <CheckCircleOutlined
                onClick={() => handlePrepare(record.id)}
                style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)', opacity: preparingOrderId === record.id ? 0.5 : 1 }}
              />
            </Tooltip>
          )}
          {record.status === 'PREPARING' && (
            <Tooltip title={VI.provider.orders.actions.ship}>
              <SendOutlined
                onClick={() => handleShip(record.id)}
                style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)', opacity: shippingOrderId === record.id ? 0.5 : 1 }}
              />
            </Tooltip>
          )}
          {record.status === 'SHIPPING_OUT' && (
            <Tooltip title={VI.provider.orders.actions.deliverOut}>
              <CarOutlined
                onClick={() => handleDeliverOut(record.id)}
                style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)', opacity: deliveringOutOrderId === record.id ? 0.5 : 1 }}
              />
            </Tooltip>
          )}
          {record.status === 'SHIPPING_BACK' && (
            <>
              <Tooltip title={VI.provider.orders.actions.complete}>
                <CheckCircleOutlined
                  onClick={() => handleComplete(record.id)}
                  style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-success)', opacity: completingOrderId === record.id ? 0.5 : 1 }}
                />
              </Tooltip>
              <Tooltip title={VI.dispute.button}>
                <FlagOutlined
                  onClick={() => handleDispute(record.id, record.status)}
                  style={{ cursor: 'pointer', fontSize: 16, color: 'var(--destructive)', opacity: disputingOrderId === record.id ? 0.5 : 1 }}
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title={VI.provider.orders.title}
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName="CosMate Provider"
    >
      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="mb-4 flex flex-col gap-4">
        {/* Tier 1: Search + global actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder={VI.provider.orders.searchPlaceholder}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>

          <UiButton variant="outline" disabled={loading} onClick={() => void refetch()}>
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            Làm mới
          </UiButton>
        </div>
      </div>

      {/* Tier 2: Status filter — inline chips (no dropdown) */}
      <div className="mb-4 -mx-1 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {ORDER_STATUS_TABS.map((tab) => {
          const labelText = VI.provider.orders.tabs[tab.label as keyof typeof VI.provider.orders.tabs];
          const count = tabCounts[tab.key] ?? 0;
          const isActive = activeTab === tab.key;
          const meta = tab.key === 'ALL' ? null : getStatusMeta(tab.key);
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm shadow-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'border-border bg-card hover:bg-muted/60',
              )}
            >
              {tab.key === 'ALL' ? (
                <span className="font-medium">{labelText}</span>
              ) : (
                <Tag color={meta?.color} style={{ margin: 0 }}>
                  {meta?.text}
                </Tag>
              )}
              <span className="text-muted-foreground">({count})</span>
            </button>
          );
        })}
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: VI.common.status.noData }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedOrderId(record.id);
            setDetailDrawerOpen(true);
          },
          style: { cursor: 'pointer' },
        })}
      />
      <ShipOrderModal
        open={shipModalOpen}
        orderId={shipOrderId || 0}
        loading={!!shippingOrderId}
        onCancel={() => {
          setShipModalOpen(false);
          setShipOrderId(null);
        }}
        onSubmit={handleShipSubmit}
      />
      <OrderDetailDrawer
        open={detailDrawerOpen}
        orderId={selectedOrderId}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedOrderId(null);
        }}
      />
      <CreateDisputeModal
        open={disputeModalOpen}
        orderId={disputeOrderId || 0}
        loading={!!disputingOrderId}
        onCancel={() => {
          setDisputeModalOpen(false);
          setDisputeOrderId(null);
        }}
        onSubmit={handleDisputeSubmit}
      />
    </DashboardLayout>
  );
}
