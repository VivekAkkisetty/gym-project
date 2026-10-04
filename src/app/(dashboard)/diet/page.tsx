"use client";

import React, { useState, useMemo } from "react";
import {
  Utensils,
  Plus,
  FolderHeart,
  Calculator,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ProfileCalculatorCard } from "@/components/nutrition/ProfileCalculatorCard";
import { MacroDonutChart } from "@/components/nutrition/MacroDonutChart";
import { MealCard } from "@/components/nutrition/MealCard";
import { FoodSearchModal } from "@/components/nutrition/FoodSearchModal";
import { FoodSubstitutionModal } from "@/components/nutrition/FoodSubstitutionModal";
import { WaterTrackerCard } from "@/components/nutrition/WaterTrackerCard";
import { SavedPlansModal } from "@/components/nutrition/SavedPlansModal";
import {
  DietPlan,
  MealFoodItem,
  PersonalProfileInput,
} from "@/lib/validations/nutrition";
import {
  getSavedDietPlans,
  saveDietPlan,
  deleteDietPlan,
} from "@/lib/nutrition/storage";
import { generatePersonalizedDietPlan } from "@/lib/nutrition/generator";
import { NutritionCalculationResult } from "@/lib/nutrition/calculator";
import { SubstitutionCandidate } from "@/lib/nutrition/substitutions";
import {
  FOOD_DATABASE,
  FOOD_CATEGORIES,
  FoodCategory,
  DietaryType,
} from "@/lib/nutrition/foods-data";

