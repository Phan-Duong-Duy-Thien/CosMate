/** Fields BE may return for reviewer display (username vs userName). */
export type ReviewReviewerFields = {
  username?: string | null;
  userName?: string | null;
  cosplayerName?: string | null;
};

export function getReviewReviewerName(
  review: ReviewReviewerFields,
  fallback: string
): string {
  const name =
    review.username?.trim() ||
    review.userName?.trim() ||
    review.cosplayerName?.trim() ||
    '';
  return name || fallback;
}

export function getReviewReviewerInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export function resolveReviewAvatarUrl(url: string | null | undefined): string {
  if (!url?.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmate.site';
  return `${base}${trimmed}`;
}

export const TOXIC_REVIEW_HIDDEN_MESSAGE =
  'Đánh giá này đã bị ẩn do chứa ngôn từ vi phạm tiêu chuẩn cộng đồng';

export type ReviewModerationFields = {
  comment?: string | null;
  isSpamOrToxic?: boolean | null;
};

export function getPublicReviewCommentText(review: ReviewModerationFields): string {
  if (review.isSpamOrToxic === true) return TOXIC_REVIEW_HIDDEN_MESSAGE;
  return review.comment?.trim() ?? '';
}
