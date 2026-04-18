import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

interface GetOrdersOptions {
  search?: string;
  status?: string | null;
}

export async function getOrders(
  page = 1,
  pageSize = 10,
  options?: GetOrdersOptions
): Promise<PaginatedResponse<any>> {
  const params: Record<string, any> = { page, pageSize };
  if (options?.search) params.search = options.search;
  if (options?.status) params.status = options.status;

  const response = await axiosInstance.get('/api/orders', { params });
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
