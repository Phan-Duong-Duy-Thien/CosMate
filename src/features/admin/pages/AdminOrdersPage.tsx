import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Space, Table, Tag, Typography, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
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
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<OrderRow[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => `${r.code ?? ''} ${r.userName ?? ''} ${r.providerName ?? ''}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const columns: TableProps<OrderRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Mã đơn', dataIndex: 'code' },
    { title: 'Khách', dataIndex: 'userName' },
    { title: 'Provider', dataIndex: 'providerName' },
    { title: 'Tổng', dataIndex: 'total' },
    { title: 'Trạng thái', dataIndex: 'status', render: (v) => <Tag>{v ?? '—'}</Tag> },
    { title: 'Hành động', render: (_, r) => <Button icon={<EyeOutlined />} onClick={() => { setSelected(r); setOpen(true); }}>Chi tiết</Button> },
  ];

  return (
    <div className="space-y-4">
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <div className="flex gap-2 flex-wrap justify-between items-center">
          <div>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>Quản lý đơn hàng</Typography.Title>
            <Typography.Text type="secondary">Theo dõi trạng thái đơn thuê trên toàn hệ thống.</Typography.Text>
          </div>
          <Space>
            <Input placeholder="Tìm đơn hàng" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 320 }} />
            <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>Làm mới</Button>
          </Space>
        </div>
      </Card>

      <Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} />
      {!loading && filtered.length === 0 && <Result status="404" title="Không có đơn hàng" subTitle="Danh sách đơn hàng đang trống hoặc chưa tải được dữ liệu." />}

      <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết đơn hàng" width={560}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
          <Descriptions.Item label="Mã đơn">{selected?.code ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Khách">{selected?.userName ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Provider">{selected?.providerName ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Tổng">{selected?.total ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
}
