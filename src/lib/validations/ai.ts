import { z } from "zod";

// Prompt length & sanitization
export const aiChatQuerySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Question cannot be empty")
    .max(500, "Question is limited to 500 characters for safety and rate compliance")
    .transform((val) => val.replace(/<[^>]*>?/gm, "")), // Sanitize HTML/script tags
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(1000).transform((val) => val.replace(/<[^>]*>?/gm, "")),
      })
    )
    .max(10, "Conversation history limited to 10 messages")
    .optional()
    .default([]),
  contextConfig: z
    .object({
      shareProfileStats: z.boolean().default(true),
      shareDietPlan: z.boolean().default(true),
      shareWorkoutPlan: z.boolean().default(true),
      shareTrackingLogs: z.boolean().default(true),
    })
    .optional(),
  userContext: z
    .object({
      fitnessGoal: z.string().max(100).optional(),
      weightKg: z.number().min(20).max(400).optional(),
      heightCm: z.number().min(80).max(280).optional(),
      activeDietName: z.string().max(120).optional(),
      targetCalories: z.number().min(500).max(10000).optional(),
      targetProteinG: z.number().min(10).max(500).optional(),
      targetCarbsG: z.number().min(0).max(1000).optional(),
      targetFatG: z.number().min(0).max(300).optional(),
      activeWorkoutSplit: z.string().max(120).optional(),
      weeklyWorkoutsCount: z.number().min(0).max(28).optional(),
      avgDailySteps: z.number().min(0).max(100000).optional(),
      avgDailyWaterMl: z.number().min(0).max(20000).optional(),
      weightDelta7DaysKg: z.number().min(-50).max(50).optional(),
    })
    .optional(),
});

export type AIChatQuery = z.infer<typeof aiChatQuerySchema>;

// Diet adjustment parameters
export const aiDietAdjustmentSchema = z.object({
  currentCalories: z.number().min(800).max(8000),
  currentProteinG: z.number().min(20).max(400),
  currentCarbsG: z.number().min(0).max(1000),
  currentFatG: z.number().min(10).max(300),
  primaryGoal: z.enum(["fat_loss", "muscle_gain", "maintenance", "body_recomposition"]),
  weightDelta7DaysKg: z.number().min(-10).max(10),
  weightDelta30DaysKg: z.number().min(-30).max(30).optional(),
  averageDailyCaloriesLogged: z.number().min(500).max(8000).optional(),
  adherencePercentage: z.number().min(0).max(100).default(85),
});

export type AIDietAdjustmentInput = z.infer<typeof aiDietAdjustmentSchema>;

// AI Workout generation parameters
export const aiWorkoutGenerationSchema = z.object({
  goal: z.enum([
    "muscle_gain",
    "fat_loss",
    "strength",
    "general_fitness",
    "beginner_fitness",
    "body_recomposition",
  ]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  equipment: z.enum(["full_gym", "dumbbells_only", "home_minimal", "bodyweight"]),
  daysAvailable: z.number().int().min(2).max(6),
  durationMinutes: z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90)]),
  targetFocus: z.string().max(80).optional(),
});

export type AIWorkoutGenerationInput = z.infer<typeof aiWorkoutGenerationSchema>;

// Food substitution request
export const aiFoodSubstitutionSchema = z.object({
  foodName: z.string().min(2).max(100).transform((val) => val.replace(/<[^>]*>?/gm, "")),
  servingQuantity: z.number().min(1).max(5000).default(100),
  servingUnit: z.string().max(40).default("g"),
  targetPreference: z.enum(["any", "vegan", "vegetarian", "low_carb", "high_protein", "budget_friendly"]).default("any"),
});

export type AIFoodSubstitutionInput = z.infer<typeof aiFoodSubstitutionSchema>;

// Weekly summary request
export const aiWeeklySummarySchema = z.object({
  totalWorkoutsCompleted: z.number().min(0).max(21),
  scheduledWorkouts: z.number().min(1).max(21).default(4),
  avgSteps: z.number().min(0).max(100000),
  avgWaterMl: z.number().min(0).max(20000),
  avgProteinG: z.number().min(0).max(500),
  targetProteinG: z.number().min(10).max(500).default(160),
  avgCalories: z.number().min(0).max(10000),
  targetCalories: z.number().min(500).max(10000).default(2400),
  weightChange7DaysKg: z.number().min(-15).max(15),
  currentWeightKg: z.number().min(20).max(400),
});

export type AIWeeklySummaryInput = z.infer<typeof aiWeeklySummarySchema>;
