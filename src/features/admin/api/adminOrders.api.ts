import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

/** Reserved for future server-side filters when BE supports them. */
export type GetOrdersOptions = Record<string, unknown>;

export async function getOrders(
  page = 1,
  pageSize = 10,
  _options?: GetOrdersOptions
): Promise<PaginatedResponse<any>> {
  // Note: BE does not support server-side filter by status/search yet
  // AdminOrdersPage fetches full list and applies client-side filter instead
  const response = await axiosInstance.get('/api/orders', { params: { page, pageSize } });
  const data = unwrap<any>(response.data);
  return {
    content: Array.isArray(data) ? data : (data?.content ?? []),
    totalElements: data?.totalElements ?? (Array.isArray(data) ? data.length : 0),
  };
}

export async function getOrderById(id: number) {
  const response = await axiosInstance.get(`/api/orders/${id}`);
  return unwrap<any>(response.data);
}

export async function getOrdersByUserId(userId: number) {
  const response = await axiosInstance.get(`/api/orders/user/${userId}`);
  return unwrap<any[]>(response.data);
}

export async function getOrdersByProviderId(providerId: number) {
  const response = await axiosInstance.get(`/api/orders/provider/${providerId}`);
  return unwrap<any[]>(response.data);
}

export async function getOrderTransactions(id: number) {
  const response = await axiosInstance.get(`/api/orders/${id}/transactions`);
  return unwrap<any[]>(response.data);
}