export default function DietPage() {
  const [plans, setPlans] = useState<DietPlan[]>(() => getSavedDietPlans());
  const [activePlan, setActivePlan] = useState<DietPlan | null>(() => {
    const loaded = getSavedDietPlans();
    return loaded.find((p) => p.isActive) || loaded[0] || null;
  });

  // Modal controls
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMealSlotId, setSelectedMealSlotId] = useState<string | null>(null);
  const [substitutionModalOpen, setSubstitutionModalOpen] = useState(false);
  const [substitutionTarget, setSubstitutionTarget] = useState<{
    mealId: string;
    item: MealFoodItem;
  } | null>(null);
  const [savedPlansModalOpen, setSavedPlansModalOpen] = useState(false);

  // Food explorer tab filters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState<FoodCategory | "All">("All");
  const [catalogDiet, setCatalogDiet] = useState<DietaryType | "All">("All");

  // Compute live consumed totals from all meals in active plan
  const liveTotals = useMemo(() => {
    if (!activePlan) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      };
    }
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    activePlan.meals.forEach((meal) => {
      meal.items.forEach((item) => {
        calories += item.calories;
        protein += item.protein;
        carbs += item.carbs;
        fat += item.fat;
        fiber += item.fiber;
      });
    });

    return {
      calories,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
    };
  }, [activePlan]);

  // Add food item to selected meal slot
  const handleAddFoodToMeal = (foodItem: MealFoodItem) => {
    if (!selectedMealSlotId || !activePlan) return;

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id === selectedMealSlotId) {
        return {
          ...meal,
          items: [...meal.items, foodItem],
        };
      }
      return meal;
    });

    const updatedPlan: DietPlan = {
      ...activePlan,
      meals: updatedMeals,
    };

    setActivePlan(updatedPlan);
    const updatedAll = saveDietPlan(updatedPlan);
    setPlans(updatedAll);
    toast.success(`Added ${foodItem.name} (${foodItem.calories} kcal)!`);
  };

  // Remove food item from a meal slot
  const handleRemoveFood = (mealId: string, itemId: string) => {
    if (!activePlan) return;

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.filter((item) => item.id !== itemId),
        };
      }
      return meal;
    });

    const updatedPlan: DietPlan = {
      ...activePlan,
      meals: updatedMeals,
    };

    setActivePlan(updatedPlan);
    const updatedAll = saveDietPlan(updatedPlan);
    setPlans(updatedAll);
    toast.info("Food item removed.");
  };

  // Open food search modal for specific slot
  const handleOpenAddFoodModal = (mealId: string) => {
    setSelectedMealSlotId(mealId);
    setSearchModalOpen(true);
  };

  // Open substitution modal for specific item
  const handleOpenSubstitutionModal = (mealId: string, item: MealFoodItem) => {
    setSubstitutionTarget({ mealId, item });
    setSubstitutionModalOpen(true);
  };

  // Apply substitution candidate
  const handleApplySubstitution = (
    originalItem: MealFoodItem,
    candidate: SubstitutionCandidate
  ) => {
    if (!substitutionTarget || !activePlan) return;

    const { mealId } = substitutionTarget;
    const newItem: MealFoodItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      foodId: candidate.replacementFood.id,
      name: candidate.replacementFood.name,
      servingSize: candidate.replacementFood.servingSize,
      servingUnit: candidate.replacementFood.servingUnit,
      quantity: candidate.suggestedQuantity,
      calories: candidate.newCalories,
      protein: candidate.newProtein,
      carbs: candidate.newCarbs,
      fat: candidate.newFat,
      fiber: candidate.newFiber,
      substitutionGroup: candidate.replacementFood.substitutionGroup,
    };

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.map((it) => (it.id === originalItem.id ? newItem : it)),
        };
      }
      return meal;
    });

    const updatedPlan: DietPlan = {
      ...activePlan,
      meals: updatedMeals,
    };

    setActivePlan(updatedPlan);
    const updatedAll = saveDietPlan(updatedPlan);
    setPlans(updatedAll);
    toast.success(`Substituted ${originalItem.name} with ${newItem.name}!`);
  };

  // Auto-generate plan from personal calculator
  const handleApplyTargetsAndGenerate = (
    profile: PersonalProfileInput,
    targets: NutritionCalculationResult
  ) => {
    const generated = generatePersonalizedDietPlan(
      profile,
      targets.dailyCalories,
      targets.proteinG,
      targets.carbsG,
      targets.fatG,
      targets.fiberG
    );

    setActivePlan(generated);
    const updatedPlans = saveDietPlan(generated);
    setPlans(updatedPlans);
    toast.success(`Generated personalized diet plan: "${generated.name}"!`);
  };

  // Save current plan snapshot as new
  const handleSaveCurrentAsNew = (name: string) => {
    if (!activePlan) return;

    const newPlan: DietPlan = {
      ...activePlan,
      id: `plan-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const updatedPlans = saveDietPlan(newPlan);
    setPlans(updatedPlans);
    setActivePlan(newPlan);
  };

  // Delete plan
  const handleDeletePlan = (planId: string) => {
    const remaining = deleteDietPlan(planId);
    setPlans(remaining);
    if (activePlan?.id === planId) {
      setActivePlan(remaining[0] || null);
    }
  };

  // Filter food catalog for explorer tab
  const filteredCatalogFoods = useMemo(() => {
    const q = catalogSearch.toLowerCase().trim();
    return FOOD_DATABASE.filter((food) => {
      const matchesSearch =
        !q || food.name.toLowerCase().includes(q) || food.category.toLowerCase().includes(q);
      const matchesCategory =
        catalogCategory === "All" || food.category === catalogCategory;
      let matchesDiet = true;
      if (catalogDiet !== "All") {
        if (catalogDiet === "vegetarian") {
          matchesDiet = food.dietaryType === "vegetarian" || food.dietaryType === "vegan";
        } else if (catalogDiet === "vegan") {
          matchesDiet = food.dietaryType === "vegan";
        } else if (catalogDiet === "eggetarian") {
          matchesDiet =
            food.dietaryType === "vegetarian" ||
            food.dietaryType === "vegan" ||
            food.dietaryType === "eggetarian";
        }
      }
      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [catalogSearch, catalogCategory, catalogDiet]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Diet & Nutrition System
            </h2>
            <Badge variant="default" className="text-xs font-semibold">
              Live Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Active Blueprint: <span className="font-bold text-foreground">{activePlan ? activePlan.name : "None Selected"}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSavedPlansModalOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <FolderHeart className="h-4 w-4 text-emerald-500" />
            <span>Saved Plans ({plans.length})</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              if (activePlan && activePlan.meals.length > 0) {
                handleOpenAddFoodModal(activePlan.meals[0].id);
              } else {
                toast.info("Please create or select a diet plan first.");
              }
            }}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Food</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="planner" className="gap-2 text-xs">
            <Utensils className="h-3.5 w-3.5" />
            <span>Meal Planner</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-2 text-xs">
            <Calculator className="h-3.5 w-3.5" />
            <span>Target Engine</span>
          </TabsTrigger>
          <TabsTrigger value="foods" className="gap-2 text-xs">
            <Search className="h-3.5 w-3.5" />
            <span>Food Database</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MEAL PLANNER & DAILY TRACKER */}
        <TabsContent value="planner" className="space-y-6 pt-4">
          {!activePlan ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <MacroDonutChart
                    caloriesConsumed={0}
                    calorieTarget={2000}
                    proteinConsumed={0}
                    proteinTarget={150}
                    carbsConsumed={0}
                    carbsTarget={200}
                    fatConsumed={0}
                    fatTarget={65}
                    fiberConsumed={0}
                    fiberTarget={30}
                  />
                </div>
                <div className="lg:col-span-2">
                  <WaterTrackerCard
                    initialTargetMl={3000}
                    initialConsumedMl={0}
                  />
                </div>
              </div>

              <Card className="border-dashed p-8 text-center space-y-3">
                <Utensils className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No Diet Plan Active</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  You don&apos;t have any active meal plan yet. Use the Target Engine tab to calculate and generate your personalized nutrition plan.
                </p>
              </Card>
            </div>
          ) : (
            <>
              {/* Top Analytics Row: Macro Allocation Donut + Daily Hydration Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <MacroDonutChart
                    caloriesConsumed={liveTotals.calories}
                    calorieTarget={activePlan.dailyCalories}
                    proteinConsumed={liveTotals.protein}
                    proteinTarget={activePlan.targetProteinG}
                    carbsConsumed={liveTotals.carbs}
                    carbsTarget={activePlan.targetCarbsG}
                    fatConsumed={liveTotals.fat}
                    fatTarget={activePlan.targetFatG}
                    fiberConsumed={liveTotals.fiber}
                    fiberTarget={activePlan.targetFiberG}
                  />
                </div>
                <div className="lg:col-span-2">
                  <WaterTrackerCard
                    initialTargetMl={3200}
                    initialConsumedMl={0}
                  />
                </div>
              </div>

              {/* Meal Slots Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Scheduled Daily Meals ({activePlan.meals.length} Slots)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Click &apos;Add Food&apos; on any meal or use &apos;Substitute&apos; to swap ingredients while maintaining protein ratios.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activePlan.meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onAddFood={handleOpenAddFoodModal}
                      onRemoveFood={handleRemoveFood}
                      onSubstituteFood={handleOpenSubstitutionModal}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* TAB 2: PERSONAL PROFILE & TARGET ENGINE */}
        <TabsContent value="calculator" className="space-y-6 pt-4">
          <ProfileCalculatorCard onApplyTargets={handleApplyTargetsAndGenerate} />
        </TabsContent>

        {/* TAB 3: SEARCHABLE FOOD DATABASE EXPLORER */}
        <TabsContent value="foods" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Food Nutrition Database ({FOOD_DATABASE.length} Verified Items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search whole foods, pulses, dairy, Indian staples, poultry, fruits..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              {/* Dietary Type Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">Diet:</span>
                {(["All", "non_vegetarian", "eggetarian", "vegetarian", "vegan"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setCatalogDiet(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      catalogDiet === d
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d === "All" ? "All Diets" : d.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Category chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setCatalogCategory("All")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    catalogCategory === "All"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Categories
                </button>
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      catalogCategory === cat
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food Items Table */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 border-b border-zinc-200 dark:border-zinc-800 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3">Food Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Serving</th>
                        <th className="p-3 text-right">Calories</th>
                        <th className="p-3 text-right">Protein</th>
                        <th className="p-3 text-right">Carbs</th>
                        <th className="p-3 text-right">Fat</th>
                        <th className="p-3 text-right">Fibre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                      {filteredCatalogFoods.map((food) => (
                        <tr key={food.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-semibold text-foreground">
                            {food.name}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px]">
                              {food.category}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {food.servingSize} {food.servingUnit}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-foreground">
                            {food.calories} kcal
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-500">
                            {food.protein}g
                          </td>
                          <td className="p-3 text-right font-semibold text-cyan-500">
                            {food.carbs}g
                          </td>
                          <td className="p-3 text-right font-semibold text-amber-500">
                            {food.fat}g
                          </td>
                          <td className="p-3 text-right font-semibold text-purple-500">
                            {food.fiber}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <FoodSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        targetMealSlotName={
          activePlan?.meals.find((m) => m.id === selectedMealSlotId)?.slotName || "Meal"
        }
        onAddFood={handleAddFoodToMeal}
      />

      <FoodSubstitutionModal
        open={substitutionModalOpen}
        onOpenChange={setSubstitutionModalOpen}
        sourceItem={substitutionTarget?.item || null}
        onApplySubstitution={handleApplySubstitution}
      />

      <SavedPlansModal
        open={savedPlansModalOpen}
        onOpenChange={setSavedPlansModalOpen}
        savedPlans={plans}
        activePlanId={activePlan?.id || ""}
        onSelectPlan={(plan) => setActivePlan(plan)}
        onDeletePlan={handleDeletePlan}
        onSaveCurrentAsNew={handleSaveCurrentAsNew}
      />
    </div>
  );
}
