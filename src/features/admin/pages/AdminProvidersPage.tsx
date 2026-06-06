import { useState } from 'react';
import { Table, Descriptions, Select, Tag, Empty, Modal, Tooltip, Input, Button } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import { Button as UiButton } from '@/components/ui/button';
import { useAdminProviders } from '../hooks/useAdminProviders';
import type { AdminProviderRow } from '../services/adminProviders.service';
import { AdminDetailEyeIcon } from '../components/AdminDetailEyeIcon';

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
      render: (v: string | undefined, record) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-border bg-slate-100 flex-shrink-0 flex items-center justify-center">
            {record.avatarUrl ? (
              <img src={record.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">{(v || 'P')[0].toUpperCase()}</span>
            )}
          </div>
          <span className="font-semibold text-foreground">{v ?? '—'}</span>
        </div>
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
          className="cosmate-admin-table-actions flex items-center justify-center gap-3"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Chi tiết">
            <AdminDetailEyeIcon
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.verified ? 'Bỏ duyệt' : 'Duyệt provider'}>
            <span
              role="presentation"
              className={cn(
                'inline-flex',
                actionLoadingId === record.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
              onClick={() => actionLoadingId !== record.id && handleVerifyClick(record)}
            >
              {record.verified ? (
                <StopOutlined style={{ color: 'var(--cosmate-warning)', fontSize: 16 }} />
              ) : (
                <CheckCircleOutlined style={{ color: 'var(--cosmate-success)', fontSize: 16 }} />
              )}
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

      <Modal
        title={
          <span className="text-base font-extrabold text-indigo-950">
            Chi tiết provider #{selected?.id}
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setOpen(false)}
            className="h-10 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border-0 transition-all"
          >
            Đóng
          </Button>
        ]}
        centered
        width={600}
        destroyOnClose
      >
        {selected && (
          <div className="space-y-4 pt-3 text-indigo-950 font-semibold">
            {/* Cover and Avatar header banner */}
            <div className="relative rounded-xl overflow-hidden border-[2px] border-indigo-950/15 h-36 bg-slate-100 flex items-end">
              {selected.coverImageUrl ? (
                <img src={selected.coverImageUrl} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="relative z-10 p-4 flex items-center gap-3 w-full">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white bg-white flex-shrink-0 flex items-center justify-center">
                  {selected.avatarUrl ? (
                    <img src={selected.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-indigo-950 text-white flex items-center justify-center font-extrabold text-lg">
                      {(selected.shopName || 'P')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <h3 className="text-lg font-extrabold m-0 leading-tight drop-shadow-md text-white">{selected.shopName || '—'}</h3>
                  <span className="text-xs opacity-90 drop-shadow-md">User ID: #{selected.userId}</span>
                </div>
              </div>
            </div>

            {/* Provider specs grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border-[2px] border-indigo-950/10 bg-slate-50 p-4 text-xs">
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Xác minh</span>
                <div>
                  <Tag color={selected.verified ? 'green' : 'gold'} style={{ margin: 0 }}>
                    {selected.verified ? 'Đã duyệt' : 'Chưa duyệt'}
                  </Tag>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Đơn hoàn thành</span>
                <span className="text-sm font-extrabold text-indigo-950">{selected.completedOrders ?? 0} đơn</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Đánh giá trung bình</span>
                <span className="text-sm font-extrabold text-indigo-950">{selected.totalRating ? `${selected.totalRating}/5 sao` : '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Số lượng đánh giá</span>
                <span className="text-sm font-extrabold text-indigo-950">{selected.totalReviews ?? 0} reviews</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px]">Tiểu sử (Bio)</span>
              <p className="rounded-xl border-[2px] border-indigo-950/15 bg-white p-3 text-sm font-medium leading-relaxed text-indigo-950/90 whitespace-pre-wrap">
                {selected.bio || <span className="italic text-muted-foreground">Không có thông tin tiểu sử</span>}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
