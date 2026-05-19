import { useState } from 'react';
import { Table, Select, Tag, Empty, Input, Button, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Card } from '@/shared/components/Card';
import { VI } from '@/shared/i18n/vi';
import { AdminDetailEyeIcon } from '@/features/admin/components/AdminDetailEyeIcon';
import { OrderDetailDrawer } from '@/features/order/components/OrderDetailDrawer';
import { useStaffOrders } from '../hooks/useStaffOrders';
import {
  getOrderStatusLabel,
  getOrderStatusTagColor,
  getOrderTypeLabel,
} from '../utils/orderDisplay';
import type { OrderListRow } from '../types/order';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN');
};

export default function StaffOrdersPage() {
  const {
    rows,
    total,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    statusOptions,
    orderTypeOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
  } = useStaffOrders();

  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);
  const [detailOrderType, setDetailOrderType] = useState<string | undefined>();
  const t = VI.staff.orders;

  const openDetail = (record: OrderListRow) => {
    setDetailOrderId(record.id);
    setDetailOrderType(record.orderType);
  };

  const closeDetail = () => {
    setDetailOrderId(null);
    setDetailOrderType(undefined);
  };

  const columns: TableProps<OrderListRow>['columns'] = [
    { title: t.columns.id, dataIndex: 'id', width: 72 },
    {
      title: t.columns.orderType,
      dataIndex: 'orderType',
      width: 140,
      render: (v: string) => getOrderTypeLabel(v),
    },
    { title: t.columns.cosplayerId, dataIndex: 'cosplayerId', width: 100 },
    { title: t.columns.providerId, dataIndex: 'providerId', width: 100 },
    {
      title: t.columns.totalAmount,
      dataIndex: 'totalAmount',
      render: (v: number) => formatVnd(v),
    },
    {
      title: t.columns.totalDepositAmount,
      dataIndex: 'totalDepositAmount',
      width: 130,
      render: (v: number) => formatVnd(v),
    },
    {
      title: t.columns.status,
      dataIndex: 'status',
      width: 150,
      render: (status: string) => (
        <Tag color={getOrderStatusTagColor(status)}>{getOrderStatusLabel(status)}</Tag>
      ),
    },
    {
      title: t.columns.createdAt,
      dataIndex: 'createdAt',
      width: 168,
      render: (v: string) => formatDateTime(v),
    },
    {
      title: t.columns.actions,
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div
          className="cosmate-admin-table-actions flex items-center justify-center"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={t.viewDetail}>
            <AdminDetailEyeIcon onClick={() => openDetail(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-4 md:p-6">
      <style>{`
        .staff-order-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
            </div>
            <Button icon={<ReloadOutlined />} onClick={() => void refetch()} loading={loading}>
              {t.refresh}
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full max-w-sm">
              <Input
                placeholder={t.searchPlaceholder}
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <Select
              placeholder={t.filterStatus}
              value={statusFilter ?? undefined}
              onChange={(v) => setStatusFilter(v ?? null)}
              className="min-w-[200px]"
              allowClear
              options={statusOptions.map((s) => ({
                label: getOrderStatusLabel(s),
                value: s,
              }))}
            />
            <Select
              placeholder={t.filterOrderType}
              value={orderTypeFilter ?? undefined}
              onChange={(v) => setOrderTypeFilter(v ?? null)}
              className="min-w-[180px]"
              allowClear
              options={orderTypeOptions.map((ot) => ({
                label: getOrderTypeLabel(ot),
                value: ot,
              }))}
            />
          </div>
        </div>

        <Table<OrderListRow>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description={t.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (n) => t.paginationTotal.replace('{count}', String(n)),
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          onRow={(record) => ({
            onClick: () => openDetail(record),
            style: { cursor: 'pointer' },
          })}
          rowClassName={() => 'staff-order-row'}
        />

        <OrderDetailDrawer
          open={detailOrderId != null}
          orderId={detailOrderId}
          orderType={detailOrderType}
          hideRentalOptions
          hideExtendActions
          onClose={closeDetail}
        />
      </div>
    </Card>
  );
}
