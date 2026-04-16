import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Space, Table, Tag, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getProviders, verifyProvider } from '../api/adminProviders.api';

interface ProviderRow {
  id: number;
  userId?: number;
  shopName?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  verified?: boolean;
  completedOrders?: number;
  totalRating?: number;
  totalReviews?: number;
}

export default function AdminProvidersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProviderRow | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ProviderRow[]>([]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await getProviders();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      message.error('Không thể tải danh sách provider');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => `${r.shopName ?? ''} ${r.id} ${r.userId ?? ''}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const columns: TableProps<ProviderRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Shop', dataIndex: 'shopName' },
    { title: 'User ID', dataIndex: 'userId', width: 100 },
    {
      title: 'Xác minh',
      dataIndex: 'verified',
      width: 120,
      render: (value) => <Tag color={value ? 'green' : 'gold'}>{value ? 'Đã duyệt' : 'Chưa duyệt'}</Tag>,
    },
    {
      title: 'Hành động',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => { setSelected(record); setOpen(true); }}>Chi tiết</Button>
          </Tooltip>
          <Tooltip title={record.verified ? 'Bỏ duyệt' : 'Duyệt provider'}>
            <Button
              icon={record.verified ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={async () => {
                try {
                  await verifyProvider(record.id, !record.verified);
                  message.success('Cập nhật trạng thái provider thành công');
                  fetchProviders();
                } catch {
                  message.error('Không thể cập nhật provider');
                }
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <div className="flex gap-2 flex-wrap justify-between">
          <Input placeholder="Tìm provider" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
          <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchProviders}>Làm mới</Button>
        </div>
      </Card>

      <Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} />
      {!loading && filtered.length === 0 && <Result status="404" title="Không có provider" subTitle="Danh sách provider đang trống hoặc chưa tải được dữ liệu." />}

      <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết provider" width={620}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
          <Descriptions.Item label="User ID">{selected?.userId ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Shop">{selected?.shopName ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Verified">{selected?.verified ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Completed orders">{selected?.completedOrders ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Rating">{selected?.totalRating ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Reviews">{selected?.totalReviews ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Bio">{selected?.bio ?? '—'}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
}
