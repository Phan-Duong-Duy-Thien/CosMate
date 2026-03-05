/**
 * Order API
 * Handles order creation API calls
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateOrderPayload, CreateOrderResponse, OrderItem } from '../types';

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

/**
 * Get all orders for a provider
 * @param providerId - The provider ID
 * @returns List of orders for the provider
 */
export async function getOrdersByProvider(providerId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<OrderItem[]>>(
    `/api/orders/provider/${providerId}`
  );
  return response.data.result;
}

/**
 * Get all orders for a user
 * @param userId - The user ID
 * @returns List of orders for the user
 */
export async function getOrdersByUserId(userId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<OrderItem[]>>(
    `/api/orders/user/${userId}`
  );
  return response.data.result;
}

/**
 * Prepare an order (update status to PREPARING)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function prepareOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/prepare`
  );
  return response.data.result;
}