import axiosInstance from '@/services/axiosInstance';

export interface SystemConfig {
  configKey: string;
  configValue: string;
  description: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const getSystemConfigs = async (): Promise<ApiResponse<SystemConfig[]>> => {
  const response = await axiosInstance.get<ApiResponse<SystemConfig[]>>('/api/admin/system-config');
  return response.data;
};

export const updateSystemConfig = async (
  configKey: string,
  configValue: string
): Promise<ApiResponse<SystemConfig>> => {
  const response = await axiosInstance.put<ApiResponse<SystemConfig>>(`/api/admin/system-config/${configKey}`, { configValue });
  return response.data;
};
