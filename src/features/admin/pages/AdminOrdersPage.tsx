import { useState } from 'react';
import { Descriptions, Input, Modal, Result, Select, Table, Tag, Tooltip, Button } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { AdminDetailEyeIcon } from '../components/AdminDetailEyeIcon';
import { ORDER_STATUS } from '@/constants/orderStatus';
import { COSTUME_ORDER_STATUS_UI, getCostumeOrderStatusProps } from '../utils/orderStatus';
import type { AdminOrderRow } from '../services/adminOrders.service';

/** Costume rental + photography/service order keys (reports & filters stay in sync). */
const ALL_ORDER_STATUSES = Array.from(
  new Set([...Object.keys(COSTUME_ORDER_STATUS_UI), ...Object.values(ORDER_STATUS)])
).sort((a, b) => a.localeCompare(b));

function getOrderStatusTagColor(status: string): string {
  const normalized = status.toUpperCase();
  if (['UNPAID', 'PREPARING', 'WAITING_SERVICE_DATE'].includes(normalized)) return 'gold';
  if (['PAID', 'SHIPPING_OUT'].includes(normalized)) return 'blue';
  if (['IN_USE', 'IN_SERVICE'].includes(normalized)) return 'purple';
  if (['RETURNED', 'COMPLETED'].includes(normalized)) return 'green';
  if (['DISPUTE', 'SHIPPING_BACK'].includes(normalized)) return 'red';
  if (normalized === 'CANCELLED') return 'default';
  return 'default';
}

function getOrderTypeLabel(type: string): string {
  if (type === 'RENTAL') return 'Thuê trang phục';
  if (type === 'PHOTOGRAPHY') return 'Đặt Photographer';
  if (type === 'STAFF') return 'Thuê Event Staff';
  return type;
}

export default function AdminOrdersPage() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading,
    filteredRows,
    paginatedRows,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
  } = useAdminOrders();

  const [selected, setSelected] = useState<AdminOrderRow | null>(null);
  const [open, setOpen] = useState(false);

  const formatCurrency = (amount: number | undefined): string => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns: TableProps<AdminOrderRow>['columns'] = [
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
        <span className="font-semibold text-foreground">{v ?? '—'}</span>
      ),
    },
    {
      title: 'Loại đơn',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 140,
      render: (v: string | undefined) => (
        <span className="text-foreground">{v ? getOrderTypeLabel(v) : '—'}</span>
      ),
    },
    {
      title: 'Khách',
      dataIndex: 'userName',
      key: 'userName',
      render: (v: string | undefined) => (
        <span className={v ? 'text-foreground' : 'text-muted-foreground italic'}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Cosplayer',
      dataIndex: 'cosplayerName',
      key: 'cosplayerName',
      render: (v: string | undefined) => (
        <span className={v ? 'text-foreground' : 'text-muted-foreground italic'}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'providerName',
      key: 'providerName',
      render: (v: string | undefined) => (
        <span className={v ? 'text-foreground' : 'text-muted-foreground italic'}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (v: number | undefined) => (
        <span className="font-semibold text-primary">{formatCurrency(v)}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      align: 'center',
      render: (v: string | undefined) => {
        if (!v) return <span className="text-muted-foreground italic">—</span>;
        const { label } = getCostumeOrderStatusProps(v);
        return <Tag color={getOrderStatusTagColor(v)} style={{ margin: 0 }}>{label}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string | undefined) => (
        <span className="text-muted-foreground">{v ? new Date(v).toLocaleString('vi-VN') : '—'}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, r) => (
        <div
          className="cosmate-admin-table-actions flex justify-center"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Chi tiết">
            <AdminDetailEyeIcon
              onClick={() => {
                setSelected(r);
                setOpen(true);
              }}
            />
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
                placeholder="Tìm đơn hàng"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>

            <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void refetch()}>
              <ReloadOutlined className={loading ? 'animate-spin' : ''} />
              Làm mới
            </UiButton>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val ?? null)}
              className="min-w-[220px]"
              options={ALL_ORDER_STATUSES.map((s) => ({
                label: getCostumeOrderStatusProps(s).label,
                value: s,
              }))}
              allowClear
            />
          </div>
        </div>

        <Table<AdminOrderRow>
          columns={columns}
          dataSource={paginatedRows}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total: filteredRows.length,
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

        {!loading && filteredRows.length === 0 && (
          <div className="mt-6">
            <Result
              status="404"
              title="Không có đơn hàng"
              subTitle="Danh sách đơn hàng đang trống hoặc chưa tải được dữ liệu."
            />
          </div>
        )}

        <Modal
          title={
            <span className="text-base font-extrabold text-indigo-950">
              Chi tiết đơn hàng #{selected?.id}
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
              {/* Main details grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border-[2px] border-indigo-950/10 bg-slate-50 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Mã đơn hàng</span>
                  <span className="text-sm font-extrabold text-indigo-950">{selected.code ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Loại đơn hàng</span>
                  <span className="text-sm font-extrabold text-indigo-950">{selected.orderType ? getOrderTypeLabel(selected.orderType) : '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Khách hàng</span>
                  <span className="text-sm font-extrabold text-indigo-950">{selected.userName ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Cosplayer</span>
                  <span className="text-sm font-extrabold text-indigo-950">{selected.cosplayerName ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Provider</span>
                  <span className="text-sm font-extrabold text-indigo-950">{selected.providerName ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Ngày tạo đơn</span>
                  <span className="text-sm font-extrabold text-indigo-950">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString('vi-VN') : '—'}
                  </span>
                </div>
              </div>

              {/* Price Details Card */}
              <div className="rounded-xl border-[2px] border-indigo-950/10 bg-slate-50 p-4 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Tiền thuê/dịch vụ</span>
                  <span className="text-sm font-extrabold text-indigo-950">{formatCurrency(selected.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Tiền đặt cọc</span>
                  <span className="text-sm font-extrabold text-indigo-950">{formatCurrency(selected.totalDepositAmount)}</span>
                </div>
                <div className="border-t border-indigo-950/10 pt-2 flex justify-between items-center">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Tổng thanh toán</span>
                  <span className="text-sm font-extrabold text-primary">{formatCurrency(selected.total)}</span>
                </div>
              </div>

              {/* Status and Time Rent details */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border-[2px] border-indigo-950/10 bg-slate-50 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Trạng thái</span>
                  <div>
                    {selected.status ? (
                      <Tag color={getOrderStatusTagColor(selected.status)} style={{ margin: 0 }}>
                        {getCostumeOrderStatusProps(selected.status).label}
                      </Tag>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
                {selected.orderType === 'RENTAL' && (
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Thời hạn thuê</span>
                    <span className="text-sm font-extrabold text-indigo-950 block">
                      Bắt đầu: {selected.rentStart ? new Date(selected.rentStart).toLocaleDateString('vi-VN') : '—'}
                    </span>
                    <span className="text-sm font-extrabold text-indigo-950 block">
                      Kết thúc: {selected.rentEnd ? new Date(selected.rentEnd).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
