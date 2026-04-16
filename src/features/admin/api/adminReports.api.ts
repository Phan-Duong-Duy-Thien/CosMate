import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export type AdminDashboardSummary = {
  totalUsers: number;
  totalProviders: number;
  totalCostumes: number;
  totalOrders: number;
  openDisputes: number;
  pendingWithdrawRequests: number;
  reviewsToModerate: number;
  revenueToday: string | number;
  revenueThisMonth: string | number;
};

export type SeriesPoint = {
  label: string;
  value: number | string;
};

export async function getDashboardSummary() {
  const response = await axiosInstance.get('/api/v1/admin/dashboard/summary');
  return unwrap<AdminDashboardSummary>(response.data);
}

export async function getRevenueReport() {
  const response = await axiosInstance.get('/api/v1/admin/reports/revenue');
  return unwrap<SeriesPoint[]>(response.data);
}

export async function getOrdersReport() {
  const response = await axiosInstance.get('/api/v1/admin/reports/orders');
  return unwrap<SeriesPoint[]>(response.data);
}

export async function getUsersReport() {
  const response = await axiosInstance.get('/api/v1/admin/reports/users');
  return unwrap<SeriesPoint[]>(response.data);
}

export async function getProvidersReport() {
  const response = await axiosInstance.get('/api/v1/admin/reports/providers');
  return unwrap<SeriesPoint[]>(response.data);
}

export async function getDisputesReport() {
  const response = await axiosInstance.get('/api/v1/admin/reports/disputes');
  return unwrap<SeriesPoint[]>(response.data);
}
