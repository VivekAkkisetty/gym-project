export interface UserProfile {
  id: string;
  email?: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  birthDate: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
  fitnessGoal: "cut_fat" | "maintain_weight" | "lean_bulk" | "build_muscle" | "endurance" | "general_health";
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  unitSystem: "metric" | "imperial";
  calorieTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  waterTargetMl: number;
  stepTarget: number;
  notificationsEnabled: boolean;
}

export interface DailySummary {
  date: string;
  caloriesConsumed: number;
  calorieTarget: number;
  caloriesBurned: number;
  proteinConsumedG: number;
  proteinTargetG: number;
  carbsConsumedG: number;
  carbsTargetG: number;
  fatConsumedG: number;
  fatTargetG: number;
  waterIntakeMl: number;
  waterTargetMl: number;
  stepsCount: number;
  stepTarget: number;
  sleepHours: number;
  streakDays: number;
}

export interface CalorieBreakdownItem {
  name: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}

export interface WeightHistoryPoint {
  date: string;
  weight: number;
  bodyFat?: number;
}

export interface ActivityDayPoint {
  day: string;
  calories: number;
  target: number;
  steps: number;
}

export interface RecentLogItem {
  id: string;
  type: "food" | "workout" | "water" | "weight";
  title: string;
  subtitle: string;
  time: string;
  metric: string;
}
