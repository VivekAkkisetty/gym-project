/**
 * Centralized sports science and fitness calculations module.
 */

export * from "./metabolism";
export * from "./strength";
export {
  calculateNutritionTargets,
  ACTIVITY_MULTIPLIERS as NUTRITION_ACTIVITY_MULTIPLIERS,
  ESTIMATION_DISCLAIMER,
  type NutritionCalculationResult,
} from "../nutrition/calculator";
