import { z } from "zod";

export const personalProfileInputSchema = z.object({
  age: z.coerce.number().min(12, "Age must be at least 12").max(100, "Age must be under 100"),
  sex: z.enum(["male", "female"]),
  heightCm: z.coerce.number().min(100, "Height must be at least 100 cm").max(250, "Height must be under 250 cm"),
  weightKg: z.coerce.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be under 300 kg"),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  fitnessGoal: z.enum([
    "fat_loss",
    "muscle_gain",
    "maintenance",
    "body_recomposition",
  ]),
  dietaryType: z.enum([
    "vegetarian",
    "non_vegetarian",
    "vegan",
    "eggetarian",
  ]),
  numberOfMeals: z.coerce.number().min(2, "At least 2 meals required").max(6, "Maximum 6 meals per day"),
  budget: z.enum(["budget_friendly", "moderate", "premium"]).default("moderate"),
  foodPreferences: z.string().optional(),
  allergies: z.string().optional(),
  availableFoods: z.string().optional(),
});

export type PersonalProfileInput = z.infer<typeof personalProfileInputSchema>;

export const mealFoodItemSchema = z.object({
  id: z.string(),
  foodId: z.string(),
  name: z.string().min(1, "Food name required"),
  servingSize: z.number().positive("Serving size must be positive"),
  servingUnit: z.string(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  calories: z.number().min(0, "Calories cannot be negative"),
  protein: z.number().min(0, "Protein cannot be negative"),
  carbs: z.number().min(0, "Carbs cannot be negative"),
  fat: z.number().min(0, "Fat cannot be negative"),
  fiber: z.number().min(0, "Fiber cannot be negative"),
  substitutionGroup: z.string().optional(),
});

export type MealFoodItem = z.infer<typeof mealFoodItemSchema>;

export const mealSlotSchema = z.object({
  id: z.string(),
  slotName: z.string(),
  time: z.string(),
  items: z.array(mealFoodItemSchema),
});

export type MealSlot = z.infer<typeof mealSlotSchema>;

export const dietPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  description: z.string().optional(),
  dailyCalories: z.number().positive("Calories must be positive"),
  targetProteinG: z.number().positive("Protein must be positive"),
  targetCarbsG: z.number().positive("Carbs must be positive"),
  targetFatG: z.number().positive("Fat must be positive"),
  targetFiberG: z.number().min(0).default(30),
  meals: z.array(mealSlotSchema),
  isActive: z.boolean().default(false),
  createdAt: z.string().optional(),
});

export type DietPlan = z.infer<typeof dietPlanSchema>;

export const waterLogSchema = z.object({
  amountMl: z.number().int().min(50).max(2000),
  date: z.string(),
});
