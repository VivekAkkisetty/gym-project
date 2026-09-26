import {
  TrackingMood,
  WeightCheckIn,
  BodyMeasurements,
  DailyTrackingLog,
} from "@/lib/validations/tracking";
import { DietPlan } from "@/lib/validations/nutrition";
import { CompletedWorkoutSession } from "@/types/workout";

export interface ProgressPhotoItem {
  id: string;
  url: string;
  date: string;
  poseTag: "Front" | "Side" | "Back" | "General";
  weightKg?: number;
  isPrivate: boolean;
}

export interface WeeklySummaryMetrics {
  weekLabel: string;
  startDate: string;
  endDate: string;
  completedWorkouts: number;
  averageSteps: number;
  averageWaterMl: number;
  averageProteinG: number;
  averageCalories: number;
  startWeightKg: number;
  endWeightKg: number;
  weightChangeKg: number;
  workoutConsistencyPercent: number;
}

export interface GoalProgressTargets {
  targetWeightKg: number;
  startWeightKg: number;
  currentWeightKg: number;
  dailyProteinGoalG: number;
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  weeklyWorkoutGoal: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  iconName: "Flame" | "Trophy" | "Footprints" | "Droplets" | "Dumbbell" | "Target" | "Calendar";
  category: "consistency" | "milestone" | "nutrition" | "habits";
  unlockedAt: string | null;
  progressPercent: number;
  metricCurrent: number;
  metricTarget: number;
  unit: string;
}

export interface ExportDataPackage {
  exportedAt: string;
  user: {
    username: string;
  };
  progressMeasurements: BodyMeasurements[];
  dailyTrackingLogs: DailyTrackingLog[];
  dietPlans: DietPlan[];
  completedWorkouts: CompletedWorkoutSession[];
}

export type {
  TrackingMood,
  WeightCheckIn,
  BodyMeasurements,
  DailyTrackingLog,
};
