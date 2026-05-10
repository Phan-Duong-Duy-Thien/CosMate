import { useState } from 'react';
import { Table, Drawer, Descriptions, Select, Tag, Empty, Modal, Tooltip, Input } from 'antd';
import type { TableProps } from 'antd';
import {
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { useAdminProviders } from '../hooks/useAdminProviders';
import type { AdminProviderRow } from '../services/adminProviders.service';

export default function AdminProvidersPage() {
  const {
    search,
    setSearch,
    verifiedFilter,
    setVerifiedFilter,
    loading,
    rows,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    actionLoadingId,
    refetch,
    runVerify,
  } = useAdminProviders();

  const [selected, setSelected] = useState<AdminProviderRow | null>(null);
  const [open, setOpen] = useState(false);

  const handleVerifyClick = (record: AdminProviderRow) => {
    const nextVerified = !record.verified;
    Modal.confirm({
      title: nextVerified ? 'Duyệt provider?' : 'Bỏ duyệt provider?',
      content: nextVerified
        ? 'Shop này sẽ hiển thị là đã xác minh.'
        : 'Shop sẽ chuyển về trạng thái chưa duyệt.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: nextVerified ? {} : { danger: true },
      onOk: () => runVerify(record.id, nextVerified),
    });
  };

  const columns: TableProps<AdminProviderRow>['columns'] = [
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
        <span className="font-semibold text-foreground">{v ?? '—'}</span>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      align: 'center',
      render: (v: number | undefined) => (
        <span className={v ? 'text-foreground' : 'text-muted-foreground italic'}>{v ?? '—'}</span>
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
          <span className="text-muted-foreground italic">—</span>
        ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div
          className="flex items-center justify-center gap-3"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Chi tiết">
            <EyeOutlined
              className="cursor-pointer text-base text-cosmate-info"
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.verified ? 'Bỏ duyệt' : 'Duyệt provider'}>
            <span
              className={
                actionLoadingId === record.id
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer text-base'
              }
              style={{
                color: record.verified ? 'var(--cosmate-warning)' : 'var(--cosmate-success)',
              }}
              onClick={() => actionLoadingId !== record.id && handleVerifyClick(record)}
            >
              {record.verified ? <StopOutlined /> : <CheckCircleOutlined />}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Tìm provider"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void refetch()}>
                <ReloadOutlined className={loading ? 'animate-spin' : ''} />
                Làm mới
              </UiButton>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Lọc theo xác minh"
              value={verifiedFilter === null ? undefined : verifiedFilter}
              onChange={(v) => setVerifiedFilter(v === undefined ? null : v)}
              className="min-w-[200px]"
              options={[
                { label: 'Đã duyệt', value: true },
                { label: 'Chưa duyệt', value: false },
              ]}
              allowClear
            />
          </div>
        </div>

        <Table<AdminProviderRow>
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
          <div className="mt-6">
            <Empty description="Không có provider" />
          </div>
        )}
      </div>

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
    </>
  );
}
