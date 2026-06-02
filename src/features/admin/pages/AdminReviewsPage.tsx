import { useMemo } from 'react';
import { Input, Select, Table, Tag, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined, CheckCircleOutlined, StopOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { VI } from '@/shared/i18n/vi';
import { useAdminReviews } from '../hooks/useAdminReviews';
import type { AdminReviewItem } from '../api/adminReviews.api';

function getToxicTag(review: AdminReviewItem) {
  if (review.isSpamOrToxic === true) {
    return <Tag color="red">{VI.admin.reviews.status.toxic}</Tag>;
  }
  return <Tag color="green">{VI.admin.reviews.status.safe}</Tag>;
}

function getSentimentTag(sentiment: string | null | undefined) {
  const normalized = sentiment?.toUpperCase() ?? '';
  if (normalized === 'POSITIVE') return <Tag color="green">Tích cực</Tag>;
  if (normalized === 'NEGATIVE') return <Tag color="volcano">Tiêu cực</Tag>;
  if (normalized === 'NEUTRAL') return <Tag color="gold">Trung lập</Tag>;
  return <span className="text-muted-foreground italic">—</span>;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminReviewsPage() {
  const {
    search,
    setSearch,
    toxicFilter,
    setToxicFilter,
    loading,
    filteredRows,
    paginatedRows,
    page,
    setPage,
    pageSize,
    setPageSize,
    toggleLoadingIds,
    toggleToxic,
    refetch,
  } = useAdminReviews();

  const toxicFilterOptions = useMemo(
    () => [
      { label: VI.admin.reviews.filters.all, value: 'all' },
      { label: VI.admin.reviews.filters.toxic, value: 'toxic' },
      { label: VI.admin.reviews.filters.safe, value: 'safe' },
    ],
    []
  );

  const columns: TableProps<AdminReviewItem>['columns'] = [
    {
      title: VI.admin.reviews.columns.id,
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
    },
    {
      title: VI.admin.reviews.columns.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 90,
      align: 'center',
      render: (orderId: number) => `#${orderId}`,
    },
    {
      title: VI.admin.reviews.columns.reviewer,
      key: 'reviewer',
      width: 150,
      render: (_: unknown, review: AdminReviewItem) => (
        <span>{review.username ?? review.userName ?? '—'}</span>
      ),
    },
    {
      title: VI.admin.reviews.columns.rating,
      dataIndex: 'rating',
      key: 'rating',
      width: 90,
      align: 'center',
      render: (rating: number) => <span className="font-semibold">{rating}/5</span>,
    },
    {
      title: VI.admin.reviews.columns.comment,
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment: string) => (
        <Tooltip title={comment || '—'}>
          <span className="text-foreground">{comment || '—'}</span>
        </Tooltip>
      ),
    },
    {
      title: VI.admin.reviews.columns.aiSummary,
      dataIndex: 'aiSummary',
      key: 'aiSummary',
      ellipsis: true,
      render: (aiSummary: string | null | undefined) => (
        <Tooltip title={aiSummary || '—'}>
          <span className={aiSummary ? 'text-foreground' : 'text-muted-foreground italic'}>
            {aiSummary || '—'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: VI.admin.reviews.columns.sentiment,
      dataIndex: 'aiSentiment',
      key: 'aiSentiment',
      width: 120,
      align: 'center',
      render: (aiSentiment: string | null | undefined) => getSentimentTag(aiSentiment),
    },
    {
      title: VI.admin.reviews.columns.status,
      key: 'status',
      width: 130,
      align: 'center',
      render: (_: unknown, review: AdminReviewItem) => getToxicTag(review),
    },
    {
      title: VI.admin.reviews.columns.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (createdAt: string) => formatDate(createdAt),
    },
    {
      title: VI.admin.reviews.columns.actions,
      key: 'actions',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_: unknown, review: AdminReviewItem) => {
        const isToxic = review.isSpamOrToxic === true;
        const loadingToggle = toggleLoadingIds.has(review.id);
        return (
          <div
            className="cosmate-admin-table-actions flex items-center justify-center gap-3"
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingToggle ? (
              <LoadingOutlined className="text-base" style={{ color: 'var(--muted-foreground)' }} />
            ) : isToxic ? (
              <Tooltip title={VI.admin.reviews.actions.restore}>
                <CheckCircleOutlined
                  className="cursor-pointer text-base transition-opacity hover:opacity-80"
                  style={{ color: 'var(--cosmate-success)' }}
                  onClick={async () => {
                    try {
                      await toggleToxic(review.id);
                      message.success(VI.admin.reviews.messages.restoreSuccess);
                    } catch (error) {
                      const msg =
                        error instanceof Error
                          ? error.message
                          : VI.admin.reviews.messages.toggleError;
                      message.error(msg);
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title={VI.admin.reviews.actions.hide}>
                <StopOutlined
                  className="cursor-pointer text-base transition-opacity hover:opacity-80"
                  style={{ color: 'var(--cosmate-warning)' }}
                  onClick={async () => {
                    try {
                      await toggleToxic(review.id);
                      message.success(VI.admin.reviews.messages.hideSuccess);
                    } catch (error) {
                      const msg =
                        error instanceof Error
                          ? error.message
                          : VI.admin.reviews.messages.toggleError;
                      message.error(msg);
                    }
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          allowClear
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder={VI.admin.reviews.filters.searchPlaceholder}
          className="w-full min-w-[280px] max-w-[420px]"
        />

        <Select
          value={toxicFilter}
          onChange={(value) => setToxicFilter(value)}
          options={toxicFilterOptions}
          className="w-full min-w-[180px] max-w-[220px]"
        />

        <UiButton
          className="h-10 gap-2"
          onClick={() => void refetch()}
        >
          <ReloadOutlined />
          {VI.admin.reviews.actions.refresh}
        </UiButton>
      </div>

      <Table<AdminReviewItem>
        rowKey="id"
        columns={columns}
        dataSource={paginatedRows}
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          current: page,
          pageSize,
          total: filteredRows.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `${total} ${VI.admin.reviews.pagination.total}`,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
      />
    </div>
  );
}
