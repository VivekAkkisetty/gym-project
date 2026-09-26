import { DietPlan } from "@/lib/validations/nutrition";
import { MealPrepGuide } from "@/types/ai";

export function generateMealPrepGuide(plan: DietPlan): MealPrepGuide {
  return {
    id: `prep-${plan.id}`,
    title: `Precision Batch Prep Guide: ${plan.name}`,
    estimatedPrepTimeMinutes: 75,
    servingsYield: 14, // 2 meals per day x 7 days
    batchSteps: [
      {
        stepNumber: 1,
        phase: "prep",
        title: "Sanitation & Mise en Place",
        instruction:
          "Wash all produce under cold running water. Pat dry all proteins with paper towels. Set out 14 glass airtight containers (glass preserves food freshness significantly longer than plastic).",
      },
      {
        stepNumber: 2,
        phase: "cook",
        title: "Bulk Protein Roast (Chicken, Salmon, or Tofu)",
        instruction:
          "Preheat oven to 200°C (400°F). Line two large baking sheets with parchment paper. Season proteins evenly with salt, black pepper, garlic powder, and paprika (zero added calorie seasoning). Roast for 22-25 mins until internal temperature reaches 74°C (165°F).",
      },
      {
        stepNumber: 3,
        phase: "cook",
        title: "Slow-Release Carbohydrate Simmer (Rice / Sweet Potato / Oats)",
        instruction:
          "Rinse rice/quinoa thoroughly to eliminate excess starch. Cook grains in a 2:1 water-to-grain ratio with a pinch of sea salt. If preparing sweet potatoes, cube into 1-inch chunks and roast alongside proteins.",
      },
      {
        stepNumber: 4,
        phase: "cook",
        title: "Cruciferous Vegetable Steam / Sauté",
        instruction:
          "Steam broccoli florets or asparagus spears for 4-5 minutes only until crisp-tender (vibrant green). Oversteaming causes sulfur breakdown and soggy reheating.",
      },
      {
        stepNumber: 5,
        phase: "portion",
        title: "Gram-Accurate Food Scale Assembly",
        instruction:
          "Zero your digital food scale with the container lid off. Portion out cooked proteins, carbs, and vegetables into each container according to your daily target meal weights.",
      },
      {
        stepNumber: 6,
        phase: "storage",
        title: "Rapid Cool & Airtight Seal",
        instruction:
          "Allow meals to cool uncovered for 20 minutes to prevent steam condensation (which makes food mushy). Seal airtight and transfer Days 1–3 into the refrigerator and Days 4–7 into the freezer.",
      },
    ],
    storageGuidelines: [
      {
        item: "Cooked Chicken Breast & Lean Poultry",
        refrigeratorDays: 4,
        freezerMonths: 3,
        reheatTips: "Sprinkle 1 tsp of water over chicken before microwaving at 70% power for 90 seconds to preserve tenderness.",
      },
      {
        item: "Cooked Salmon & White Fish",
        refrigeratorDays: 3,
        freezerMonths: 2,
        reheatTips: "Best reheated in a toaster oven at 160°C for 6 minutes rather than microwave to avoid fishy odor.",
      },
      {
        item: "Steamed White Rice, Quinoa & Sweet Potatoes",
        refrigeratorDays: 5,
        freezerMonths: 3,
        reheatTips: "Cover with a damp paper towel when reheating to steam-restore grain moisture.",
      },
      {
        item: "Greek Yogurt, Berries & Raw Nuts",
        refrigeratorDays: 7,
        freezerMonths: 0,
        reheatTips: "Store dry nuts separately from moist yogurt until the moment of consumption to maintain crunch.",
      },
    ],
    foodSafetyNotes: [
      "Keep refrigerated foods strictly below 4°C (40°F) to inhibit bacterial proliferation.",
      "Never leave cooked proteins at room temperature for more than 2 hours post-cooking.",
      "Thaw frozen batch meals overnight in the refrigerator, not on the kitchen counter.",
      "Reheat leftovers until piping hot (internal temperature of 74°C / 165°F).",
    ],
  };
}
