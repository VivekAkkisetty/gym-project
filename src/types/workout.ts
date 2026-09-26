import {
  WorkoutGoal,
  SplitType,
  MuscleGroup,
  EquipmentType,
  ExerciseDifficulty,
  SessionExercise,
  CompletedWorkoutSession,
} from "@/lib/validations/workout";

export interface SessionSet {
  setNumber: number;
  previousWeightKg?: number;
  previousReps?: number;
  weightKg: number;
  reps: number;
  isCompleted: boolean;
  isWarmup: boolean;
  rpe?: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "calisthenics" | "full_body";
  muscleGroup: MuscleGroup;
  secondaryMuscles: string[];
  equipment: EquipmentType;
  difficulty: ExerciseDifficulty;
  instructions: string;
  defaultSets: number;
  defaultReps: string;
  restTimeSeconds: number;
  isBodyweight: boolean;
  videoUrl?: string;
}

export interface RoutineExercise {
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  sets: number;
  reps: string;
  targetWeight?: string;
  restTimeSeconds: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  dayLabel: string; // e.g. "Day 1 • Monday"
  name: string; // e.g. "Push Day: Chest, Delts & Triceps"
  splitType: SplitType;
  targetMuscles: MuscleGroup[];
  estimatedMinutes: number;
  exercises: RoutineExercise[];
  isHomeWorkout?: boolean;
}

export interface WorkoutSplitPlan {
  id: string;
  name: string;
  splitType: SplitType;
  daysPerWeek: number;
  recommendedExperience: ExerciseDifficulty;
  description: string;
  educationalOverview: {
    targetAudience: string;
    weeklySchedule: string[];
    pros: string[];
    cons: string[];
    recoveryAdvice: string;
  };
  routines: WorkoutRoutine[];
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  recordType: "max_weight" | "max_reps" | "max_volume" | "estimated_1rm";
  value: number;
  unit: string;
  achievedAt: string;
}

export interface ProgressiveOverloadEntry {
  exerciseId: string;
  exerciseName: string;
  lastWeightKg: number;
  lastReps: number;
  suggestedWeightKg: number;
  suggestedReps: string;
  rationale: string;
}

export interface WarmupCooldownProtocol {
  id: string;
  title: string;
  type: "warmup" | "cooldown";
  durationMinutes: number;
  targetArea: "Upper Body" | "Lower Body" | "Full Body" | "Core & Hips";
  exercises: {
    name: string;
    durationOrReps: string;
    cues: string;
  }[];
}

export type {
  WorkoutGoal,
  SplitType,
  MuscleGroup,
  EquipmentType,
  ExerciseDifficulty,
  SessionExercise,
  CompletedWorkoutSession,
};
