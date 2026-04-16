import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export async function getCostumes() {
  const response = await axiosInstance.get('/api/costumes');
  return unwrap<any[]>(response.data);
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
