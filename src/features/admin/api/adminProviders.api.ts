import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export async function getProviders() {
  const response = await axiosInstance.get('/api/providers');
  return unwrap<any[]>(response.data);
}

export async function getProviderById(providerId: number) {
  const response = await axiosInstance.get(`/api/providers/id/${providerId}`);
  return unwrap<any>(response.data);
}

export async function getProviderByUserId(userId: number) {
  const response = await axiosInstance.get(`/api/providers/user/${userId}`);
  return unwrap<any>(response.data);
}

export async function verifyProvider(id: number, verified: boolean) {
  const response = await axiosInstance.patch(`/api/providers/${id}/verify`, null, { params: { verified } });
  return unwrap<any>(response.data);
}

export async function getProvidersByRole(roleName: string) {
  const response = await axiosInstance.get(`/api/providers/role/${roleName}`);
  return unwrap<any[]>(response.data);
}
