export type AIChatRole = "user" | "assistant" | "system";

export interface AIChatMessage {
  id: string;
  role: AIChatRole;
  content: string;
  timestamp: string;
  sources?: string[];
  disclaimer?: string;
}

export interface AIContextConfig {
  shareProfileStats: boolean;
  shareDietPlan: boolean;
  shareWorkoutPlan: boolean;
  shareTrackingLogs: boolean;
}

export interface SanitizedUserContext {
  fitnessGoal?: string;
  weightKg?: number;
  heightCm?: number;
  activeDietName?: string;
  targetCalories?: number;
  targetProteinG?: number;
  targetCarbsG?: number;
  targetFatG?: number;
  activeWorkoutSplit?: string;
  weeklyWorkoutsCount?: number;
  avgDailySteps?: number;
  avgDailyWaterMl?: number;
  weightDelta7DaysKg?: number;
}

export interface AIDietAdjustmentResult {
  currentCalories: number;
  suggestedCalories: number;
  calorieDelta: number;
  suggestedProteinG: number;
  suggestedCarbsG: number;
  suggestedFatG: number;
  rationale: string;
  confidenceScore: number;
  estimatedWeeklyRateKg: number;
  disclaimer: string;
}

export interface AIWorkoutGenerationRequest {
  goal: "muscle_gain" | "fat_loss" | "strength" | "general_fitness" | "beginner_fitness" | "body_recomposition";
  experience: "beginner" | "intermediate" | "advanced";
  equipment: "full_gym" | "dumbbells_only" | "home_minimal" | "bodyweight";
  daysAvailable: number; // 2 to 6
  durationMinutes: number; // 30, 45, 60, 90
  targetFocus?: string;
}

export interface AIFoodSubstitution {
  originalFood: {
    name: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  substituteFood: {
    name: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendedQuantity: number;
  macroMatchScore: number; // 0 to 100%
  dietaryFit: string[]; // e.g. ["Vegan", "Gluten-Free", "High-Protein"]
  culinaryTip: string;
}

export interface AIWeeklySummaryData {
  timeframe: string;
  headline: string;
  dietAdherenceScore: number; // 0 to 100
  dietAdherenceSummary: string;
  workoutAdherenceScore: number; // 0 to 100
  workoutSummary: string;
  stepsSummary: string;
  hydrationSummary: string;
  weightTrendSummary: string;
  keyWin: string;
  focusAreaForNextWeek: string;
  disclaimer: string;
}

export interface SmartRecommendation {
  id: string;
  category: "nutrition" | "workout" | "recovery" | "habit";
  severity: "info" | "tip" | "warning" | "celebration";
  title: string;
  message: string;
  actionText?: string;
  actionHref?: string;
  dismissible: boolean;
}

export type GroceryAisle =
  | "Produce"
  | "Meat & Poultry"
  | "Seafood"
  | "Dairy & Refrigerated"
  | "Grains & Pantry"
  | "Nuts & Seeds"
  | "Supplements"
  | "Other";

export interface ShoppingListItem {
  id: string;
  foodId?: string;
  name: string;
  aisle: GroceryAisle;
  totalQuantity: number;
  unit: string;
  mealReferences: string[];
  checked: boolean;
}

export interface MealPrepGuide {
  id: string;
  title: string;
  estimatedPrepTimeMinutes: number;
  servingsYield: number;
  batchSteps: {
    stepNumber: number;
    phase: "prep" | "cook" | "portion" | "storage";
    title: string;
    instruction: string;
  }[];
  storageGuidelines: {
    item: string;
    refrigeratorDays: number;
    freezerMonths: number;
    reheatTips: string;
  }[];
  foodSafetyNotes: string[];
}
