import { FOOD_DATABASE, FoodItem, DietaryType, getFoodById } from "./foods-data";
import { MealFoodItem } from "@/lib/validations/nutrition";

export interface SubstitutionCandidate {
  originalFood: MealFoodItem;
  replacementFood: FoodItem;
  suggestedQuantity: number;
  suggestedUnit: string;
  newCalories: number;
  newProtein: number;
  newCarbs: number;
  newFat: number;
  newFiber: number;
  calorieDifference: number;
  proteinDifference: number;
  matchScore: number;
  reason: string;
}

/**
 * Finds optimal food alternatives matching the macronutrient profile of the source item.
 */
export function findSubstitutions(
  sourceItem: MealFoodItem,
  userDietaryType: DietaryType = "non_vegetarian",
  excludedAllergens: string[] = []
): SubstitutionCandidate[] {
  const originalFood = getFoodById(sourceItem.foodId);
  const targetProtein = sourceItem.protein;
  const targetCarbs = sourceItem.carbs;
  const targetCalories = sourceItem.calories;

  // Determine substitution group from original food or fallback
  const group = originalFood?.substitutionGroup || "lean_protein";

  // Filter candidates matching the group and dietary preferences
  const candidates = FOOD_DATABASE.filter((food) => {
    // Avoid replacing with itself
    if (food.id === sourceItem.foodId) return false;

    // Filter allergens
    if (food.allergens && excludedAllergens.length > 0) {
      const hasAllergen = food.allergens.some((a) => excludedAllergens.includes(a));
      if (hasAllergen) return false;
    }

    // Filter dietary restriction
    if (userDietaryType === "vegetarian" && (food.dietaryType === "non_vegetarian" || food.dietaryType === "eggetarian")) {
      return false;
    }
    if (userDietaryType === "vegan" && food.dietaryType !== "vegan") {
      return false;
    }
    if (userDietaryType === "eggetarian" && food.dietaryType === "non_vegetarian") {
      return false;
    }

    // Match group or compatible groups
    if (group === "lean_protein" || group === "fatty_protein" || group === "dairy_protein" || group === "plant_protein") {
      return (
        food.substitutionGroup === "lean_protein" ||
        food.substitutionGroup === "plant_protein" ||
        food.substitutionGroup === "dairy_protein" ||
        food.substitutionGroup === "fatty_protein"
      );
    }

    if (group === "complex_carb" || group === "simple_carb") {
      return food.substitutionGroup === "complex_carb" || food.substitutionGroup === "simple_carb";
    }

    if (group === "healthy_fat") {
      return food.substitutionGroup === "healthy_fat";
    }

    if (group === "vegetable") {
      return food.substitutionGroup === "vegetable";
    }

    return food.category === originalFood?.category;
  });

  const results: SubstitutionCandidate[] = candidates.map((candidate) => {
    // Calculate scaling factor to match primary macro
    let scale = 1;
    let reason = "Alternative source";

    if (group.includes("protein") && candidate.protein > 0 && targetProtein > 0) {
      // Match protein content
      const proteinPerUnit = candidate.protein / candidate.servingSize;
      const targetGrams = targetProtein / proteinPerUnit;
      scale = targetGrams / candidate.servingSize;
      reason = candidate.dietaryType === "vegan" || candidate.dietaryType === "vegetarian"
        ? "Plant / Vegetarian High Protein Swap"
        : "Equivalent Lean Protein Profile";
    } else if (group.includes("carb") && candidate.carbs > 0 && targetCarbs > 0) {
      // Match carb content
      const carbsPerUnit = candidate.carbs / candidate.servingSize;
      const targetGrams = targetCarbs / carbsPerUnit;
      scale = targetGrams / candidate.servingSize;
      reason = "Matched Complex Carbohydrate Source";
    } else {
      // Match calories
      scale = targetCalories / (candidate.calories || 1);
      reason = "Matched Caloric Density";
    }

    // Clamp scaling to realistic human portions
    scale = Math.max(0.2, Math.min(5, scale));

    const suggestedQuantity = Math.round(candidate.servingSize * scale);
    const newCalories = Math.round(candidate.calories * scale);
    const newProtein = Math.round(candidate.protein * scale * 10) / 10;
    const newCarbs = Math.round(candidate.carbs * scale * 10) / 10;
    const newFat = Math.round(candidate.fat * scale * 10) / 10;
    const newFiber = Math.round(candidate.fiber * scale * 10) / 10;

    const calorieDiff = newCalories - targetCalories;
    const proteinDiff = Math.round((newProtein - targetProtein) * 10) / 10;

    // Score based on proximity of calories and protein
    const matchScore = Math.max(0, 100 - Math.abs(calorieDiff) * 0.3 - Math.abs(proteinDiff) * 1.5);

    return {
      originalFood: sourceItem,
      replacementFood: candidate,
      suggestedQuantity,
      suggestedUnit: candidate.servingUnit.includes("(") ? candidate.servingUnit.split("(")[0].trim() : candidate.servingUnit,
      newCalories,
      newProtein,
      newCarbs,
      newFat,
      newFiber,
      calorieDifference: calorieDiff,
      proteinDifference: proteinDiff,
      matchScore: Math.round(matchScore),
      reason,
    };
  });

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}
