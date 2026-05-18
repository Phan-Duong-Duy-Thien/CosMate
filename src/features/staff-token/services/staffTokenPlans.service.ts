/**

 * Staff AI token plans service — business logic / API orchestration

 */

import * as api from '../api/staffTokenPlans.api';

import type { AiTokenPlanListParams } from '../api/staffTokenPlans.api';

import {

  loadInactivePlansCache,

  loadKnownPlanIds,

  mergeInactivePlansCache,

  saveInactivePlansCache,

  trackKnownPlanIds,

} from '../utils/inactivePlansCache';

import type { AiTokenPlan, CreateAiTokenPlanRequest, UpdateAiTokenPlanRequest } from '../types';



async function fetchPlansWithParams(params?: AiTokenPlanListParams): Promise<AiTokenPlan[]> {

  try {

    const response = await api.getStaffAiTokenPlans(params);

    if (response.code !== 0 || !Array.isArray(response.result)) {

      return [];

    }

    return response.result;

  } catch {

    return [];

  }

}



export async function listAiTokenPlans(): Promise<AiTokenPlan[]> {
  const response = await api.getStaffAiTokenPlans();

  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tải danh sách gói token');
  }

  return Array.isArray(response.result) ? response.result : [];
}



export async function getAiTokenPlanById(id: number): Promise<AiTokenPlan | null> {

  try {

    const response = await api.getStaffAiTokenPlanById(id);

    if (response.code !== 0 || !response.result) {

      return null;

    }

    return response.result;

  } catch {

    return null;

  }

}



async function fetchInactivePlansFromListApi(): Promise<AiTokenPlan[]> {

  const paramAttempts: AiTokenPlanListParams[] = [

    { includeInactive: true },

    { isActive: false },

    { all: true },

  ];



  for (const params of paramAttempts) {

    const plans = await fetchPlansWithParams(params);

    const inactive = plans.filter((p) => !p.isActive);

    if (inactive.length > 0) {

      return inactive;

    }

  }



  return [];

}



async function hydratePlansByIds(ids: number[]): Promise<AiTokenPlan[]> {

  const hydrated: AiTokenPlan[] = [];

  await Promise.all(

    ids.map(async (id) => {

      const plan = await getAiTokenPlanById(id);

      if (plan) hydrated.push(plan);

    })

  );

  return hydrated;

}



/**

 * GET /api/ai-token-plans often returns active-only for storefront.

 * Staff management merges active list + inactive query + cache + GET by id.

 */

export async function listAiTokenPlansForManagement(): Promise<AiTokenPlan[]> {

  let activePlans: AiTokenPlan[] = [];

  try {

    activePlans = await listAiTokenPlans();

  } catch {

    activePlans = await fetchPlansWithParams();

  }



  const inactiveFromListApi = await fetchInactivePlansFromListApi();

  const cachedInactive = loadInactivePlansCache();

  const knownIds = loadKnownPlanIds();



  const activeIds = new Set(activePlans.map((p) => p.id));

  const idsToHydrate = new Set<number>();



  for (const plan of cachedInactive) {

    if (!activeIds.has(plan.id)) idsToHydrate.add(plan.id);

  }

  for (const id of knownIds) {

    if (!activeIds.has(id)) idsToHydrate.add(id);

  }



  const hydrated = await hydratePlansByIds([...idsToHydrate]);



  const byId = new Map<number, AiTokenPlan>();

  for (const plan of activePlans) {

    byId.set(plan.id, plan);

  }

  for (const plan of inactiveFromListApi) {

    byId.set(plan.id, plan);

  }

  for (const plan of cachedInactive) {

    if (!byId.has(plan.id)) byId.set(plan.id, plan);

  }

  for (const plan of hydrated) {

    byId.set(plan.id, plan);

  }



  const merged = Array.from(byId.values()).sort((a, b) => b.id - a.id);

  const inactiveMerged = merged.filter((p) => !p.isActive);



  trackKnownPlanIds(merged);

  mergeInactivePlansCache(inactiveMerged);

  saveInactivePlansCache(inactiveMerged);



  return merged;

}



export async function createAiTokenPlan(payload: CreateAiTokenPlanRequest): Promise<AiTokenPlan | null> {

  const response = await api.createStaffAiTokenPlan(payload);



  if (response.code !== 0) {

    throw new Error(response.message || 'Không thể tạo gói token');

  }



  return response.result ?? null;

}



export async function updateAiTokenPlan(

  id: number,

  payload: UpdateAiTokenPlanRequest

): Promise<void> {

  const response = await api.updateStaffAiTokenPlan(id, payload);



  if (response.code !== 0) {

    throw new Error(response.message || 'Không thể cập nhật gói token');

  }

}



export async function activateAiTokenPlan(id: number): Promise<void> {

  const response = await api.activateStaffAiTokenPlan(id);



  if (response.code !== 0) {

    throw new Error(response.message || 'Không thể kích hoạt gói token');

  }

}



export async function deactivateAiTokenPlan(id: number): Promise<void> {

  const response = await api.deactivateStaffAiTokenPlan(id);



  if (response.code !== 0) {

    throw new Error(response.message || 'Không thể tạm dừng gói token');

  }

}


