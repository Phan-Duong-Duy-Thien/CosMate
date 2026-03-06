/**
 * ProviderOrdersPage
 *
 * Provider rental dashboard page for order management
 * Orchestrates: tabs, table, actions
 * No axios calls - uses hook for data/actions
 */

import { Table, Tabs, Button, Tag, Space, message, Input } from 'antd';
import type { TableProps } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderOrders, ORDER_STATUS_TABS } from '../hooks/useProviderOrders';
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
  } = useProviderOrders();

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
      UNPAID: { color: 'default', text: 'Chưa thanh toán' },
      PAID: { color: 'orange', text: 'Chờ xác nhận' },
      PREPARING: { color: 'blue', text: 'Chờ giao hàng' },
      SHIPPING_OUT: { color: 'cyan', text: 'Đang giao hàng' },
      DELIVERING_OUT: { color: 'cyan', text: 'Đang giao hàng' },
      IN_USE: { color: 'purple', text: 'Đang sử dụng' },
      SHIPPING_BACK: { color: 'volcano', text: 'Đang trả hàng' },
      RETURNED: { color: 'green', text: 'Đã trả' },
      COMPLETED: { color: 'green', text: 'Hoàn thành' },
      CANCELLED: { color: 'red', text: 'Đã hủy' },
      DISPUTE: { color: 'magenta', text: 'Tranh chấp' },
      EXTENDING: { color: 'gold', text: 'Gia hạn' },
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
      width: 150,
      render: (_: unknown, record: OrderItem) => {
        if (record.status === 'PAID') {
          return (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              loading={preparingOrderId === record.id}
              onClick={() => handlePrepare(record.id)}
            >
              {VI.provider.orders.actions.prepare}
            </Button>
          );
        }
        return null;
      },
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
    </DashboardLayout>
  );
}
