/**
 * Evidence-based metabolic and energy expenditure calculations.
 * Implements Mifflin-St Jeor equation and standard sports nutrition formulas.
 */

export interface BmrCalculationInput {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
}

export interface TdeeCalculationInput extends BmrCalculationInput {
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
} as const;

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor formula.
 * Men: BMR = 10W + 6.25H - 5A + 5
 * Women: BMR = 10W + 6.25H - 5A - 161
 */
export function calculateBmr({
  weightKg,
  heightCm,
  age,
  sex,
}: BmrCalculationInput): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === "male" ? 5 : -161;
  return Math.round(bmr);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTdee(input: TdeeCalculationInput): number {
  const bmr = calculateBmr(input);
  const multiplier = ACTIVITY_MULTIPLIERS[input.activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates recommended daily water intake based on body weight and activity.
 * Baseline: 35ml per kg of bodyweight.
 */
export function calculateWaterRequirementMl(weightKg: number): number {
  if (weightKg <= 0) return 2500;
  return Math.round(Math.max(2000, weightKg * 35));
}
