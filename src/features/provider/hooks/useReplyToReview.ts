/**
 * Hook for submitting or updating a provider reply to a customer review.
 */
import { useState, useCallback } from 'react';
import { replyToReview, type ReviewItem } from '@/features/costume-rental/api/review.api';

export const REPLY_MAX_LENGTH = 1000;

export function useReplyToReview() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReply = useCallback(
    async (reviewId: number, replyContent: string): Promise<ReviewItem> => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await replyToReview(reviewId, { replyContent });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể gửi phản hồi';
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { submitReply, submitting, error, clearError };
}
