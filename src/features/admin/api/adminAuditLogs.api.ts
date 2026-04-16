import axiosInstance from '@/services/axiosInstance';

const unwrap = <T,>(data: any): T => data?.result ?? data?.content ?? data;

export async function getAuditLogs() {
  const response = await axiosInstance.get('/api/v1/admin/audit-logs');
  return unwrap<any[]>(response.data);
}
