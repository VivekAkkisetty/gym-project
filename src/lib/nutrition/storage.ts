import { DietPlan } from "@/lib/validations/nutrition";

const STORAGE_KEY = "apexfit_diet_plans";
const ACTIVE_PLAN_KEY = "apexfit_active_plan_id";

export function getSavedDietPlans(): DietPlan[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const getStoredDietPlans = getSavedDietPlans;

export function saveDietPlan(plan: DietPlan): DietPlan[] {
  if (typeof window === "undefined") return [plan];

  try {
    const currentPlans = getSavedDietPlans();
    const existingIndex = currentPlans.findIndex((p) => p.id === plan.id);

    let updated: DietPlan[];
    if (existingIndex >= 0) {
      updated = [...currentPlans];
      updated[existingIndex] = plan;
    } else {
      updated = [plan, ...currentPlans];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [plan];
  }
}

export function deleteDietPlan(planId: string): DietPlan[] {
  if (typeof window === "undefined") return [];

  try {
    const currentPlans = getSavedDietPlans();
    const updated = currentPlans.filter((p) => p.id !== planId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function setActiveDietPlanId(planId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PLAN_KEY, planId);
}

export function getActiveDietPlanId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PLAN_KEY);
}
