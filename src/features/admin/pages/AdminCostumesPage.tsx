import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Space, Table, Tag, Tooltip, Drawer, Descriptions, Select } from 'antd';
import type { TableProps } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { getCostumes } from '../api/adminCostumes.api';
import { VI } from '@/shared/i18n/vi';
import { getCostumeStatusTagProps } from '../utils/costumeStatus';

interface CostumeRow {
  id: number;
  name?: string;
  providerName?: string;
  providerId?: number;
  status?: string;
  pricePerDay?: number;
  depositAmount?: number;
  imageUrls?: string[];
  description?: string;
  category?: string;
  createdAt?: string;
}

export default function AdminCostumesPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CostumeRow[]>([]);
  const [total, setTotal] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState<CostumeRow | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCostumes = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await getCostumes(page, pageSize, {
        search: searchText,
        status: statusFilter,
      });
      setRows(content);
      setTotal(totalElements);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, statusFilter]);

  useEffect(() => {
    fetchCostumes();
  }, [fetchCostumes]);

  const allStatuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).sort(),
    [rows]
  );

  const handleViewDetail = (costume: CostumeRow) => {
    setSelectedCostume(costume);
    setDrawerOpen(true);
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns: TableProps<CostumeRow>['columns'] = [
    {
      title: VI.admin.costumes.columns.id,
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
    },
    {
      title: VI.admin.costumes.columns.name,
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name: string | undefined) => (
        <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{name ?? '—'}</span>
      ),
    },
    {
      title: VI.admin.costumes.columns.provider,
      dataIndex: 'providerName',
      key: 'providerName',
      width: 200,
      render: (v: string | undefined) => (
        <span style={{ color: v ? "var(--foreground)" : "var(--muted-foreground)", fontStyle: v ? "normal" : "italic" }}>
          {v ?? '—'}
        </span>
      ),
    },
    {
      title: VI.admin.costumes.columns.pricePerDay,
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      width: 140,
      align: 'right',
      render: (v: number | undefined) => (
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatCurrency(v)}</span>
      ),
    },
    {
      title: VI.admin.costumes.columns.status,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status: string | undefined) => {
        if (!status) return <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>—</span>;
        const { color, label } = getCostumeStatusTagProps(status);
        return <Tag color={color} style={{ margin: 0 }}>{label}</Tag>;
      },
    },
    {
      title: VI.admin.costumes.columns.actions,
      key: 'actions',
      width: 60,
      align: 'center',
      render: (_, costume) => (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title={VI.admin.costumes.actions.viewDetail}>
            <EyeOutlined
              onClick={() => handleViewDetail(costume)}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
            />
          </Tooltip>
        </div>
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
              placeholder={VI.admin.costumes.toolbar.search}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              style={{ width: 320, maxWidth: '100%' }}
              allowClear
            />

            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={fetchCostumes} loading={loading}>
                {VI.admin.costumes.toolbar.refresh}
              </Button>
            </Space>
          </div>

          {/* TẦNG 2: Bộ lọc */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Select
              placeholder={VI.admin.costumes.toolbar.filterStatus || 'Lọc theo trạng thái'}
              value={statusFilter || undefined}
              onChange={(val) => {
                setStatusFilter(val ?? null);
                setPage(1);
              }}
              style={{ width: 180 }}
              options={allStatuses.map((s) => {
                const { label } = getCostumeStatusTagProps(s);
                return { label, value: s };
              })}
              allowClear
            />
          </div>
        </div>

        {/* Table */}
        <Table<CostumeRow>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `Tổng ${t} trang phục`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          onRow={(costume) => ({
            onClick: () => handleViewDetail(costume),
            style: { cursor: 'pointer' },
          })}
          rowClassName={() => 'admin-user-row'}
        />

        {/* Detail Drawer */}
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedCostume(null);
          }}
          title={VI.admin.costumes.detail.title}
          styles={{ body: { paddingBottom: 24 } }}
          destroyOnClose
        >
          {selectedCostume && (
            <>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>#{selectedCostume.id}</span>
                <Tag
                  color={getCostumeStatusTagProps(selectedCostume.status).color}
                  style={{ marginLeft: 8 }}
                >
                  {getCostumeStatusTagProps(selectedCostume.status).label}
                </Tag>
              </div>

              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={VI.admin.costumes.columns.name}>
                  {selectedCostume.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label={VI.admin.costumes.columns.provider}>
                  {selectedCostume.providerName ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label={VI.admin.costumes.columns.pricePerDay}>
                  {formatCurrency(selectedCostume.pricePerDay)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền cọc">
                  {formatCurrency(selectedCostume.depositAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {selectedCostume.description ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {selectedCostume.createdAt
                    ? new Date(selectedCostume.createdAt).toLocaleDateString('vi-VN')
                    : '—'}
                </Descriptions.Item>
              </Descriptions>

              {selectedCostume.imageUrls && selectedCostume.imageUrls.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>Hình ảnh</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedCostume.imageUrls.slice(0, 4).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Thumbnail ${i + 1}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Drawer>
      </div>
    </>
  );
}