import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Space, Table, Tag, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined, CheckCircleOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
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
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState<ProviderRow | null>(null);
  const [open, setOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await getProviders(page, pageSize, {
        search,
        verified: verifiedFilter,
      });
      setRows(content);
      setTotal(totalElements);
    } catch {
      message.error('Không thể tải danh sách provider');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, verifiedFilter]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const allVerifiedStatuses = useMemo(() => {
    const statuses = new Set<boolean>();
    rows.forEach((r) => {
      if (typeof r.verified === 'boolean') statuses.add(r.verified);
    });
    return Array.from(statuses);
  }, [rows]);

  const columns: TableProps<ProviderRow>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Shop',
      dataIndex: 'shopName',
      key: 'shopName',
      render: (v: string | undefined) => (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      align: 'center',
      render: (v: number | undefined) => (
        <span style={{ color: v ? '#4b5563' : '#9ca3af', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Xác minh',
      dataIndex: 'verified',
      key: 'verified',
      width: 120,
      align: 'center',
      render: (value: boolean | undefined) =>
        value !== undefined ? (
          <Tag color={value ? 'green' : 'gold'} style={{ margin: 0 }}>
            {value ? 'Đã duyệt' : 'Chưa duyệt'}
          </Tag>
        ) : (
          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>—</span>
        ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <Space size={8} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.verified ? 'Bỏ duyệt' : 'Duyệt provider'}>
            <Button
              type="text"
              icon={record.verified ? <StopOutlined /> : <CheckCircleOutlined />}
              loading={actionLoadingId === record.id}
              onClick={async () => {
                try {
                  setActionLoadingId(record.id);
                  await verifyProvider(record.id, !record.verified);
                  message.success('Cập nhật trạng thái provider thành công');
                  fetchProviders();
                } catch {
                  message.error('Không thể cập nhật provider');
                } finally {
                  setActionLoadingId(null);
                }
              }}
              style={{ color: record.verified ? '#faad14' : '#52c41a' }}
            />
          </Tooltip>
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
            <Input
              placeholder="Tìm provider"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ width: 320, maxWidth: '100%' }}
              allowClear
            />
            <Space>
              <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchProviders}>
                Làm mới
              </Button>
            </Space>
          </div>
        </Card>

        <Table<ProviderRow>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `Tổng ${t} provider`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelected(record);
              setOpen(true);
            },
            style: { cursor: 'pointer' },
          })}
          rowClassName={() => 'admin-user-row'}
        />
        {!loading && total === 0 && (
          <Result
            status="404"
            title="Không có provider"
            subTitle="Danh sách provider đang trống hoặc chưa tải được dữ liệu."
          />
        )}

        <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết provider" width={620}>
          {selected && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">{selected.id}</Descriptions.Item>
              <Descriptions.Item label="User ID">{selected.userId ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Shop">{selected.shopName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Xác minh">
                <Tag color={selected.verified ? 'green' : 'gold'} style={{ margin: 0 }}>
                  {selected.verified ? 'Đã duyệt' : 'Chưa duyệt'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Completed orders">{selected.completedOrders ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Rating">{selected.totalRating ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Reviews">{selected.totalReviews ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Bio">{selected.bio ?? '—'}</Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </div>
    </>
  );
}
