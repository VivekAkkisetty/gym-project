import { DietPlan } from "@/lib/validations/nutrition";

const STORAGE_KEY = "apexfit_diet_plans";
const ACTIVE_PLAN_KEY = "apexfit_active_plan_id";

// Built-in initial plans for instant demonstration & benchmarking
export const DEFAULT_DIET_PLANS: DietPlan[] = [
  {
    id: "plan-default-1",
    name: "Lean Muscle Hypertrophy (2,400 kcal)",
    description: "4-meal high-protein split structured around clean carbs and lean poultry/dairy.",
    dailyCalories: 2400,
    targetProteinG: 180,
    targetCarbsG: 250,
    targetFatG: 65,
    targetFiberG: 34,
    isActive: true,
    createdAt: new Date().toISOString(),
    meals: [
      {
        id: "meal-1",
        slotName: "Breakfast: High-Protein Oats & Fruit",
        time: "08:00 AM",
        items: [
          { id: "i1", foodId: "food-3", name: "Rolled Oats (Raw)", servingSize: 50, servingUnit: "g", quantity: 60, calories: 228, protein: 7.8, carbs: 40.8, fat: 4.2, fiber: 6.0, substitutionGroup: "complex_carb" },
          { id: "i2", foodId: "food-22", name: "Whey Protein Isolate", servingSize: 30, servingUnit: "g", quantity: 30, calories: 120, protein: 25.0, carbs: 1.5, fat: 1.0, fiber: 0.0, substitutionGroup: "lean_protein" },
          { id: "i3", foodId: "food-28", name: "Ripe Banana", servingSize: 1, servingUnit: "medium (118g)", quantity: 1, calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, fiber: 3.1, substitutionGroup: "simple_carb" },
          { id: "i4", foodId: "food-40", name: "Natural Peanut Butter (No Sugar)", servingSize: 32, servingUnit: "g (2 tbsp)", quantity: 20, calories: 118, protein: 5.0, carbs: 4.4, fat: 10.0, fiber: 1.3, substitutionGroup: "healthy_fat" },
        ],
      },
      {
        id: "meal-2",
        slotName: "Lunch: Chicken & Basmati Rice",
        time: "01:00 PM",
        items: [
          { id: "i5", foodId: "food-9", name: "Grilled Chicken Breast (Cooked)", servingSize: 100, servingUnit: "g", quantity: 180, calories: 297, protein: 55.8, carbs: 0.0, fat: 6.5, fiber: 0.0, substitutionGroup: "lean_protein" },
          { id: "i6", foodId: "food-1", name: "Basmati White Rice (Cooked)", servingSize: 100, servingUnit: "g", quantity: 200, calories: 260, protein: 5.4, carbs: 56.4, fat: 0.6, fiber: 0.8, substitutionGroup: "complex_carb" },
          { id: "i7", foodId: "food-33", name: "Steamed Broccoli Florets", servingSize: 100, servingUnit: "g", quantity: 150, calories: 53, protein: 3.6, carbs: 10.8, fat: 0.6, fiber: 3.9, substitutionGroup: "vegetable" },
        ],
      },
      {
        id: "meal-3",
        slotName: "Evening Snack: Greek Yogurt & Berries",
        time: "05:00 PM",
        items: [
          { id: "i8", foodId: "food-19", name: "Plain Greek Yogurt (Low Fat)", servingSize: 100, servingUnit: "g", quantity: 200, calories: 118, protein: 20.0, carbs: 7.2, fat: 0.8, fiber: 0.0, substitutionGroup: "dairy_protein" },
          { id: "i9", foodId: "food-30", name: "Fresh Blueberries", servingSize: 100, servingUnit: "g", quantity: 100, calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, substitutionGroup: "simple_carb" },
          { id: "i10", foodId: "food-36", name: "Raw Almonds", servingSize: 28, servingUnit: "g", quantity: 20, calories: 117, protein: 4.3, carbs: 4.4, fat: 10.1, fiber: 2.5, substitutionGroup: "healthy_fat" },
        ],
      },
      {
        id: "meal-4",
        slotName: "Dinner: Salmon, Sweet Potato & Greens",
        time: "08:30 PM",
        items: [
          { id: "i11", foodId: "food-14", name: "Atlantic Salmon Fillet", servingSize: 100, servingUnit: "g", quantity: 150, calories: 312, protein: 30.6, carbs: 0.0, fat: 20.1, fiber: 0.0, substitutionGroup: "fatty_protein" },
          { id: "i12", foodId: "food-34", name: "Boiled Sweet Potato", servingSize: 100, servingUnit: "g", quantity: 200, calories: 172, protein: 3.2, carbs: 40.2, fat: 0.2, fiber: 6.0, substitutionGroup: "complex_carb" },
          { id: "i13", foodId: "food-35", name: "Cucumber & Tomato Garden Salad", servingSize: 150, servingUnit: "g", quantity: 150, calories: 28, protein: 1.2, carbs: 5.4, fat: 0.3, fiber: 1.8, substitutionGroup: "vegetable" },
        ],
      },
    ],
  },
  {
    id: "plan-default-2",
    name: "Indian Vegetarian Protein Engine (2,100 kcal)",
    description: "Tailored with Paneer, Soya Chunks, Yellow Moong Dal, and Whole Wheat Rotis.",
    dailyCalories: 2100,
    targetProteinG: 150,
    targetCarbsG: 220,
    targetFatG: 55,
    targetFiberG: 38,
    isActive: false,
    createdAt: new Date().toISOString(),
    meals: [
      {
        id: "meal-v1",
        slotName: "Breakfast: Moong Chilla / Paneer & Curd",
        time: "08:00 AM",
        items: [
          { id: "iv1", foodId: "food-18", name: "Low-Fat Paneer", servingSize: 100, servingUnit: "g", quantity: 120, calories: 216, protein: 28.8, carbs: 4.8, fat: 8.4, fiber: 0.0, substitutionGroup: "lean_protein" },
          { id: "iv2", foodId: "food-4", name: "Whole Wheat Roti / Chapati", servingSize: 1, servingUnit: "piece (40g)", quantity: 2, calories: 208, protein: 6.4, carbs: 40.8, fat: 1.6, fiber: 5.6, substitutionGroup: "complex_carb" },
          { id: "iv3", foodId: "food-20", name: "Traditional Indian Curd (Dahi)", servingSize: 100, servingUnit: "g", quantity: 150, calories: 92, protein: 5.3, carbs: 7.1, fat: 5.0, fiber: 0.0, substitutionGroup: "dairy_protein" },
        ],
      },
      {
        id: "meal-v2",
        slotName: "Lunch: Soya Chunk Curry & Rice",
        time: "01:30 PM",
        items: [
          { id: "iv4", foodId: "food-23", name: "Soya Chunks (Raw)", servingSize: 50, servingUnit: "g", quantity: 60, calories: 206, protein: 31.2, carbs: 19.8, fat: 0.6, fiber: 7.8, substitutionGroup: "lean_protein" },
          { id: "iv5", foodId: "food-1", name: "Basmati White Rice (Cooked)", servingSize: 100, servingUnit: "g", quantity: 180, calories: 234, protein: 4.9, carbs: 50.8, fat: 0.5, fiber: 0.7, substitutionGroup: "complex_carb" },
          { id: "iv6", foodId: "food-25", name: "Cooked Yellow Moong Dal", servingSize: 150, servingUnit: "g", quantity: 150, calories: 147, protein: 9.8, carbs: 24.5, fat: 0.8, fiber: 5.6, substitutionGroup: "plant_protein" },
        ],
      },
      {
        id: "meal-v3",
        slotName: "Dinner: Rajma & Whole Wheat Roti",
        time: "08:30 PM",
        items: [
          { id: "iv7", foodId: "food-27", name: "Cooked Rajma (Red Kidney Beans)", servingSize: 150, servingUnit: "g", quantity: 200, calories: 240, protein: 15.3, carbs: 40.7, fat: 1.3, fiber: 10.9, substitutionGroup: "plant_protein" },
          { id: "iv8", foodId: "food-4", name: "Whole Wheat Roti / Chapati", servingSize: 1, servingUnit: "piece (40g)", quantity: 2, calories: 208, protein: 6.4, carbs: 40.8, fat: 1.6, fiber: 5.6, substitutionGroup: "complex_carb" },
          { id: "iv9", foodId: "food-35", name: "Cucumber & Tomato Garden Salad", servingSize: 150, servingUnit: "g", quantity: 150, calories: 28, protein: 1.2, carbs: 5.4, fat: 0.3, fiber: 1.8, substitutionGroup: "vegetable" },
        ],
      },
    ],
  },
];

export function getSavedDietPlans(): DietPlan[] {
  if (typeof window === "undefined") {
    return DEFAULT_DIET_PLANS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DIET_PLANS));
      return DEFAULT_DIET_PLANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DIET_PLANS;
  } catch {
    return DEFAULT_DIET_PLANS;
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
