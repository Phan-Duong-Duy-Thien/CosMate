import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

interface GetCostumesOptions {
  search?: string;
  status?: string | null;
}

export async function getCostumes(
  page = 1,
  pageSize = 10,
  options?: GetCostumesOptions
): Promise<PaginatedResponse<any>> {
  const params: Record<string, any> = { page, pageSize };
  if (options?.search) params.search = options.search;
  if (options?.status) params.status = options.status;

  const response = await axiosInstance.get('/api/costumes', { params });
  const data = unwrap<any>(response.data);
  return {
    content: Array.isArray(data) ? data : (data?.content ?? []),
    totalElements: data?.totalElements ?? (Array.isArray(data) ? data.length : 0),
  };
}

export async function getCostumeById(id: number) {
  const response = await axiosInstance.get(`/api/costumes/${id}`);
  return unwrap<any>(response.data);
}

export async function searchCostumes(keyword: string) {
  const response = await axiosInstance.get('/api/costumes/search', { params: { keyword } });
  return unwrap<any[]>(response.data);
}

export async function updateCostumeStatus(id: number, status: string) {
  const response = await axiosInstance.put(`/api/costumes/${id}/status`, null, { params: { status } });
  return unwrap<any>(response.data);
}

export async function deleteCostume(id: number) {
  const response = await axiosInstance.delete(`/api/costumes/${id}`);
  return unwrap<any>(response.data);
}
