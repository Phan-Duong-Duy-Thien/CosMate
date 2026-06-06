import { useMemo, useState } from 'react';
import { Input, Select, Table, Tag, Tooltip, message, Button, Empty, Modal, Image } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined, CheckCircleOutlined, StopOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card } from '@/shared/components/Card';
import { VI } from '@/shared/i18n/vi';
import { useAdminReviews } from '@/features/admin/hooks/useAdminReviews';
import type { AdminReviewItem } from '@/features/admin/api/adminReviews.api';
import { AdminDetailEyeIcon } from '@/features/admin/components/AdminDetailEyeIcon';

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

export default function StaffReviewsPage() {
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

  const [selectedReview, setSelectedReview] = useState<AdminReviewItem | null>(null);

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
      title: VI.admin.reviews.columns.aiSummary,
      dataIndex: 'aiSummary',
      key: 'aiSummary',
      ellipsis: true,
      render: (aiSummary: string | null | undefined) => (
        <Tooltip title={aiSummary || '—'}>
          <span className={aiSummary ? 'block truncate text-foreground' : 'block truncate text-muted-foreground italic'}>
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
      title: 'Mâu thuẫn (AI)',
      dataIndex: 'isConflicting',
      key: 'isConflicting',
      width: 120,
      align: 'center',
      render: (isConflicting: boolean | null | undefined) => {
        if (isConflicting === true) {
          return <Tag color="error">Mâu thuẫn</Tag>;
        }
        return <Tag color="cyan">Khớp</Tag>;
      },
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
      width: 160,
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
            <Tooltip title="Xem chi tiết">
              <AdminDetailEyeIcon onClick={() => setSelectedReview(review)} />
            </Tooltip>
            {loadingToggle ? (
              <LoadingOutlined className="text-base animate-spin" style={{ color: 'var(--muted-foreground)' }} />
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
    <Card className="p-4 md:p-6">
      <style>{`
        .staff-review-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{VI.admin.reviews.title}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Duyệt và kiểm duyệt các đánh giá của khách hàng trên hệ thống.
              </p>
            </div>
            <Button icon={<ReloadOutlined />} onClick={() => void refetch()} loading={loading}>
              {VI.admin.reviews.actions.refresh}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full max-w-sm">
              <Input
                allowClear
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                prefix={<SearchOutlined />}
                placeholder={VI.admin.reviews.filters.searchPlaceholder}
              />
            </div>
            <Select
              value={toxicFilter}
              onChange={(value) => setToxicFilter(value)}
              options={toxicFilterOptions}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {/* Table Content */}
        <Table<AdminReviewItem>
          rowKey="id"
          columns={columns}
          dataSource={paginatedRows}
          loading={loading}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: <Empty description="Không có đánh giá nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
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
          rowClassName={() => 'staff-review-row'}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <span className="text-base font-extrabold text-indigo-950">
            Chi tiết đánh giá #{selectedReview?.id}
          </span>
        }
        open={selectedReview !== null}
        onCancel={() => setSelectedReview(null)}
        footer={[
          <Button
            key="close"
            onClick={() => setSelectedReview(null)}
            className="h-10 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border-0 transition-all"
          >
            Đóng
          </Button>
        ]}
        width={600}
        centered
        destroyOnClose
      >
        {selectedReview && (
          <div className="space-y-4 pt-3 text-indigo-950 font-semibold">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border-[2px] border-indigo-950/10 bg-slate-50 p-4 text-xs">
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Người đánh giá</span>
                <span className="text-sm font-extrabold text-indigo-950">
                  {selectedReview.username ?? selectedReview.userName ?? '—'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Đơn hàng</span>
                <span className="text-sm font-extrabold text-indigo-950">#{selectedReview.orderId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Điểm số</span>
                <span className="text-sm font-extrabold text-indigo-950">{selectedReview.rating}/5 sao</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Ngày tạo</span>
                <span className="text-sm font-extrabold text-indigo-950">{formatDate(selectedReview.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Cảm xúc (AI)</span>
                <div>{getSentimentTag(selectedReview.aiSentiment)}</div>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Trạng thái</span>
                <div>{getToxicTag(selectedReview)}</div>
              </div>
              <div>
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px] mb-0.5">Mâu thuẫn (AI)</span>
                <div>
                  {selectedReview.isConflicting === true ? (
                    <Tag color="red">Mâu thuẫn</Tag>
                  ) : (
                    <Tag color="green">Khớp</Tag>
                  )}
                </div>
              </div>
            </div>

            {/* Comment content */}
            <div className="space-y-1">
              <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px]">Nội dung bình luận</span>
              <p className="rounded-xl border-[2px] border-indigo-950/15 bg-white p-3 text-sm font-medium leading-relaxed text-indigo-950/90 whitespace-pre-wrap">
                {selectedReview.comment || <span className="italic text-muted-foreground">Không có nội dung bình luận</span>}
              </p>
            </div>

            {/* AI Summary */}
            <div className="space-y-1">
              <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px]">Tóm tắt của AI</span>
              <p className="rounded-xl border-[2px] border-indigo-950/15 bg-pink-50/50 p-3 text-sm font-medium leading-relaxed text-pink-950/90">
                {selectedReview.aiSummary || <span className="italic text-muted-foreground">Chưa có tóm tắt tự động</span>}
              </p>
            </div>

            {/* Images */}
            {selectedReview.images && selectedReview.images.length > 0 && (
              <div className="space-y-2">
                <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[10px]">Hình ảnh đính kèm</span>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.images.map((img, idx) => {
                    const url = img.url ? (img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL || 'https://api.cosmate.site'}${img.url}`) : '';
                    return (
                      <div key={idx} className="h-20 w-20 overflow-hidden rounded-xl border-[2px] border-indigo-950 shadow-sm">
                        <Image src={url} alt="" className="h-full w-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}
