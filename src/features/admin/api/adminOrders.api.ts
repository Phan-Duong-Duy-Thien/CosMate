import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export async function getOrders() {
  const response = await axiosInstance.get('/api/orders');
  return unwrap<any[]>(response.data);
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
