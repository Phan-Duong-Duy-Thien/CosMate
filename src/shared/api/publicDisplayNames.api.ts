/**
 * Public display name lookups (no auth required on BE paths).
 * GET /api/public/user-name/{userId}
 * GET /api/public/shop-name/{providerId}
 */
import axiosInstance from '@/services/axiosInstance';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export async function getPublicUserName(userId: number): Promise<string> {
  const res = await axiosInstance.get<ApiResponse<string>>(
    `/api/public/user-name/${userId}`
  );
  return res.data.result;
}

export async function getPublicShopName(providerId: number): Promise<string> {
  const res = await axiosInstance.get<ApiResponse<string>>(
    `/api/public/shop-name/${providerId}`
  );
  return res.data.result;
}
