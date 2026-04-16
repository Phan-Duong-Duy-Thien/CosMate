/**
 * ProviderOrdersPage
 *
 * Provider rental dashboard page for order management
 * Orchestrates: tabs, table, actions
 * No axios calls - uses hook for data/actions
 */

import { useState } from 'react';
import { Table, Tabs, Button, Tag, Space, message, Input } from 'antd';
import type { TableProps } from 'antd';
import { CheckCircleOutlined, SearchOutlined, CarOutlined, SendOutlined, EyeOutlined, FlagOutlined } from '@ant-design/icons';
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

  // Get status tag color
  const getStatusTag = (status: string) => {
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

    const config = statusConfig[status] || { color: 'default', text: status };
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
  const handleDispute = (orderId: number) => {
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
  const handleShipSubmit = async (data: { trackingCode: string; notes: string[]; images: File[] }) => {
    if (!shipOrderId) return;

    const success = await shipOrder(shipOrderId, data.trackingCode, data.notes, data.images);
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
      width: 300,
      render: (_: unknown, record: OrderItem) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrderId(record.id);
              setDetailDrawerOpen(true);
            }}
          >
            {VI.order.actions.viewDetail}
          </Button>
          {record.status === 'PAID' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              loading={preparingOrderId === record.id}
              onClick={() => handlePrepare(record.id)}
            >
              {VI.provider.orders.actions.prepare}
            </Button>
          )}
          {record.status === 'PREPARING' && (
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              loading={shippingOrderId === record.id}
              onClick={() => handleShip(record.id)}
            >
              {VI.provider.orders.actions.ship}
            </Button>
          )}
          {record.status === 'SHIPPING_OUT' && (
            <Button
              type="primary"
              size="small"
              icon={<CarOutlined />}
              loading={deliveringOutOrderId === record.id}
              onClick={() => handleDeliverOut(record.id)}
            >
              {VI.provider.orders.actions.deliverOut}
            </Button>
          )}
          {(record.status === 'DELIVERY_OUT' || record.status === 'IN_USE') && (
            <Button
              danger
              size="small"
              icon={<FlagOutlined />}
              loading={disputingOrderId === record.id}
              onClick={() => handleDispute(record.id)}
            >
              {VI.dispute.button}
            </Button>
          )}
          {record.status === 'SHIPPING_BACK' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<FlagOutlined />}
                loading={completingOrderId === record.id}
                onClick={() => handleComplete(record.id)}
              >
                {VI.provider.orders.actions.complete}
              </Button>
              <Button
                danger
                size="small"
                icon={<FlagOutlined />}
                loading={disputingOrderId === record.id}
                onClick={() => handleDispute(record.id)}
              >
                {VI.dispute.button}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Tab items - generated from fixed configuration
  const tabItems = ORDER_STATUS_TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span>
        {VI.provider.orders.tabs[tab.label as keyof typeof VI.provider.orders.tabs]}
        <span style={{ marginLeft: 4, opacity: 0.6 }}>
          ({tabCounts[tab.key] ?? 0})
        </span>
      </span>
    ),
    children: (
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: VI.common.status.noData }}
      />
    ),
  }));

  return (
    <DashboardLayout
      title={VI.provider.orders.title}
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName="CosMate Provider"
    >
      {error && (
        <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
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
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as typeof activeTab)}
        items={tabItems}
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
