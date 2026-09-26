"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PersonalProfileInput,
  personalProfileInputSchema,
} from "@/lib/validations/nutrition";
import {
  calculateNutritionTargets,
  NutritionCalculationResult,
} from "@/lib/nutrition/calculator";

interface ProfileCalculatorCardProps {
  onApplyTargets?: (
    profile: PersonalProfileInput,
    targets: NutritionCalculationResult
  ) => void;
  className?: string;
}

export function ProfileCalculatorCard({
  onApplyTargets,
  className,
}: ProfileCalculatorCardProps) {
  const [profile, setProfile] = useState<PersonalProfileInput>({
    age: 26,
    sex: "male",
    heightCm: 180,
    weightKg: 78,
    activityLevel: "very_active",
    fitnessGoal: "fat_loss",
    dietaryType: "non_vegetarian",
    numberOfMeals: 4,
    budget: "moderate",
    foodPreferences: "",
    allergies: "",
    availableFoods: "",
  });

  const [calculation, setCalculation] = useState<NutritionCalculationResult>(() =>
    calculateNutritionTargets(profile)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PersonalProfileInput, value: unknown) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);

    const validation = personalProfileInputSchema.safeParse(updated);
    if (validation.success) {
      setErrors({});
      const result = calculateNutritionTargets(validation.data);
      setCalculation(result);
    } else {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = personalProfileInputSchema.safeParse(profile);
    if (!validation.success) {
      return;
    }
    const result = calculateNutritionTargets(validation.data);
    onApplyTargets?.(validation.data, result);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Personal Profile & Energy Engine</CardTitle>
              <CardDescription className="text-xs">
                Mifflin-St Jeor metabolic equations & goal-specific macronutrient calibrations.
              </CardDescription>
            </div>
          </div>
          <Badge variant="default" className="text-xs font-semibold">
            {calculation.calorieAdjustmentLabel.split("(")[0].trim()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleApply} className="space-y-5">
          {/* Physical Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <Label htmlFor="cAge" className="text-xs">Age (Years)</Label>
              <Input
                id="cAge"
                type="number"
                min="12"
                max="100"
                value={profile.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
              {errors.age && <p className="text-[10px] text-destructive mt-0.5">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="cSex" className="text-xs">Sex</Label>
              <select
                id="cSex"
                value={profile.sex}
                onChange={(e) => handleInputChange("sex", e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cHeight" className="text-xs">Height (cm)</Label>
              <Input
                id="cHeight"
                type="number"
                min="100"
                max="250"
                value={profile.heightCm}
                onChange={(e) => handleInputChange("heightCm", e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
              {errors.heightCm && <p className="text-[10px] text-destructive mt-0.5">{errors.heightCm}</p>}
            </div>

            <div>
              <Label htmlFor="cWeight" className="text-xs">Weight (kg)</Label>
              <Input
                id="cWeight"
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={profile.weightKg}
                onChange={(e) => handleInputChange("weightKg", e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
              {errors.weightKg && <p className="text-[10px] text-destructive mt-0.5">{errors.weightKg}</p>}
            </div>
          </div>

          {/* Activity & Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="cActivity" className="text-xs">Activity Level</Label>
              <select
                id="cActivity"
                value={profile.activityLevel}
                onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (Desk job, minimal activity)</option>
                <option value="lightly_active">Lightly Active (Training 1-3 days/wk)</option>
                <option value="moderately_active">Moderately Active (Training 3-5 days/wk)</option>
                <option value="very_active">Very Active (Heavy lifting 6-7 days/wk)</option>
                <option value="extra_active">Extra Active (Athlete / Intense 2x daily)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cGoal" className="text-xs">Fitness Goal</Label>
              <select
                id="cGoal"
                value={profile.fitnessGoal}
                onChange={(e) => handleInputChange("fitnessGoal", e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="fat_loss">Fat Loss (-450 kcal deficit, high protein)</option>
                <option value="muscle_gain">Muscle Gain (+350 kcal lean surplus)</option>
                <option value="body_recomposition">Body Recomposition (-150 kcal, MPS priority)</option>
                <option value="maintenance">Maintenance (Energy equilibrium)</option>
              </select>
            </div>
          </div>

          {/* Dietary Type, Meals & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <Label htmlFor="cDietType" className="text-xs">Dietary Preference</Label>
              <select
                id="cDietType"
                value={profile.dietaryType}
                onChange={(e) => handleInputChange("dietaryType", e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="non_vegetarian">Non-Vegetarian (Chicken, Fish, Eggs)</option>
                <option value="eggetarian">Eggetarian (Eggs, Dairy, Plant foods)</option>
                <option value="vegetarian">Vegetarian (Dairy, Paneer, Pulses)</option>
                <option value="vegan">Vegan (Strictly 100% Plant-Based)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cMeals" className="text-xs">Daily Meal Count</Label>
              <select
                id="cMeals"
                value={profile.numberOfMeals}
                onChange={(e) => handleInputChange("numberOfMeals", Number(e.target.value))}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value={2}>2 Meals (Intermittent Fasting Brunch/Dinner)</option>
                <option value={3}>3 Meals (Breakfast, Lunch, Dinner)</option>
                <option value={4}>4 Meals (Breakfast, Lunch, Snack, Dinner)</option>
                <option value={5}>5 Meals (Breakfast, Mid-Morn, Lunch, Snack, Dinner)</option>
                <option value={6}>6 Meals (Continuous Fueling / Bulking)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cBudget" className="text-xs">Budget Preference</Label>
              <select
                id="cBudget"
                value={profile.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="budget_friendly">Budget Friendly (Eggs, Dal, Soya, Rice)</option>
                <option value="moderate">Moderate (Chicken, Paneer, Oats, Curd)</option>
                <option value="premium">Premium (Salmon, Whey Isolate, Quinoa, Berries)</option>
              </select>
            </div>
          </div>

          {/* Allergies & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="cAllergies" className="text-xs">Known Allergies / Exclusions</Label>
              <Input
                id="cAllergies"
                placeholder="e.g. dairy, peanuts, gluten, shellfish"
                value={profile.allergies || ""}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="cFoods" className="text-xs">Key Available Foods (Optional)</Label>
              <Input
                id="cFoods"
                placeholder="e.g. Paneer, Roti, Chicken, Banana"
                value={profile.availableFoods || ""}
                onChange={(e) => handleInputChange("availableFoods", e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>

          {/* Live Calculated Output Strip */}
          <div className="p-4 rounded-xl bg-muted/60 border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">BMR</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{calculation.bmr} <span className="text-[10px] font-normal">kcal</span></p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">TDEE</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{calculation.tdee} <span className="text-[10px] font-normal">kcal</span></p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-lg bg-emerald-500/10 p-1 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Target Cals</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{calculation.dailyCalories}</p>
            </div>
            <div>
              <span className="text-[10px] text-emerald-500 uppercase font-semibold">Protein</span>
              <p className="text-lg font-bold text-emerald-500 mt-0.5">{calculation.proteinG}g</p>
            </div>
            <div>
              <span className="text-[10px] text-cyan-500 uppercase font-semibold">Carbs</span>
              <p className="text-lg font-bold text-cyan-500 mt-0.5">{calculation.carbsG}g</p>
            </div>
            <div>
              <span className="text-[10px] text-amber-500 uppercase font-semibold">Fats / Fibre</span>
              <p className="text-lg font-bold text-amber-500 mt-0.5">{calculation.fatG}g <span className="text-[10px] text-muted-foreground">/ {calculation.fiberG}g</span></p>
            </div>
          </div>

          {/* Scientific Disclaimer Alert */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Notice:</strong> {calculation.disclaimer}
            </p>
          </div>

          {onApplyTargets && (
            <div className="flex justify-end pt-1">
              <Button type="submit" className="gap-2 font-semibold shadow-xs">
                <Sparkles className="h-4 w-4" />
                <span>Apply Targets & Build Diet Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
