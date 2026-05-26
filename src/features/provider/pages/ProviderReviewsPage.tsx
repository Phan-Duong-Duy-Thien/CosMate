/**
 * ProviderReviewsPage
 *
 * Provider dashboard page for viewing and replying to reviews.
 * Uses: Page -> Hook -> Service -> API -> axiosInstance
 */

import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import { Eye, Star } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { ProviderReviewDetailModal } from '../components/ProviderReviewDetailModal';
import {
  providerSidebarItems,
  photographSidebarItems,
  eventStaffSidebarItems,
} from '@/features/provider/constants/sidebar';
import { useProviderReviews } from '../hooks/useProviderReviews';
import { useProviderReviewDetail } from '../hooks/useProviderReviewDetail';
import { useReplyToReview, REPLY_MAX_LENGTH } from '../hooks/useReplyToReview';
import { VI } from '@/shared/i18n/vi';
import type { ProviderReview } from '../api/provider.api';

export default function ProviderReviewsPage() {
  const location = useLocation();
  const isPhotograph = location.pathname.startsWith('/provider-photograph');
  const isEventStaff = location.pathname.startsWith('/provider-event-staff');

  const rawSidebarItems = isPhotograph
    ? photographSidebarItems
    : isEventStaff
      ? eventStaffSidebarItems
      : providerSidebarItems;

  const brandName = isPhotograph
    ? 'CosMate Photographer'
    : isEventStaff
      ? 'CosMate Event Staff'
      : 'CosMate Provider';

  const { reviews, loading, error, refetch } = useProviderReviews();
  const {
    open,
    detail,
    loading: detailLoading,
    error: detailError,
    openDetail,
    closeDetail,
    updateDetailReply,
  } = useProviderReviewDetail();
  const { submitReply, submitting, error: replyHookError, clearError } = useReplyToReview();

  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [replyValidationError, setReplyValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (detail) {
      setReplyContent(detail.providerReply ?? '');
      setIsEditing(false);
      setReplyValidationError(null);
      clearError();
    }
  }, [detail, clearError]);

  const sidebarItems: DashboardSidebarItem[] = rawSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        <span className="sr-only">{rating} / 5</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden
            className={`h-4 w-4 ${
              star <= rating ? 'fill-cosmate-star text-cosmate-star' : 'text-muted-foreground/35'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderImages = (images: ProviderReview['images']) => {
    if (!images || images.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }
    return (
      <span className="text-sm text-cosmate-info">
        {images.length} {images.length === 1 ? 'ảnh' : 'ảnh'}
      </span>
    );
  };

  const renderReplyStatus = (record: ProviderReview) => {
    const replied = Boolean(record.providerReply?.trim());
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          replied
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {replied ? VI.provider.reviews.replyStatusReplied : VI.provider.reviews.replyStatusPending}
      </span>
    );
  };

  const handleCloseDetail = useCallback(() => {
    closeDetail();
    setReplyContent('');
    setIsEditing(false);
    setReplyValidationError(null);
    clearError();
  }, [closeDetail, clearError]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setReplyContent(detail?.providerReply ?? '');
    setReplyValidationError(null);
    clearError();
  }, [detail?.providerReply, clearError]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setReplyContent(detail?.providerReply ?? '');
    setReplyValidationError(null);
    clearError();
  }, [detail?.providerReply, clearError]);

  const handleSubmitReply = useCallback(async () => {
    if (!detail) return;

    const trimmed = replyContent.trim();
    if (!trimmed) {
      setReplyValidationError(VI.provider.reviews.replyValidationRequired);
      return;
    }
    if (trimmed.length > REPLY_MAX_LENGTH) {
      setReplyValidationError(
        VI.provider.reviews.replyValidationMax.replace('{max}', String(REPLY_MAX_LENGTH))
      );
      return;
    }

    setReplyValidationError(null);
    try {
      const result = await submitReply(detail.id, trimmed);
      const providerReply = result.providerReply?.trim() || trimmed;
      const repliedAt = result.repliedAt ?? new Date().toISOString();
      updateDetailReply(providerReply, repliedAt);
      setReplyContent(providerReply);
      setIsEditing(false);
      message.success(VI.provider.reviews.replySuccess);
      await refetch();
    } catch {
      // error surfaced via replyHookError
    }
  }, [detail, replyContent, submitReply, updateDetailReply, refetch]);

  const replyError = replyValidationError ?? replyHookError;

  const columns: TableProps<ProviderReview>['columns'] = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: VI.provider.reviews.columns.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      render: (orderId: number) => `#${orderId}`,
    },
    {
      title: VI.provider.reviews.columns.rating,
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number) => renderRating(rating),
    },
    {
      title: VI.provider.reviews.columns.comment,
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <span className="text-sm text-muted-foreground">
          {comment || <span className="text-muted-foreground/70">-</span>}
        </span>
      ),
    },
    {
      title: VI.provider.reviews.columns.images,
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images: ProviderReview['images']) => renderImages(images),
    },
    {
      title: VI.provider.reviews.columns.replyStatus,
      key: 'replyStatus',
      width: 130,
      render: (_: unknown, record: ProviderReview) => renderReplyStatus(record),
    },
    {
      title: VI.provider.reviews.columns.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: VI.provider.reviews.columns.action,
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: unknown, record: ProviderReview) => (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <Tooltip title={VI.provider.reviews.viewDetail}>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 shrink-0 p-0 text-cosmate-info hover:bg-accent [&_svg]:text-cosmate-info"
              aria-label={VI.provider.reviews.viewDetail}
              onClick={() => void openDetail(record)}
            >
              <Eye className="h-4 w-4 shrink-0 text-cosmate-info" strokeWidth={2} aria-hidden />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title={VI.provider.reviews.title}
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName={brandName}
    >
      {error && (
        <div className="mb-4 text-destructive">
          {error}
        </div>
      )}
      <Table
        dataSource={reviews}
        columns={columns}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1100 }}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: VI.provider.reviews.empty }}
      />

      <ProviderReviewDetailModal
        open={open}
        loading={detailLoading}
        error={detailError}
        detail={detail}
        onClose={handleCloseDetail}
        replyContent={replyContent}
        onReplyContentChange={setReplyContent}
        onSubmitReply={() => void handleSubmitReply()}
        submitting={submitting}
        replyError={replyError}
        isEditing={isEditing}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        labels={{
          title: VI.provider.reviews.detailTitle,
          reviewId: VI.provider.reviews.columns.reviewId,
          orderId: VI.provider.reviews.columns.orderId,
          rating: VI.provider.reviews.columns.rating,
          reviewer: VI.provider.reviews.detailReviewer,
          reviewerUsername: VI.provider.reviews.detailReviewerFallback,
          createdAt: VI.provider.reviews.columns.createdAt,
          comment: VI.provider.reviews.detailComment,
          images: VI.provider.reviews.detailImages,
          noImages: VI.provider.reviews.detailNoImages,
          noComment: VI.provider.reviews.detailNoComment,
          replySection: VI.provider.reviews.replySection,
          replyPlaceholder: VI.provider.reviews.replyPlaceholder,
          replySubmit: VI.provider.reviews.replySubmit,
          replyEdit: VI.provider.reviews.replyEdit,
          replySave: VI.provider.reviews.replySave,
          replyCancel: VI.provider.reviews.replyCancel,
          replyAt: VI.provider.reviews.replyAt,
        }}
      />
    </DashboardLayout>
  );
}
