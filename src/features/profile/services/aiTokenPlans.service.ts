import * as api from '../api/aiTokenPlans.api';
import type { AiTokenPlan } from '../types';

export async function listActiveAiTokenPlans(): Promise<AiTokenPlan[]> {
  const response = await api.getAiTokenPlans();

  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tải danh sách gói token');
  }

  const plans = Array.isArray(response.result) ? response.result : [];
  return plans.filter((p) => p.isActive);
}
