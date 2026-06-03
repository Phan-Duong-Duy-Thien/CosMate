import axiosInstance from '@/services/axiosInstance';
import { isAxiosError } from 'axios';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export interface AdminReviewImage {
  id?: number;
  url: string;
}

export interface AdminReviewItem {
  id: number;
  orderId: number;
  username?: string | null;
  userName?: string | null;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  images: AdminReviewImage[];
  providerReply?: string | null;
  repliedAt?: string | null;
  repliedByProviderId?: number | null;
  aiSentiment?: string | null;
  isSpamOrToxic?: boolean | null;
  aiSummary?: string | null;
}

export async function getAdminReviews(): Promise<AdminReviewItem[]> {
  const endpoints = ['/api/reviews', '/api/reviews/', '/api/v1/reviews'];
  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint);
      const data = unwrap<AdminReviewItem[] | null | undefined>(response.data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      lastError = error;
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const message = String((error.response?.data as any)?.message ?? error.message ?? '');
        const mayBePathMismatch =
          status === 404 ||
          status === 405 ||
          (status === 500 && message.includes("Request method 'GET' is not supported"));

        if (mayBePathMismatch) {
          continue;
        }
      }
      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Không thể tải danh sách đánh giá');
}

export async function toggleReviewToxic(reviewId: number): Promise<AdminReviewItem> {
  const response = await axiosInstance.put(`/api/reviews/${reviewId}/toggle-toxic`);
  return unwrap<AdminReviewItem>(response.data);
}
