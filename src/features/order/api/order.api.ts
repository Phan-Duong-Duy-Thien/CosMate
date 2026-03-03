/**
 * Order API
 * Handles order creation API calls
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateOrderPayload, CreateOrderResponse } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * Create a new order
 * @param cosplayerId - The cosplayer user ID
 * @param payload - Order creation data
 * @returns Created order with payment URL
 */
export async function createOrder(
  cosplayerId: number,
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<ApiResponse<CreateOrderResponse>>(
    `/api/orders?cosplayerId=${cosplayerId}`,
    payload
  );
  return response.data.result;
}
