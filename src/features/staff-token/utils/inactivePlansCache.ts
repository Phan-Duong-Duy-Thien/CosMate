import type { AiTokenPlan } from '../types';

const INACTIVE_STORAGE_KEY = 'cosmate.staff.inactiveAiTokenPlans';
const KNOWN_IDS_STORAGE_KEY = 'cosmate.staff.knownAiTokenPlanIds';

export function loadInactivePlansCache(): AiTokenPlan[] {
  try {
    const raw = localStorage.getItem(INACTIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is AiTokenPlan =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as AiTokenPlan).id === 'number' &&
        (item as AiTokenPlan).isActive === false
    );
  } catch {
    return [];
  }
}

export function saveInactivePlansCache(plans: AiTokenPlan[]): void {
  try {
    const inactiveOnly = plans.filter((p) => p.isActive === false);
    localStorage.setItem(INACTIVE_STORAGE_KEY, JSON.stringify(inactiveOnly));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function mergeInactivePlansCache(plans: AiTokenPlan[]): void {
  const byId = new Map<number, AiTokenPlan>();
  for (const plan of loadInactivePlansCache()) {
    if (!plan.isActive) byId.set(plan.id, plan);
  }
  for (const plan of plans) {
    if (!plan.isActive) byId.set(plan.id, plan);
  }
  saveInactivePlansCache(Array.from(byId.values()));
}

export function upsertInactivePlanCache(plan: AiTokenPlan): void {
  if (plan.isActive) return;
  mergeInactivePlansCache([{ ...plan, isActive: false }]);
  trackKnownPlanId(plan.id);
}

export function removeInactivePlanFromCache(id: number): void {
  saveInactivePlansCache(loadInactivePlansCache().filter((p) => p.id !== id));
}

export function loadKnownPlanIds(): number[] {
  try {
    const raw = localStorage.getItem(KNOWN_IDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
  } catch {
    return [];
  }
}

export function trackKnownPlanIds(plans: AiTokenPlan[]): void {
  if (plans.length === 0) return;
  const ids = new Set(loadKnownPlanIds());
  for (const plan of plans) {
    ids.add(plan.id);
  }
  try {
    localStorage.setItem(KNOWN_IDS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignore storage errors.
  }
}

export function trackKnownPlanId(id: number): void {
  trackKnownPlanIds([{ id } as AiTokenPlan]);
}

export function removePlanFromCaches(id: number): void {
  removeInactivePlanFromCache(id);
  try {
    const ids = loadKnownPlanIds().filter((planId) => planId !== id);
    localStorage.setItem(KNOWN_IDS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors.
  }
}
