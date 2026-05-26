import * as api from '../api/adminSystemConfigs.api';
import type { SystemConfig } from '../api/adminSystemConfigs.api';

export async function listSystemConfigs(): Promise<SystemConfig[]> {
  const response = await api.getSystemConfigs();
  
  if (response.code !== 0 && response.code !== 1000) {
    throw new Error(response.message || 'Không thể tải cấu hình hệ thống');
  }
  
  return response.result;
}

export async function updateSystemConfig(configKey: string, configValue: string): Promise<SystemConfig> {
  const response = await api.updateSystemConfig(configKey, configValue);
  
  if (response.code !== 0 && response.code !== 1000) {
    throw new Error(response.message || 'Không thể cập nhật cấu hình hệ thống');
  }
  
  return response.result;
}
