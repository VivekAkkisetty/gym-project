import { PersonalProfileInput } from "@/lib/validations/nutrition";

export interface NutritionCalculationResult {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterTargetMl: number;
  calorieAdjustmentLabel: string;
  proteinRatioLabel: string;
  disclaimer: string;
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
} as const;

export const ESTIMATION_DISCLAIMER =
  "Notice: Nutritional and metabolic formulas (Mifflin-St Jeor equation) provide evidence-based mathematical baselines. Actual energy expenditure varies based on genetics, non-exercise activity thermogenesis (NEAT), hormonal profiles, and training intensity. Use these targets as a calibrated starting point and adjust by 100-150 kcal based on your 2-week weight progression.";

/**
 * Calculates scientifically grounded BMR, TDEE, Caloric Targets, and Macronutrient Allocations.
 */
export function calculateNutritionTargets(
  input: PersonalProfileInput
): NutritionCalculationResult {
  const { weightKg, heightCm, age, sex, activityLevel, fitnessGoal } = input;

  // 1. Basal Metabolic Rate (BMR) - Mifflin-St Jeor
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === "male" ? 5 : -161;
  bmr = Math.round(bmr);

  // 2. Total Daily Energy Expenditure (TDEE)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  // 3. Caloric Target based on Fitness Goal
  let dailyCalories = tdee;
  let calorieAdjustmentLabel = "Maintenance";

  switch (fitnessGoal) {
    case "fat_loss":
      dailyCalories = Math.max(1200, Math.round(tdee - 450));
      calorieAdjustmentLabel = "Deficit (-450 kcal for steady fat loss)";
      break;
    case "muscle_gain":
      dailyCalories = Math.round(tdee + 350);
      calorieAdjustmentLabel = "Surplus (+350 kcal for lean hypertrophy)";
      break;
    case "body_recomposition":
      dailyCalories = Math.round(tdee - 150);
      calorieAdjustmentLabel = "Slight Deficit / Recomposition (-150 kcal)";
      break;
    case "maintenance":
    default:
      dailyCalories = tdee;
      calorieAdjustmentLabel = "Energy Balance (Maintenance)";
      break;
  }

  // 4. Macro Calculation
  // Protein (g/kg):
  let proteinPerKg = 2.0;
  if (fitnessGoal === "fat_loss") {
    proteinPerKg = 2.2; // Higher protein preserves lean mass in deficit
  } else if (fitnessGoal === "body_recomposition") {
    proteinPerKg = 2.3; // Maximal muscle protein synthesis
  } else if (fitnessGoal === "muscle_gain") {
    proteinPerKg = 2.0;
  } else {
    proteinPerKg = 1.8;
  }

  const proteinG = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinG * 4;

  // Fat (25% of total calories, bounded to ~0.7-1.0g/kg):
  const targetFatCalories = dailyCalories * 0.25;
  let fatG = Math.round(targetFatCalories / 9);
  // Ensure minimum healthy hormonal baseline of 0.6g per kg
  const minFatG = Math.round(weightKg * 0.6);
  if (fatG < minFatG) {
    fatG = minFatG;
  }
  const fatCalories = fatG * 9;

  // Carbohydrates (Remaining calories / 4):
  const remainingCaloriesForCarbs = Math.max(0, dailyCalories - proteinCalories - fatCalories);
  const carbsG = Math.round(remainingCaloriesForCarbs / 4);

  // Dietary Fibre: ~14g per 1,000 kcal
  const fiberG = Math.min(50, Math.max(25, Math.round((dailyCalories / 1000) * 14)));

  // Daily Water Target (ml): 35-40ml per kg bodyweight + exercise allowance
  const waterTargetMl = Math.round(weightKg * 38 + (activityLevel === "very_active" || activityLevel === "extra_active" ? 600 : 300));

  return {
    bmr,
    tdee,
    dailyCalories,
    proteinG,
    carbsG,
    fatG,
    fiberG,
    waterTargetMl,
    calorieAdjustmentLabel,
    proteinRatioLabel: `${proteinPerKg}g per kg bodyweight`,
    disclaimer: ESTIMATION_DISCLAIMER,
  };
}
