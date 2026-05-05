import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

interface GetProvidersOptions {
  search?: string;
  verified?: boolean | null;
}

export async function getProviders(
  page = 1,
  pageSize = 10,
  options?: GetProvidersOptions
): Promise<PaginatedResponse<any>> {
  const params: Record<string, any> = { page, pageSize };
  if (options?.search) params.search = options.search;
  if (options?.verified !== null && options?.verified !== undefined) params.verified = options.verified;

  const response = await axiosInstance.get('/api/providers', { params });
  const data = unwrap<any>(response.data);
  return {
    content: Array.isArray(data) ? data : (data?.content ?? []),
    totalElements: data?.totalElements ?? (Array.isArray(data) ? data.length : 0),
  };
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
