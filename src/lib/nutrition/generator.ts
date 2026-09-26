import { FOOD_DATABASE, FoodItem } from "./foods-data";
import { PersonalProfileInput, DietPlan, MealSlot, MealFoodItem } from "@/lib/validations/nutrition";

interface MealStructure {
  name: string;
  time: string;
  calorieShare: number; // e.g. 0.30 = 30%
  primaryProteinGroup: "lean_protein" | "dairy_protein" | "plant_protein" | "fatty_protein";
  primaryCarbGroup: "complex_carb" | "simple_carb";
}

export function generatePersonalizedDietPlan(
  profile: PersonalProfileInput,
  dailyCalories: number,
  targetProteinG: number,
  targetCarbsG: number,
  targetFatG: number,
  targetFiberG: number
): DietPlan {
  const { dietaryType, numberOfMeals, fitnessGoal, allergies } = profile;

  const allergyList = (allergies || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Filter accessible foods
  const availableFoods = FOOD_DATABASE.filter((food) => {
    // Exclude allergens
    if (food.allergens && allergyList.length > 0) {
      const hasAllergen = food.allergens.some((a) => allergyList.some((al) => a.includes(al) || al.includes(a)));
      if (hasAllergen) return false;
    }

    // Filter diet preference
    if (dietaryType === "vegetarian" && (food.dietaryType === "non_vegetarian" || food.dietaryType === "eggetarian")) {
      return false;
    }
    if (dietaryType === "vegan" && food.dietaryType !== "vegan") {
      return false;
    }
    if (dietaryType === "eggetarian" && food.dietaryType === "non_vegetarian") {
      return false;
    }

    return true;
  });

  // Define meal slot blueprints based on meal count
  let structures: MealStructure[] = [];

  if (numberOfMeals === 2) {
    structures = [
      { name: "Meal 1: High-Protein Brunch", time: "11:00 AM", calorieShare: 0.5, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Meal 2: Power Dinner", time: "07:30 PM", calorieShare: 0.5, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
    ];
  } else if (numberOfMeals === 3) {
    structures = [
      { name: "Breakfast: High-Energy Morning Fuel", time: "08:00 AM", calorieShare: 0.32, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "complex_carb" },
      { name: "Lunch: Muscle Recovery & Fuel", time: "01:00 PM", calorieShare: 0.38, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Dinner: Sustained Release Nutrition", time: "08:00 PM", calorieShare: 0.30, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
    ];
  } else if (numberOfMeals === 4) {
    structures = [
      { name: "Breakfast: Clean Fuel & Protein", time: "08:00 AM", calorieShare: 0.28, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "complex_carb" },
      { name: "Lunch: Anabolic Midday Feast", time: "01:00 PM", calorieShare: 0.34, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Evening Snack: Pre-Workout Boost", time: "05:00 PM", calorieShare: 0.14, primaryProteinGroup: "plant_protein", primaryCarbGroup: "simple_carb" },
      { name: "Dinner: Recovery & Repair", time: "08:30 PM", calorieShare: 0.24, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
    ];
  } else if (numberOfMeals === 5) {
    structures = [
      { name: "Breakfast: Complex Carbs & Fast Protein", time: "07:30 AM", calorieShare: 0.24, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "complex_carb" },
      { name: "Mid-Morning: Vitality Snack", time: "11:00 AM", calorieShare: 0.12, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "simple_carb" },
      { name: "Lunch: Heavy Fuel & Lean Protein", time: "01:30 PM", calorieShare: 0.30, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Evening: Pre-Workout Primer", time: "05:00 PM", calorieShare: 0.14, primaryProteinGroup: "plant_protein", primaryCarbGroup: "simple_carb" },
      { name: "Dinner: Slow Digesting Recovery", time: "08:30 PM", calorieShare: 0.20, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
    ];
  } else {
    // 6 meals
    structures = [
      { name: "Breakfast: Morning Accelerator", time: "07:00 AM", calorieShare: 0.20, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "complex_carb" },
      { name: "Mid-Morning: Protein Bridge", time: "10:00 AM", calorieShare: 0.12, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "simple_carb" },
      { name: "Lunch: Hypertrophy Fuel", time: "01:00 PM", calorieShare: 0.26, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Afternoon Snack: Endurance Intake", time: "04:30 PM", calorieShare: 0.12, primaryProteinGroup: "plant_protein", primaryCarbGroup: "simple_carb" },
      { name: "Dinner: Protein & Micronutrients", time: "07:30 PM", calorieShare: 0.20, primaryProteinGroup: "lean_protein", primaryCarbGroup: "complex_carb" },
      { name: "Night Snack: Casein/Recovery", time: "10:00 PM", calorieShare: 0.10, primaryProteinGroup: "dairy_protein", primaryCarbGroup: "simple_carb" },
    ];
  }

  // Helper to pick a food by substitution group or fallback
  const pickFood = (group: string, fallbackCategory?: string): FoodItem => {
    let match = availableFoods.find((f) => f.substitutionGroup === group);
    if (!match && fallbackCategory) {
      match = availableFoods.find((f) => f.category === fallbackCategory);
    }
    return match || availableFoods[0];
  };

  const meals: MealSlot[] = structures.map((struct, idx) => {
    const mealItems: MealFoodItem[] = [];

    // Select suitable components based on meal slot
    if (idx === 0) {
      // Breakfast: e.g. Oats + Protein source (Whey/Milk/Egg whites) + Fruit/Nuts
      const carbFood = pickFood("complex_carb", "Oats");
      const proteinFood = pickFood("dairy_protein", "Milk");
      const fruitFood = pickFood("simple_carb", "Fruits");
      const fatFood = pickFood("healthy_fat", "Nuts");

      mealItems.push(createMealFoodItem(carbFood, 50));
      mealItems.push(createMealFoodItem(proteinFood, proteinFood.category === "Milk" ? 250 : 30));
      mealItems.push(createMealFoodItem(fruitFood, 1));
      mealItems.push(createMealFoodItem(fatFood, 15));
    } else if (struct.calorieShare < 0.16) {
      // Light snack
      const snackFood = pickFood("dairy_protein", "Curd");
      const fruitOrNuts = pickFood("healthy_fat", "Nuts");
      mealItems.push(createMealFoodItem(snackFood, 150));
      mealItems.push(createMealFoodItem(fruitOrNuts, 20));
    } else {
      // Main meal (Lunch or Dinner)
      const proteinFood = pickFood("lean_protein", "Chicken");
      const carbFood = pickFood("complex_carb", "Rice");
      const vegFood = pickFood("vegetable", "Vegetables");

      // Calculate protein portion to match ~25-35g protein
      const proteinServingGrams = proteinFood.protein > 0 ? Math.round((32 / (proteinFood.protein / proteinFood.servingSize))) : 100;
      const carbServingGrams = carbFood.carbs > 0 ? Math.round((55 / (carbFood.carbs / carbFood.servingSize))) : 120;

      mealItems.push(createMealFoodItem(proteinFood, proteinServingGrams));
      mealItems.push(createMealFoodItem(carbFood, carbServingGrams));
      mealItems.push(createMealFoodItem(vegFood, 120));
    }

    // Scale meal items proportionally so meal calories match targetMealCalories
    const targetMealCalories = dailyCalories * struct.calorieShare;
    const rawCalories = mealItems.reduce((acc, it) => acc + it.calories, 0);
    
    let scaledItems = mealItems;
    if (rawCalories > 0) {
      const scale = targetMealCalories / rawCalories;
      scaledItems = mealItems.map((item) => {
        const food = availableFoods.find((f) => f.id === item.foodId) || {
          id: item.foodId,
          name: item.name,
          servingSize: item.servingSize,
          servingUnit: item.servingUnit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber,
          substitutionGroup: item.substitutionGroup,
        };
        
        let newQty: number;
        if (item.servingUnit === "g" || item.servingUnit === "ml") {
          newQty = Math.max(15, Math.round((item.quantity * scale) / 5) * 5);
        } else {
          newQty = Math.max(1, Math.round(item.quantity * scale * 2) / 2);
        }
        return createMealFoodItem(food as FoodItem, newQty);
      });
    }

    return {
      id: `meal-${idx + 1}`,
      slotName: struct.name,
      time: struct.time,
      items: scaledItems,
    };
  });

  const goalName =
    fitnessGoal === "fat_loss"
      ? "Fat Loss & High Protein"
      : fitnessGoal === "muscle_gain"
      ? "Lean Hypertrophy Surplus"
      : fitnessGoal === "body_recomposition"
      ? "Body Recomposition Engine"
      : "Metabolic Maintenance";

  return {
    id: `plan-${Date.now()}`,
    name: `${goalName} (${dailyCalories} kcal)`,
    description: `Custom ${dietaryType.replace("_", " ")} plan tailored for ${numberOfMeals} daily meals matching ${targetProteinG}g protein target.`,
    dailyCalories,
    targetProteinG,
    targetCarbsG,
    targetFatG,
    targetFiberG,
    meals,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

function createMealFoodItem(food: FoodItem, quantity: number): MealFoodItem {
  const scale = quantity / food.servingSize;
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    foodId: food.id,
    name: food.name,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    quantity,
    calories: Math.round(food.calories * scale),
    protein: Math.round(food.protein * scale * 10) / 10,
    carbs: Math.round(food.carbs * scale * 10) / 10,
    fat: Math.round(food.fat * scale * 10) / 10,
    fiber: Math.round(food.fiber * scale * 10) / 10,
    substitutionGroup: food.substitutionGroup,
  };
}
