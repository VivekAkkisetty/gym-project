import { CompletedWorkoutSession, WorkoutSplitPlan } from "@/types/workout";
import { WORKOUT_SPLITS } from "./splits-data";
import { completedWorkoutSessionSchema } from "@/lib/validations/workout";

const SESSIONS_STORAGE_KEY = "apexfit_completed_workout_sessions";
const ACTIVE_SPLIT_STORAGE_KEY = "apexfit_active_split_plan";




export function getStoredWorkoutSessions(): CompletedWorkoutSession[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load workout sessions from storage:", err);
    return [];
  }
}

export function saveCompletedWorkoutSession(session: CompletedWorkoutSession): void {
  // Validate payload before saving
  const validated = completedWorkoutSessionSchema.parse(session);

  if (typeof window === "undefined") return;

  try {
    const existing = getStoredWorkoutSessions();
    const updated = [validated, ...existing.filter((s) => s.id !== validated.id)];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save workout session:", err);
  }
}

export function deleteWorkoutSession(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredWorkoutSessions();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete workout session:", err);
  }
}

export function getActiveSplitPlan(): WorkoutSplitPlan | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ACTIVE_SPLIT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load active split:", err);
  }

  return null;
}

export function setActiveSplitPlan(plan: WorkoutSplitPlan): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACTIVE_SPLIT_STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error("Failed to set active split:", err);
  }
}

export function getStoredWorkoutSplits(): WorkoutSplitPlan[] {
  const active = getActiveSplitPlan();
  if (!active) return [...WORKOUT_SPLITS];
  const others = WORKOUT_SPLITS.filter((s) => s.id !== active.id);
  return [active, ...others];
}

export function saveWorkoutSplitPlan(plan: WorkoutSplitPlan): void {
  setActiveSplitPlan(plan);
}

