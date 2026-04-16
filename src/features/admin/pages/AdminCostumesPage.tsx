import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Space, Table, Tag, Typography, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getCostumes } from '../api/adminCostumes.api';

interface CostumeRow {
  id: number;
  name?: string;
  providerName?: string;
  status?: string;
  pricePerDay?: number;
}

export default function AdminCostumesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CostumeRow | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CostumeRow[]>([]);

  const fetchCostumes = async () => {
    try {
      setLoading(true);
      const data = await getCostumes();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      message.error('Không thể tải danh sách costume');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostumes();
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => `${r.name ?? ''} ${r.providerName ?? ''}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const columns: TableProps<CostumeRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Provider', dataIndex: 'providerName' },
    { title: 'Giá / ngày', dataIndex: 'pricePerDay' },
    { title: 'Trạng thái', dataIndex: 'status', render: (v) => <Tag>{v ?? '—'}</Tag> },
    { title: 'Hành động', render: (_, r) => <Button icon={<EyeOutlined />} onClick={() => { setSelected(r); setOpen(true); }}>Chi tiết</Button> },
  ];

  return (
    <div className="space-y-4">
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <div className="flex gap-2 flex-wrap justify-between items-center">
          <div>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>Quản lý trang phục</Typography.Title>
            <Typography.Text type="secondary">Giám sát toàn bộ trang phục đang hiển thị trên hệ thống.</Typography.Text>
          </div>
          <Space>
            <Input placeholder="Tìm trang phục" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 320 }} />
            <Button icon={<ReloadOutlined />} onClick={fetchCostumes} loading={loading}>Làm mới</Button>
          </Space>
        </div>
      </Card>

      <Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} />
      {!loading && filtered.length === 0 && <Result status="404" title="Không có costume" subTitle="Danh sách costume đang trống hoặc chưa tải được dữ liệu." />}

      <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết costume" width={560}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">{selected?.name ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Provider">{selected?.providerName ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Giá / ngày">{selected?.pricePerDay ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
}
