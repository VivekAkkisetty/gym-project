"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  Sparkles,
  Scale,
  ChefHat,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIFoodSubstitution } from "@/types/ai";

const POPULAR_FOODS = [
  "Chicken Breast",
  "Basmati White Rice",
  "Atlantic Salmon",
  "Greek Yogurt",
  "Rolled Oats",
  "Whey Protein Isolate",
  "Whole Eggs",
  "Peanut Butter",
];

export function FoodSubstitutionCard() {
  const [foodQuery, setFoodQuery] = useState("Chicken Breast");
  const [quantity, setQuantity] = useState<number>(150);
  const [unit, setUnit] = useState<string>("g");
  const [preference, setPreference] = useState<"any" | "vegan" | "vegetarian" | "low_carb" | "high_protein" | "budget_friendly">("any");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [substitution, setSubstitution] = useState<AIFoodSubstitution | null>(null);

  const handleSearchSubstitution = async (overrideFood?: string) => {
    const targetFood = overrideFood || foodQuery;
    if (!targetFood) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: targetFood,
          servingQuantity: Number(quantity),
          servingUnit: unit,
          targetPreference: preference,
        }),
      });

      if (!res.ok) throw new Error("Substitution query failed");
      const data = await res.json();
      setSubstitution(data.substitution);
    } catch {
      toast.error("Could not find suitable macro substitution.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-emerald-500" />
              <span>Smart Macro-Equivalent Food Swaps</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
              Isocaloric & Isomacro
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Swap ingredients in your diet plan without disrupting your daily calories or protein intake.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Label className="text-xs">Original Food Item</Label>
              <Input
                value={foodQuery}
                onChange={(e) => setFoodQuery(e.target.value)}
                placeholder="e.g. Chicken Breast, Rice, Salmon"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Quantity & Unit</Label>
              <div className="flex gap-1.5 mt-1">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs w-20"
                />
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="g"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Dietary Filter</Label>
              <select
                value={preference}
                onChange={(e) =>
                  setPreference(
                    e.target.value as "any" | "vegan" | "vegetarian" | "low_carb" | "high_protein" | "budget_friendly"
                  )
                }
                className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="any">Any Suitable Match</option>
                <option value="vegan">Vegan Only</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="low_carb">Low-Carb Alternative</option>
                <option value="high_protein">High-Protein Focus</option>
              </select>
            </div>
          </div>

          {/* Quick-Pick Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-muted-foreground font-semibold">Quick Swaps:</span>
            {POPULAR_FOODS.map((food, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setFoodQuery(food);
                  handleSearchSubstitution(food);
                }}
                className="text-[10px] bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-full border border-border transition-colors"
              >
                {food}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => handleSearchSubstitution()}
              disabled={isLoading || !foodQuery.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Find Nutritional Match</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results Card */}
      {substitution && (
        <Card className="border-emerald-500/30 bg-card overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border bg-emerald-500/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-bold">Nutritional Equivalence Breakdown</CardTitle>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs font-semibold">
              {substitution.macroMatchScore}% Macro Precision
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Item */}
              <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Original Ingredient</span>
                  <Badge variant="outline" className="text-[10px]">Reference</Badge>
                </div>
                <div className="text-sm font-bold text-foreground">{substitution.originalFood.name}</div>
                <div className="text-xs text-muted-foreground">
                  Serving: {substitution.originalFood.servingSize} {substitution.originalFood.servingUnit}
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-border/40 text-center">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Calories</div>
                    <div className="text-xs font-bold">{substitution.originalFood.calories}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400">Protein</div>
                    <div className="text-xs font-bold">{substitution.originalFood.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400">Carbs</div>
                    <div className="text-xs font-bold">{substitution.originalFood.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400">Fat</div>
                    <div className="text-xs font-bold">{substitution.originalFood.fat}g</div>
                  </div>
                </div>
              </div>

              {/* Substitute Item */}
              <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.03] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase">Recommended Swap</span>
                  <div className="flex gap-1">
                    {substitution.dietaryFit.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-400">{substitution.substituteFood.name}</div>
                <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span>Use: {substitution.recommendedQuantity} {substitution.substituteFood.servingUnit}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-emerald-500/20 text-center">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Calories</div>
                    <div className="text-xs font-bold">{substitution.substituteFood.calories}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400">Protein</div>
                    <div className="text-xs font-bold">{substitution.substituteFood.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400">Carbs</div>
                    <div className="text-xs font-bold">{substitution.substituteFood.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400">Fat</div>
                    <div className="text-xs font-bold">{substitution.substituteFood.fat}g</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Culinary Tip */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs flex items-start gap-2.5">
              <ChefHat className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Chef & Satiety Note: </span>
                <span className="text-muted-foreground">{substitution.culinaryTip}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
