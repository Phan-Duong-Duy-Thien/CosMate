/**
 * Presentational: provider review detail with gallery and reply form (Ant Modal + Image preview).
 */
import { Modal, Spin, Avatar, Image, Divider, Input, Button as AntButton } from 'antd';
import { Star } from 'lucide-react';

import type { ProviderReviewDetailNormalized } from '../services/provider.service';

type ProviderReviewDetailModalProps = {
  open: boolean;
  loading: boolean;
  error: string | null;
  detail: ProviderReviewDetailNormalized | null;
  onClose: () => void;
  replyContent: string;
  onReplyContentChange: (value: string) => void;
  onSubmitReply: () => void;
  submitting: boolean;
  replyError: string | null;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  labels: {
    title: string;
    reviewId: string;
    orderId: string;
    rating: string;
    reviewer: string;
    reviewerUsername: string;
    createdAt: string;
    comment: string;
    images: string;
    noImages: string;
    noComment: string;
    replySection: string;
    replyPlaceholder: string;
    replySubmit: string;
    replyEdit: string;
    replySave: string;
    replyCancel: string;
    replyAt: string;
  };
};

function formatDateVi(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProviderReviewDetailModal({
  open,
  loading,
  error,
  detail,
  onClose,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  submitting,
  replyError,
  isEditing,
  onStartEdit,
  onCancelEdit,
  labels,
}: ProviderReviewDetailModalProps) {
  const titleName =
    detail?.cosplayerName?.trim() || detail?.username?.trim() || null;
  const subtitleHandle =
    detail?.cosplayerName?.trim() && detail?.username?.trim()
      ? `@${detail.username.trim()}`
      : null;

  const hasReply = Boolean(detail?.providerReply?.trim());
  const showReplyForm = !hasReply || isEditing;

  return (
    <Modal
      title={labels.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      {loading && (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      )}

      {!loading && error && <p className="text-destructive">{error}</p>}

      {!loading && detail && !error && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <Avatar size={48} src={detail.avatarUrl ?? undefined}>
              {(titleName || '?').charAt(0).toUpperCase()}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">{labels.reviewer}</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {titleName ?? labels.reviewerUsername}
              </p>
              {subtitleHandle ? (
                <p className="mt-1 text-muted-foreground text-sm">{subtitleHandle}</p>
              ) : null}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{labels.reviewId}</dt>
              <dd className="font-medium text-foreground">#{detail.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{labels.orderId}</dt>
              <dd className="font-medium text-foreground">#{detail.orderId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{labels.createdAt}</dt>
              <dd className="font-medium text-foreground">{formatDateVi(detail.createdAt)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{labels.rating}</dt>
              <dd className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= detail.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground opacity-35'
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium text-foreground">
                  {detail.rating}/5
                </span>
              </dd>
            </div>
          </dl>

          <div>
            <div className="mb-2 text-muted-foreground text-sm">{labels.comment}</div>
            <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {detail.comment?.trim() ? detail.comment : (
                <span className="text-muted-foreground">{labels.noComment}</span>
              )}
            </div>
          </div>

          <Divider className="border-border!" />

          <div>
            <div className="mb-3 text-muted-foreground text-sm">{labels.images}</div>
            {detail.imageUrls.length === 0 ? (
              <span className="text-muted-foreground text-sm">{labels.noImages}</span>
            ) : (
              <Image.PreviewGroup>
                <div className="flex flex-wrap gap-3">
                  {detail.imageUrls.map((url, idx) => (
                    <Image
                      key={`${url}-${idx}`}
                      src={url}
                      alt=""
                      width={112}
                      height={112}
                      className="rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            )}
          </div>

          <Divider className="border-border!" />

          <div>
            <div className="mb-3 text-sm font-medium text-foreground">{labels.replySection}</div>

            {hasReply && !isEditing && (
              <div className="space-y-2">
                <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground">
                  {detail.providerReply}
                </div>
                {detail.repliedAt ? (
                  <p className="text-muted-foreground text-xs">
                    {labels.replyAt}: {formatDateVi(detail.repliedAt)}
                  </p>
                ) : null}
                <AntButton type="default" onClick={onStartEdit}>
                  {labels.replyEdit}
                </AntButton>
              </div>
            )}

            {showReplyForm && (
              <div className="space-y-3">
                <Input.TextArea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  placeholder={labels.replyPlaceholder}
                  rows={4}
                  maxLength={1000}
                  showCount
                  disabled={submitting}
                />
                {replyError ? <p className="text-destructive text-sm">{replyError}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <AntButton type="primary" loading={submitting} onClick={onSubmitReply}>
                    {hasReply ? labels.replySave : labels.replySubmit}
                  </AntButton>
                  {isEditing && (
                    <AntButton disabled={submitting} onClick={onCancelEdit}>
                      {labels.replyCancel}
                    </AntButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
