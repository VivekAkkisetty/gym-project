import { DietPlan } from "@/lib/validations/nutrition";
import { GroceryAisle, ShoppingListItem } from "@/types/ai";

const SHOPPING_LIST_STORAGE_KEY = "apexfit_shopping_checked_items";

/**
 * Maps common food names/categories to practical grocery store aisles
 */
export function determineAisle(foodName: string): GroceryAisle {
  const n = foodName.toLowerCase();

  // Meat & Poultry
  if (
    n.includes("chicken") ||
    n.includes("turkey") ||
    n.includes("beef") ||
    n.includes("pork") ||
    n.includes("steak") ||
    n.includes("bison")
  ) {
    return "Meat & Poultry";
  }

  // Seafood
  if (
    n.includes("salmon") ||
    n.includes("tuna") ||
    n.includes("shrimp") ||
    n.includes("fish") ||
    n.includes("cod") ||
    n.includes("tilapia")
  ) {
    return "Seafood";
  }

  // Dairy & Refrigerated
  if (
    n.includes("egg") ||
    n.includes("milk") ||
    n.includes("yogurt") ||
    n.includes("cheese") ||
    n.includes("cottage") ||
    n.includes("tofu") ||
    n.includes("tempeh")
  ) {
    return "Dairy & Refrigerated";
  }

  // Produce
  if (
    n.includes("banana") ||
    n.includes("apple") ||
    n.includes("berr") ||
    n.includes("spinach") ||
    n.includes("broccoli") ||
    n.includes("sweet potato") ||
    n.includes("potato") ||
    n.includes("avocado") ||
    n.includes("salad") ||
    n.includes("cucumber") ||
    n.includes("tomato") ||
    n.includes("onion") ||
    n.includes("garlic") ||
    n.includes("asparagus")
  ) {
    return "Produce";
  }

  // Nuts & Seeds
  if (
    n.includes("almond") ||
    n.includes("peanut") ||
    n.includes("walnut") ||
    n.includes("cashew") ||
    n.includes("chia") ||
    n.includes("flax") ||
    n.includes("butter")
  ) {
    return "Nuts & Seeds";
  }

  // Supplements
  if (
    n.includes("whey") ||
    n.includes("isolate") ||
    n.includes("casein") ||
    n.includes("creatine") ||
    n.includes("bcaa") ||
    n.includes("protein powder")
  ) {
    return "Supplements";
  }

  // Grains & Pantry
  if (
    n.includes("rice") ||
    n.includes("oat") ||
    n.includes("quinoa") ||
    n.includes("bread") ||
    n.includes("pasta") ||
    n.includes("oil") ||
    n.includes("honey") ||
    n.includes("sauce")
  ) {
    return "Grains & Pantry";
  }

  return "Other";
}

/**
 * Aggregates all ingredients across all meals of a Diet Plan into a clean shopping list
 */
export function generateShoppingList(plan: DietPlan, daysMultiplier: number = 7): ShoppingListItem[] {
  const itemMap = new Map<string, ShoppingListItem>();

  for (const meal of plan.meals) {
    for (const item of meal.items) {
      const key = `${item.name.toLowerCase()}_${item.servingUnit.toLowerCase()}`;
      const quantityToAdd = (item.quantity || item.servingSize) * daysMultiplier;

      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        existing.totalQuantity += quantityToAdd;
        if (!existing.mealReferences.includes(meal.slotName)) {
          existing.mealReferences.push(meal.slotName);
        }
      } else {
        itemMap.set(key, {
          id: `shop-${key.replace(/[^a-z0-9]/g, "-")}`,
          foodId: item.foodId,
          name: item.name,
          aisle: determineAisle(item.name),
          totalQuantity: quantityToAdd,
          unit: item.servingUnit,
          mealReferences: [meal.slotName],
          checked: false,
        });
      }
    }
  }

  // Hydrate with saved checked states
  const checkedSet = getStoredCheckedItems();
  const list = Array.from(itemMap.values()).map((item) => ({
    ...item,
    checked: checkedSet.has(item.id),
  }));

  // Sort by aisle then name
  return list.sort((a, b) => {
    if (a.aisle !== b.aisle) return a.aisle.localeCompare(b.aisle);
    return a.name.localeCompare(b.name);
  });
}

export function getStoredCheckedItems(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function saveCheckedItemState(itemId: string, checked: boolean) {
  if (typeof window === "undefined") return;
  try {
    const set = getStoredCheckedItems();
    if (checked) {
      set.add(itemId);
    } else {
      set.delete(itemId);
    }
    localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage errors
  }
}

export function formatShoppingListForClipboard(items: ShoppingListItem[]): string {
  const grouped: Record<string, ShoppingListItem[]> = {};
  for (const item of items) {
    if (!grouped[item.aisle]) grouped[item.aisle] = [];
    grouped[item.aisle].push(item);
  }

  let text = `🛒 ApexFit Grocery List (7-Day Batch)\n====================================\n\n`;
  for (const [aisle, list] of Object.entries(grouped)) {
    text += `[${aisle.toUpperCase()}]\n`;
    for (const item of list) {
      const mark = item.checked ? "✓ " : "☐ ";
      text += `  ${mark}${item.name}: ${item.totalQuantity} ${item.unit}\n`;
    }
    text += "\n";
  }

  return text.trim();
}
