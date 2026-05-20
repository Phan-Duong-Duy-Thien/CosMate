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
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${base}${trimmed}`;
}
