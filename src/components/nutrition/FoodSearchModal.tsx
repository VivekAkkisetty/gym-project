"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FOOD_DATABASE,
  FOOD_CATEGORIES,
  FoodItem,
  FoodCategory,
  DietaryType,
} from "@/lib/nutrition/foods-data";
import { MealFoodItem } from "@/lib/validations/nutrition";

interface FoodSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMealSlotName?: string;
  onAddFood: (foodItem: MealFoodItem) => void;
}

export function FoodSearchModal({
  open,
  onOpenChange,
  targetMealSlotName = "Selected Meal",
  onAddFood,
}: FoodSearchModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "All">("All");
  const [selectedDiet, setSelectedDiet] = useState<DietaryType | "All">("All");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(100);

  // Filter foods
  const filteredFoods = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FOOD_DATABASE.filter((food) => {
      const matchesSearch =
        !q ||
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || food.category === selectedCategory;

      let matchesDiet = true;
      if (selectedDiet !== "All") {
        if (selectedDiet === "vegetarian") {
          matchesDiet = food.dietaryType === "vegetarian" || food.dietaryType === "vegan";
        } else if (selectedDiet === "vegan") {
          matchesDiet = food.dietaryType === "vegan";
        } else if (selectedDiet === "eggetarian") {
          matchesDiet =
            food.dietaryType === "vegetarian" ||
            food.dietaryType === "vegan" ||
            food.dietaryType === "eggetarian";
        }
      }

      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [search, selectedCategory, selectedDiet]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(food.servingSize);
  };

  const calculatedMacros = useMemo(() => {
    if (!selectedFood) return null;
    const scale = (quantity || selectedFood.servingSize) / selectedFood.servingSize;
    return {
      calories: Math.round(selectedFood.calories * scale),
      protein: Math.round(selectedFood.protein * scale * 10) / 10,
      carbs: Math.round(selectedFood.carbs * scale * 10) / 10,
      fat: Math.round(selectedFood.fat * scale * 10) / 10,
      fiber: Math.round(selectedFood.fiber * scale * 10) / 10,
    };
  }, [selectedFood, quantity]);

  const handleConfirmAdd = () => {
    if (!selectedFood || !calculatedMacros) return;

    const newItem: MealFoodItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      foodId: selectedFood.id,
      name: selectedFood.name,
      servingSize: selectedFood.servingSize,
      servingUnit: selectedFood.servingUnit,
      quantity: quantity || selectedFood.servingSize,
      calories: calculatedMacros.calories,
      protein: calculatedMacros.protein,
      carbs: calculatedMacros.carbs,
      fat: calculatedMacros.fat,
      fiber: calculatedMacros.fiber,
      substitutionGroup: selectedFood.substitutionGroup,
    };

    onAddFood(newItem);
    setSelectedFood(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-500" />
            <span>Add Food to {targetMealSlotName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Search verified whole foods and authentic Indian nutrition entries with live macro calculation.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative my-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rice, eggs, chicken, paneer, dal, oats, chana, fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>

        {/* Category & Diet Filters */}
        <div className="space-y-2 py-1">
          {/* Dietary Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Diet:</span>
            {(["All", "non_vegetarian", "eggetarian", "vegetarian", "vegan"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiet(d)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedDiet === d
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {d === "All" ? "All Diets" : d.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "All"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {FOOD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food List & Selection Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden my-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          {/* List Column */}
          <div className="overflow-y-auto max-h-[260px] space-y-1.5 pr-1">
            {filteredFoods.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No matching foods found. Try adjusting your search query or filters.
              </p>
            ) : (
              filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedFood?.id === food.id
                      ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground">{food.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {food.servingSize} {food.servingUnit} • {food.category}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {food.calories} kcal
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="text-emerald-500 font-semibold">{food.protein}g P</span>
                    <span>•</span>
                    <span className="text-cyan-500 font-semibold">{food.carbs}g C</span>
                    <span>•</span>
                    <span className="text-amber-500 font-semibold">{food.fat}g F</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Configuration & Macro Preview Column */}
          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-muted/40 border border-zinc-200 dark:border-zinc-800">
            {selectedFood && calculatedMacros ? (
              <div className="space-y-3.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-500">
                    Selected Item
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    {selectedFood.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Default base: {selectedFood.servingSize} {selectedFood.servingUnit}
                  </p>
                </div>

                {/* Serving input */}
                <div>
                  <label htmlFor="foodQtyInput" className="text-xs font-semibold text-foreground">
                    Serving Amount ({selectedFood.servingUnit})
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="foodQtyInput"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="h-9 text-xs"
                    />
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.round(selectedFood.servingSize * 0.5))}
                        className="h-9 px-2 text-[10px]"
                      >
                        0.5x
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(selectedFood.servingSize)}
                        className="h-9 px-2 text-[10px]"
                      >
                        1x
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.round(selectedFood.servingSize * 1.5))}
                        className="h-9 px-2 text-[10px]"
                      >
                        1.5x
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Live calculated macros */}
                <div className="p-3 rounded-lg bg-background border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground font-semibold">Total Energy:</span>
                    <span className="text-base font-black text-foreground">
                      {calculatedMacros.calories} kcal
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-500 font-semibold">Protein</span>
                      <p className="font-bold text-foreground">{calculatedMacros.protein}g</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-500 font-semibold">Carbs</span>
                      <p className="font-bold text-foreground">{calculatedMacros.carbs}g</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 font-semibold">Fat</span>
                      <p className="font-bold text-foreground">{calculatedMacros.fat}g</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-500 font-semibold">Fibre</span>
                      <p className="font-bold text-foreground">{calculatedMacros.fiber}g</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmAdd}
                  className="w-full gap-2 font-semibold shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to {targetMealSlotName}</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <Utensils className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs font-medium">Select a food from the left to configure portion size and review live nutrition.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
