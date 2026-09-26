"use client";

import React from "react";
import { Plus, Trash2, ArrowLeftRight, Clock, Utensils } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealSlot, MealFoodItem } from "@/lib/validations/nutrition";

interface MealCardProps {
  meal: MealSlot;
  onAddFood: (mealId: string) => void;
  onRemoveFood: (mealId: string, itemId: string) => void;
  onSubstituteFood: (mealId: string, item: MealFoodItem) => void;
  className?: string;
}

export function MealCard({
  meal,
  onAddFood,
  onRemoveFood,
  onSubstituteFood,
  className,
}: MealCardProps) {
  // Calculate totals for this meal slot
  const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = Math.round(meal.items.reduce((sum, item) => sum + item.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(meal.items.reduce((sum, item) => sum + item.carbs, 0) * 10) / 10;
  const totalFat = Math.round(meal.items.reduce((sum, item) => sum + item.fat, 0) * 10) / 10;
  const totalFiber = Math.round(meal.items.reduce((sum, item) => sum + item.fiber, 0) * 10) / 10;

  return (
    <Card className={`overflow-hidden transition-all ${className || ""}`}>
      {/* Meal Header */}
      <CardHeader className="p-4 pb-3 bg-muted/30 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-foreground">
                {meal.slotName}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3" />
              <span>{meal.time}</span>
              <span>•</span>
              <span>{meal.items.length} items logged</span>
            </div>
          </div>

          {/* Macro Totals for this meal */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs font-bold bg-background">
              {totalCalories} kcal
            </Badge>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-500">{totalProtein}g P</span>
              <span className="text-cyan-500">{totalCarbs}g C</span>
              <span className="text-amber-500">{totalFat}g F</span>
              {totalFiber > 0 && <span className="text-purple-500">{totalFiber}g Fib</span>}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddFood(meal.id)}
              className="h-8 gap-1 text-xs font-semibold ml-2 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Food</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Items List */}
      <CardContent className="p-4 space-y-2">
        {meal.items.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl p-4">
            <Utensils className="h-6 w-6 mx-auto mb-1.5 opacity-40 text-muted-foreground" />
            <p>No food items added to this meal slot yet.</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddFood(meal.id)}
              className="text-xs text-emerald-500 hover:text-emerald-600 mt-1"
            >
              + Browse food database
            </Button>
          </div>
        ) : (
          meal.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background/50 hover:bg-muted/30 transition-colors gap-2 text-xs"
            >
              {/* Left Item Description */}
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm leading-tight">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-muted-foreground text-[11px]">
                  <span>
                    Portion: <strong>{item.quantity}</strong> {item.servingUnit}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-500">{item.protein}g Protein</span>
                  <span>•</span>
                  <span className="text-cyan-500">{item.carbs}g Carbs</span>
                  <span>•</span>
                  <span className="text-amber-500">{item.fat}g Fat</span>
                  {item.fiber > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-purple-500">{item.fiber}g Fibre</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant="outline" className="font-mono text-xs">
                  {item.calories} kcal
                </Badge>

                {/* Substitute Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  title="Find macro-matched food alternatives"
                  onClick={() => onSubstituteFood(meal.id, item)}
                  className="h-7 px-2 text-[11px] gap-1 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  <span>Substitute</span>
                </Button>

                {/* Delete Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  title="Remove food"
                  onClick={() => onRemoveFood(meal.id, item.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
