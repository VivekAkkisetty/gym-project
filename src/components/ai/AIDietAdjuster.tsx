"use client";

import React, { useState } from "react";
import {
  UtensilsCrossed,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DietPlan } from "@/lib/validations/nutrition";
import { AIDietAdjustmentResult } from "@/types/ai";
import { saveDietPlan } from "@/lib/nutrition/storage";

interface AIDietAdjusterProps {
  activePlan: DietPlan;
  weightDelta7DaysKg?: number;
  onPlanUpdated?: (updatedPlan: DietPlan) => void;
}

export function AIDietAdjuster({
  activePlan,
  weightDelta7DaysKg = 0,
  onPlanUpdated,
}: AIDietAdjusterProps) {
  const [goal, setGoal] = useState<"fat_loss" | "muscle_gain" | "maintenance" | "body_recomposition">("fat_loss");
  const [weightDelta, setWeightDelta] = useState<number>(weightDelta7DaysKg || 0);
  const [adherence, setAdherence] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adjustment, setAdjustment] = useState<AIDietAdjustmentResult | null>(null);

  const handleCalculateAdjustment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/diet-adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCalories: activePlan.dailyCalories,
          currentProteinG: activePlan.targetProteinG,
          currentCarbsG: activePlan.targetCarbsG,
          currentFatG: activePlan.targetFatG,
          primaryGoal: goal,
          weightDelta7DaysKg: Number(weightDelta),
          adherencePercentage: Number(adherence),
        }),
      });

      if (!res.ok) throw new Error("Adjustment service error");
      const data = await res.json();
      setAdjustment(data.adjustment);
      toast.success("Diet calibration generated successfully.");
    } catch {
      toast.error("Failed to generate adjustment. Please check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToPlan = () => {
    if (!adjustment) return;

    const updated: DietPlan = {
      ...activePlan,
      dailyCalories: adjustment.suggestedCalories,
      targetProteinG: adjustment.suggestedProteinG,
      targetCarbsG: adjustment.suggestedCarbsG,
      targetFatG: adjustment.suggestedFatG,
    };

    saveDietPlan(updated);
    toast.success(`Active plan updated to ${updated.dailyCalories} kcal!`);
    if (onPlanUpdated) {
      onPlanUpdated(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Parameters Card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
              <span>Smart Diet Calibration Engine</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
              Active: {activePlan.name}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Calibrate your daily calorie and macronutrient targets based on actual weigh-in trends and adherence.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Primary Physiological Goal</Label>
              <select
                value={goal}
                onChange={(e) =>
                  setGoal(e.target.value as "fat_loss" | "muscle_gain" | "maintenance" | "body_recomposition")
                }
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="fat_loss">Fat Loss (Deficit Calibration)</option>
                <option value="muscle_gain">Muscle Gain (Hypertrophy Surplus)</option>
                <option value="maintenance">Maintenance (Energy Balance)</option>
                <option value="body_recomposition">Body Recomposition</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">7-Day Weight Change (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={weightDelta}
                onChange={(e) => setWeightDelta(parseFloat(e.target.value) || 0)}
                className="mt-1.5 h-9 text-xs"
                placeholder="e.g. -0.4"
              />
              <span className="text-[10px] text-muted-foreground">Negative = loss, Positive = gain</span>
            </div>

            <div>
              <Label className="text-xs">Estimated Adherence (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={adherence}
                onChange={(e) => setAdherence(parseInt(e.target.value) || 0)}
                className="mt-1.5 h-9 text-xs"
              />
              <span className="text-[10px] text-muted-foreground">% of meals logged within ±10% macros</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleCalculateAdjustment}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Calculate Smart Adjustment</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {adjustment && (
        <Card className="border-emerald-500/30 bg-emerald-500/[0.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Recommended Nutritional Calibration</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-400">
                {adjustment.confidenceScore}% Algorithm Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scientific Rationale */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border text-xs leading-relaxed">
              <span className="font-semibold text-foreground">Scientific Rationale: </span>
              {adjustment.rationale}
            </div>

            {/* Comparison Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Calories</div>
                <div className="text-base font-extrabold mt-1">
                  {adjustment.suggestedCalories}{" "}
                  <span className="text-xs font-normal text-muted-foreground">kcal</span>
                </div>
                <div className="text-[10px] mt-0.5 font-semibold text-emerald-500 flex items-center justify-center gap-0.5">
                  {adjustment.calorieDelta > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3" /> +{adjustment.calorieDelta} kcal
                    </>
                  ) : adjustment.calorieDelta < 0 ? (
                    <>
                      <TrendingDown className="h-3 w-3" /> {adjustment.calorieDelta} kcal
                    </>
                  ) : (
                    "Maintained"
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Protein</div>
                <div className="text-base font-extrabold mt-1 text-purple-400">
                  {adjustment.suggestedProteinG}g
                </div>
                <div className="text-[10px] mt-0.5 text-muted-foreground">Anchored for muscle</div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Carbohydrates</div>
                <div className="text-base font-extrabold mt-1 text-amber-400">
                  {adjustment.suggestedCarbsG}g
                </div>
                <div className="text-[10px] mt-0.5 text-muted-foreground">Energy & glycogen</div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Healthy Fats</div>
                <div className="text-base font-extrabold mt-1 text-cyan-400">
                  {adjustment.suggestedFatG}g
                </div>
                <div className="text-[10px] mt-0.5 text-muted-foreground">Hormonal baseline</div>
              </div>
            </div>

            {/* Medical Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px]">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{adjustment.disclaimer}</span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setAdjustment(null)}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={handleApplyToPlan}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Apply to Active Diet Plan</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
