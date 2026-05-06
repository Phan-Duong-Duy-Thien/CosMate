import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Drawer, Input, Result, Select, Space, Table, Tooltip, Typography, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { getOrders } from '../api/adminOrders.api';
import { getUserById } from '../api/adminUsers.api';
import { COSTUME_ORDER_STATUS_UI, getCostumeOrderStatusProps } from '../utils/orderStatus';

interface OrderRow {
  id: number;
  code?: string;
  userName?: string;
  cosplayerName?: string;
  providerName?: string;
  status?: string;
  total?: number;
}

const ALL_ORDER_STATUSES = Object.keys(COSTUME_ORDER_STATUS_UI);

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allRows, setAllRows] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [open, setOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders(1, 9999);

      // Batch resolve missing cosplayerName from cosplayerId
      const rowsNeedingName = data.content.filter((r: OrderRow) => !r.cosplayerName && (r as any).cosplayerId);
      if (rowsNeedingName.length > 0) {
        const uniqueIds = [...new Set(rowsNeedingName.map((r: OrderRow) => (r as any).cosplayerId))];
        const userResults = await Promise.all(
          uniqueIds.map((id: number) => getUserById(id).catch(() => null))
        );
        const cosplayerMap = Object.fromEntries(
          userResults
            .filter((u): u is NonNullable<typeof u> => u !== null)
            .map((u) => [u.id, u.fullName ?? '—'])
        );
        data.content = data.content.map((r: OrderRow) => {
          if (!r.cosplayerName && (r as any).cosplayerId) {
            return { ...r, cosplayerName: cosplayerMap[(r as any).cosplayerId] ?? r.cosplayerName };
          }
          return r;
        });
      }

      setAllRows(data.content);
      setTotal(data.totalElements);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Client-side filter
  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          `${r.code ?? ''} ${r.userName ?? ''} ${r.cosplayerName ?? ''} ${r.providerName ?? ''} ${r.id ?? ''}`
            .toLowerCase()
            .includes(q)
      );
    }
    if (statusFilter) {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    return rows;
  }, [allRows, search, statusFilter]);

  // Client-side pagination
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

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
        <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Khách',
      dataIndex: 'userName',
      key: 'userName',
      render: (v: string | undefined) => (
        <span style={{ color: v ? 'var(--foreground)' : 'var(--muted-foreground)', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Cosplayer',
      dataIndex: 'cosplayerName',
      key: 'cosplayerName',
      render: (v: string | undefined) => (
        <span style={{ color: v ? 'var(--foreground)' : 'var(--muted-foreground)', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'providerName',
      key: 'providerName',
      render: (v: string | undefined) => (
        <span style={{ color: v ? 'var(--foreground)' : 'var(--muted-foreground)', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (v: number | undefined) => (
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>{formatCurrency(v)}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      align: 'center',
      render: (v: string | undefined) => {
        if (!v) return <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>—</span>;
        const { bg, text, label } = getCostumeOrderStatusProps(v);
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 10px',
              borderRadius: 9999,
              backgroundColor: bg,
              color: text,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, r) => (
        <Space size={8} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelected(r);
                setOpen(true);
              }}
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
          background-color: var(--muted) !important;
        }
      `}</style>

      <div className="w-full h-full">
        {/* Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          {/* TẦNG 1: Tìm kiếm + nút bấm */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <Input
              placeholder="Tìm đơn hàng"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 320, maxWidth: '100%' }}
              allowClear
            />

            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>
                Làm mới
              </Button>
            </Space>
          </div>

          {/* TẦNG 2: Bộ lọc */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val ?? null)}
              style={{ width: 220, maxWidth: '100%' }}
              options={ALL_ORDER_STATUSES.map((s) => ({
                label: COSTUME_ORDER_STATUS_UI[s]?.label ?? s,
                value: s,
              }))}
              allowClear
            />
          </div>
        </div>

        {/* Table */}
        <Table<OrderRow>
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
          <Result status="404" title="Không có đơn hàng" subTitle="Danh sách đơn hàng đang trống hoặc chưa tải được dữ liệu." />
        )}

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Chi tiết đơn hàng"
          width={560}
          destroyOnClose
        >
          {selected && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">{selected.id}</Descriptions.Item>
              <Descriptions.Item label="Mã đơn">{selected.code ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Khách">{selected.userName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Cosplayer">{selected.cosplayerName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Provider">{selected.providerName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Tổng">{formatCurrency(selected.total)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selected.status ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      backgroundColor: getCostumeOrderStatusProps(selected.status).bg,
                      color: getCostumeOrderStatusProps(selected.status).text,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {getCostumeOrderStatusProps(selected.status).label}
                  </span>
                ) : (
                  '—'
                )}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </div>
    </>
  );
}
