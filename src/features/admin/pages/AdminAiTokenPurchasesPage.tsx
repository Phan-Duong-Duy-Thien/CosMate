import { useState } from 'react';
import { Table, Descriptions, Select, Tag, Empty, Input, Button, Modal, Tooltip, Spin } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import { useAdminAiTokenPurchases } from '../hooks/useAdminAiTokenPurchases';
import type { AiTokenPurchase } from '../types';
import { AdminDetailEyeIcon } from '../components/AdminDetailEyeIcon';
import {
  getAiTokenPurchaseStatusLabel,
  getAiTokenPurchaseStatusTagColor,
} from '@/features/staff-token/utils/aiTokenPurchaseStatus';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN');
};

export default function AdminAiTokenPurchasesPage() {
  const {
    rows,
    total,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
    detail,
    detailLoading,
    fetchDetail,
    clearDetail,
  } = useAdminAiTokenPurchases();

  const [detailOpen, setDetailOpen] = useState(false);
  const t = VI.admin.aiTokenPurchases;

  const openDetail = (record: AiTokenPurchase) => {
    setDetailOpen(true);
    void fetchDetail(record.id, record);
  };

  const columns: TableProps<AiTokenPurchase>['columns'] = [
    { title: t.columns.id, dataIndex: 'id', width: 72 },
    { title: t.columns.userId, dataIndex: 'userId', width: 88 },
    { title: t.columns.subscriptionId, dataIndex: 'subscriptionId', width: 110 },
    { title: t.columns.transactionId, dataIndex: 'transactionId', width: 110 },
    {
      title: t.columns.priceAtPurchase,
      dataIndex: 'priceAtPurchase',
      render: (v: number) => formatVnd(v),
    },
    { title: t.columns.tokensAdded, dataIndex: 'tokensAdded', width: 100 },
    {
      title: t.columns.purchaseDate,
      dataIndex: 'purchaseDate',
      width: 168,
      render: (v: string) => formatDateTime(v),
    },
    {
      title: t.columns.status,
      dataIndex: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={getAiTokenPurchaseStatusTagColor(status)}>
          {getAiTokenPurchaseStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: t.columns.actions,
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div
          className="cosmate-admin-table-actions flex items-center justify-center"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={t.viewDetail}>
            <AdminDetailEyeIcon onClick={() => openDetail(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-token-purchase-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
            </div>
            <Button icon={<ReloadOutlined />} onClick={() => void refetch()} loading={loading}>
              {t.refresh}
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full max-w-sm">
              <Input
                placeholder={t.searchPlaceholder}
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <Select
              placeholder={t.filterStatus}
              value={statusFilter ?? undefined}
              onChange={(v) => setStatusFilter(v ?? null)}
              className="min-w-[180px]"
              allowClear
              options={statusOptions.map((s) => ({
                label: getAiTokenPurchaseStatusLabel(s),
                value: s,
              }))}
            />
          </div>
        </div>

        <Table<AiTokenPurchase>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description={t.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (n) => t.paginationTotal.replace('{count}', String(n)),
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          rowClassName={() => 'admin-token-purchase-row'}
        />

        <Modal
          title={detail ? t.detailTitle.replace('{id}', String(detail.id)) : t.detailTitleFallback}
          open={detailOpen}
          onCancel={() => {
            setDetailOpen(false);
            clearDetail();
          }}
          footer={null}
          centered
          width={480}
          destroyOnClose
        >
          {detailLoading && !detail ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : detail ? (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t.columns.id}>{detail.id}</Descriptions.Item>
              <Descriptions.Item label={t.columns.userId}>{detail.userId}</Descriptions.Item>
              <Descriptions.Item label={t.columns.subscriptionId}>
                {detail.subscriptionId}
              </Descriptions.Item>
              <Descriptions.Item label={t.columns.transactionId}>
                {detail.transactionId}
              </Descriptions.Item>
              <Descriptions.Item label={t.columns.priceAtPurchase}>
                {formatVnd(detail.priceAtPurchase)}
              </Descriptions.Item>
              <Descriptions.Item label={t.columns.tokensAdded}>{detail.tokensAdded}</Descriptions.Item>
              <Descriptions.Item label={t.columns.purchaseDate}>
                {formatDateTime(detail.purchaseDate)}
              </Descriptions.Item>
              <Descriptions.Item label={t.columns.status}>
                <Tag color={getAiTokenPurchaseStatusTagColor(detail.status)}>
                  {getAiTokenPurchaseStatusLabel(detail.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          ) : null}
        </Modal>
      </div>
    </>
  );
}
