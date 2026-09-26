import { CompletedWorkoutSession, WorkoutSplitPlan } from "@/types/workout";
import { WORKOUT_SPLITS } from "./splits-data";
import { completedWorkoutSessionSchema } from "@/lib/validations/workout";

const SESSIONS_STORAGE_KEY = "apexfit_completed_workout_sessions";
const ACTIVE_SPLIT_STORAGE_KEY = "apexfit_active_split_plan";

// Initial benchmark sessions to provide realistic historical data out-of-the-box
const BENCHMARK_SESSIONS: CompletedWorkoutSession[] = [
  {
    id: "session-bench-1",
    title: "Push Day A: Chest & Shoulders",
    splitName: "Push Pull Legs (PPL Hypertrophy)",
    durationSeconds: 3120, // 52 mins
    startedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 86400000 + 3120000).toISOString(),
    totalVolumeKg: 8420,
    totalSets: 17,
    totalReps: 154,
    rpe: 8,
    personalRecordsCount: 1,
    notes: "Felt strong on bench press. Paused 1 second at chest.",
    exercises: [
      {
        exerciseId: "ex-chest-1",
        exerciseName: "Barbell Flat Bench Press",
        muscleGroup: "Chest",
        secondaryMuscles: ["Triceps", "Shoulders"],
        equipment: "barbell",
        restTimeSeconds: 120,
        targetSets: 4,
        targetReps: "6-8",
        sets: [
          { setNumber: 1, weightKg: 80, reps: 8, isCompleted: true, isWarmup: false },
          { setNumber: 2, weightKg: 85, reps: 7, isCompleted: true, isWarmup: false },
          { setNumber: 3, weightKg: 85, reps: 6, isCompleted: true, isWarmup: false },
          { setNumber: 4, weightKg: 90, reps: 5, isCompleted: true, isWarmup: false },
        ],
      },
      {
        exerciseId: "ex-shld-3",
        exerciseName: "Seated Dumbbell Shoulder Press",
        muscleGroup: "Shoulders",
        secondaryMuscles: ["Triceps"],
        equipment: "dumbbell",
        restTimeSeconds: 90,
        targetSets: 3,
        targetReps: "8-12",
        sets: [
          { setNumber: 1, weightKg: 24, reps: 10, isCompleted: true, isWarmup: false },
          { setNumber: 2, weightKg: 26, reps: 8, isCompleted: true, isWarmup: false },
          { setNumber: 3, weightKg: 26, reps: 8, isCompleted: true, isWarmup: false },
        ],
      },
      {
        exerciseId: "ex-shld-2",
        exerciseName: "Standing Dumbbell Lateral Raise",
        muscleGroup: "Shoulders",
        secondaryMuscles: ["Forearms"],
        equipment: "dumbbell",
        restTimeSeconds: 60,
        targetSets: 4,
        targetReps: "12-15",
        sets: [
          { setNumber: 1, weightKg: 12, reps: 15, isCompleted: true, isWarmup: false },
          { setNumber: 2, weightKg: 12, reps: 14, isCompleted: true, isWarmup: false },
          { setNumber: 3, weightKg: 12, reps: 12, isCompleted: true, isWarmup: false },
          { setNumber: 4, weightKg: 10, reps: 15, isCompleted: true, isWarmup: false },
        ],
      },
    ],
  },
  {
    id: "session-bench-2",
    title: "Pull Day A: Lat Width & Biceps",
    splitName: "Push Pull Legs (PPL Hypertrophy)",
    durationSeconds: 3480, // 58 mins
    startedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 86400000 + 3480000).toISOString(),
    totalVolumeKg: 9680,
    totalSets: 18,
    totalReps: 162,
    rpe: 9,
    personalRecordsCount: 2,
    notes: "Pull-ups with +10kg dip belt felt solid.",
    exercises: [
      {
        exerciseId: "ex-back-2",
        exerciseName: "Pull-ups (Overhand Grip)",
        muscleGroup: "Back",
        secondaryMuscles: ["Biceps", "Forearms"],
        equipment: "bodyweight",
        restTimeSeconds: 120,
        targetSets: 4,
        targetReps: "6-8",
        sets: [
          { setNumber: 1, weightKg: 80, reps: 8, isCompleted: true, isWarmup: false },
          { setNumber: 2, weightKg: 85, reps: 7, isCompleted: true, isWarmup: false },
          { setNumber: 3, weightKg: 85, reps: 6, isCompleted: true, isWarmup: false },
          { setNumber: 4, weightKg: 80, reps: 7, isCompleted: true, isWarmup: false },
        ],
      },
      {
        exerciseId: "ex-back-3",
        exerciseName: "Barbell Bent-Over Row",
        muscleGroup: "Back",
        secondaryMuscles: ["Biceps", "Abs"],
        equipment: "barbell",
        restTimeSeconds: 90,
        targetSets: 4,
        targetReps: "8-10",
        sets: [
          { setNumber: 1, weightKg: 70, reps: 10, isCompleted: true, isWarmup: false },
          { setNumber: 2, weightKg: 75, reps: 8, isCompleted: true, isWarmup: false },
          { setNumber: 3, weightKg: 75, reps: 8, isCompleted: true, isWarmup: false },
          { setNumber: 4, weightKg: 70, reps: 10, isCompleted: true, isWarmup: false },
        ],
      },
    ],
  },
];

export function getStoredWorkoutSessions(): CompletedWorkoutSession[] {
  if (typeof window === "undefined") return BENCHMARK_SESSIONS;

  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(BENCHMARK_SESSIONS));
      return BENCHMARK_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return BENCHMARK_SESSIONS;
  } catch (err) {
    console.error("Failed to load workout sessions from storage:", err);
    return BENCHMARK_SESSIONS;
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

export function getActiveSplitPlan(): WorkoutSplitPlan {
  if (typeof window === "undefined") return WORKOUT_SPLITS[2]; // Default PPL

  try {
    const raw = localStorage.getItem(ACTIVE_SPLIT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load active split:", err);
  }

  // Default to Push Pull Legs (PPL)
  return WORKOUT_SPLITS[2];
}

export function setActiveSplitPlan(plan: WorkoutSplitPlan): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACTIVE_SPLIT_STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error("Failed to set active split:", err);
  }
}
