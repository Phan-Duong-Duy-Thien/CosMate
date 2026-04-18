import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Space, Table, Tag, Typography, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { getOrders } from '../api/adminOrders.api';

interface OrderRow {
  id: number;
  code?: string;
  userName?: string;
  providerName?: string;
  status?: string;
  total?: number;
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [open, setOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await getOrders(page, pageSize, { search });
      setRows(content);
      setTotal(totalElements);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatCurrency = (amount: number | undefined): string => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns: TableProps<OrderRow>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (v: string | undefined) => (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Khách',
      dataIndex: 'userName',
      key: 'userName',
      render: (v: string | undefined) => (
        <span style={{ color: v ? '#4b5563' : '#9ca3af', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'providerName',
      key: 'providerName',
      render: (v: string | undefined) => (
        <span style={{ color: v ? '#4b5563' : '#9ca3af', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (v: number | undefined) => (
        <span style={{ color: '#7c3aed', fontWeight: 600 }}>{formatCurrency(v)}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (v: string | undefined) =>
        v ? <Tag style={{ margin: 0 }}>{v}</Tag> : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>—</span>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, r) => (
        <Space size={8} onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelected(r);
              setOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>

      <div className="space-y-4">
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <div className="flex gap-2 flex-wrap justify-between items-center">
            <div>
              <Typography.Title level={4} style={{ marginBottom: 0 }}>Quản lý đơn hàng</Typography.Title>
              <Typography.Text type="secondary">Theo dõi trạng thái đơn thuê trên toàn hệ thống.</Typography.Text>
            </div>
            <Space>
              <Input
                placeholder="Tìm đơn hàng"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ width: 320 }}
                allowClear
              />
              <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>
                Làm mới
              </Button>
            </Space>
          </div>
        </Card>

        <Table<OrderRow>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `Tổng ${t} đơn hàng`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          onRow={(r) => ({
            onClick: () => {
              setSelected(r);
              setOpen(true);
            },
            style: { cursor: 'pointer' },
          })}
          rowClassName={() => 'admin-user-row'}
        />
        {!loading && total === 0 && (
          <Result status="404" title="Không có đơn hàng" subTitle="Danh sách đơn hàng đang trống hoặc chưa tải được dữ liệu." />
        )}

        <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết đơn hàng" width={560}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
            <Descriptions.Item label="Mã đơn">{selected?.code ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Khách">{selected?.userName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Provider">{selected?.providerName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Tổng">{formatCurrency(selected?.total)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </>
  );
}
