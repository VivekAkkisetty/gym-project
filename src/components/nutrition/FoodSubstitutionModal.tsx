"use client";

import React, { useMemo } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealFoodItem } from "@/lib/validations/nutrition";
import { findSubstitutions, SubstitutionCandidate } from "@/lib/nutrition/substitutions";
import { DietaryType } from "@/lib/nutrition/foods-data";

interface FoodSubstitutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceItem: MealFoodItem | null;
  userDietaryType?: DietaryType;
  onApplySubstitution: (originalItem: MealFoodItem, candidate: SubstitutionCandidate) => void;
}

export function FoodSubstitutionModal({
  open,
  onOpenChange,
  sourceItem,
  userDietaryType = "non_vegetarian",
  onApplySubstitution,
}: FoodSubstitutionModalProps) {
  const substitutions = useMemo(() => {
    if (!sourceItem) return [];
    return findSubstitutions(sourceItem, userDietaryType);
  }, [sourceItem, userDietaryType]);

  if (!sourceItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-cyan-500" />
            <span>Food Substitution Engine</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Replace unavailable ingredients with macro-calibrated alternatives that preserve your targets.
          </DialogDescription>
        </DialogHeader>

        {/* Current Food Highlight */}
        <div className="p-3.5 rounded-xl bg-muted/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5 my-2">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Current Food to Replace
          </span>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-foreground">{sourceItem.name}</p>
              <p className="text-xs text-muted-foreground">
                Quantity: {sourceItem.quantity} {sourceItem.servingUnit}
              </p>
            </div>
            <div className="text-right">
              <span className="font-bold text-sm text-foreground">{sourceItem.calories} kcal</span>
              <p className="text-xs font-semibold text-emerald-500">{sourceItem.protein}g Protein</p>
            </div>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1 my-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-foreground">
              Suggested Alternatives ({substitutions.length} found)
            </span>
            <span className="text-[11px] text-muted-foreground">
              Serving sizes auto-scaled to match macros
            </span>
          </div>

          {substitutions.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No matching alternatives found for this specific food category.
            </div>
          ) : (
            substitutions.map((sub, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card hover:border-cyan-500/50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-foreground">
                        {sub.replacementFood.name}
                      </p>
                      <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20">
                        {sub.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{sub.reason}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      onApplySubstitution(sourceItem, sub);
                      onOpenChange(false);
                    }}
                    className="gap-1 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Swap Item</span>
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Suggested Qty</span>
                    <p className="font-bold text-foreground">
                      {sub.suggestedQuantity} {sub.suggestedUnit}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Calories</span>
                    <p className="font-bold text-foreground">
                      {sub.newCalories} kcal{" "}
                      <span className={`text-[10px] ${sub.calorieDifference <= 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        ({sub.calorieDifference > 0 ? `+${sub.calorieDifference}` : sub.calorieDifference})
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 font-semibold">Protein</span>
                    <p className="font-bold text-foreground">
                      {sub.newProtein}g{" "}
                      <span className="text-[10px] text-muted-foreground">
                        ({sub.proteinDifference > 0 ? `+${sub.proteinDifference}` : sub.proteinDifference}g)
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-500 font-semibold">Carbs / Fat</span>
                    <p className="font-bold text-foreground text-[11px]">
                      {sub.newCarbs}g / {sub.newFat}g
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
