"use client";

import React, { useState } from "react";
import { Flame, Dumbbell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateBmr, calculateEpley1RM } from "@/lib/calculations";

export default function CalculatorsPage() {
  // TDEE State
  const [tdeeWeight, setTdeeWeight] = useState("80");
  const [tdeeHeight, setTdeeHeight] = useState("180");
  const [tdeeAge, setTdeeAge] = useState("26");
  const [tdeeGender, setTdeeGender] = useState<"male" | "female">("male");
  const [tdeeActivity, setTdeeActivity] = useState("1.55");
  const [calculatedTdee, setCalculatedTdee] = useState<number | null>(2720);
  const [calculatedBmr, setCalculatedBmr] = useState<number | null>(1755);

  // 1RM State
  const [liftWeight, setLiftWeight] = useState("100");
  const [liftReps, setLiftReps] = useState("5");
  const [calculatedOneRm, setCalculatedOneRm] = useState<number | null>(116.7);

  const calculateTdee = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(tdeeWeight);
    const h = parseFloat(tdeeHeight);
    const a = parseFloat(tdeeAge);
    const mult = parseFloat(tdeeActivity);

    const bmr = calculateBmr({
      weightKg: w,
      heightCm: h,
      age: a,
      sex: tdeeGender,
    });

    const tdee = Math.round(bmr * mult);
    setCalculatedBmr(bmr);
    setCalculatedTdee(tdee);
  };

  const calculateOneRm = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(liftWeight);
    const r = parseFloat(liftReps);
    setCalculatedOneRm(calculateEpley1RM(w, r));
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Athletic & Biometric Calculators
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Science-backed formulas for energy expenditure and maximal strength estimation.
        </p>
      </div>

      <Tabs defaultValue="tdee" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-sm">
          <TabsTrigger value="tdee" className="gap-2">
            <Flame className="h-4 w-4" />
            <span>TDEE / Calories</span>
          </TabsTrigger>
          <TabsTrigger value="onerm" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            <span>1-Rep Max (1RM)</span>
          </TabsTrigger>
        </TabsList>

        {/* TDEE Calculator Tab */}
        <TabsContent value="tdee" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Daily Energy Expenditure (TDEE)</CardTitle>
              <CardDescription>
                Calculated using the Mifflin-St Jeor equation, the gold standard for metabolic rate estimation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateTdee} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tWeight">Body Weight (kg)</Label>
                    <Input
                      id="tWeight"
                      type="number"
                      step="0.1"
                      value={tdeeWeight}
                      onChange={(e) => setTdeeWeight(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tHeight">Height (cm)</Label>
                    <Input
                      id="tHeight"
                      type="number"
                      value={tdeeHeight}
                      onChange={(e) => setTdeeHeight(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tAge">Age (Years)</Label>
                    <Input
                      id="tAge"
                      type="number"
                      value={tdeeAge}
                      onChange={(e) => setTdeeAge(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tGender">Gender</Label>
                    <select
                      id="tGender"
                      value={tdeeGender}
                      onChange={(e) => setTdeeGender(e.target.value as "male" | "female")}
                      className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="male">Male (+5 kcal constant)</option>
                      <option value="female">Female (-161 kcal constant)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tActivity">Activity Multiplier</Label>
                  <select
                    id="tActivity"
                    value={tdeeActivity}
                    onChange={(e) => setTdeeActivity(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="1.2">Sedentary (Little or no exercise)</option>
                    <option value="1.375">Light (Exercise 1-3 days/week)</option>
                    <option value="1.55">Moderate (Exercise 3-5 days/week)</option>
                    <option value="1.725">Heavy (Heavy lifting 6-7 days/week)</option>
                    <option value="1.9">Athlete (2x daily intense training)</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Compute Energy Expenditure
                </Button>
              </form>

              {calculatedTdee && calculatedBmr && (
                <div className="mt-6 p-4 rounded-xl bg-muted/60 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-xs text-muted-foreground">Basal Metabolic Rate</span>
                    <p className="text-xl font-bold text-foreground mt-0.5">{calculatedBmr} kcal</p>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-500 font-semibold">Maintenance (TDEE)</span>
                    <p className="text-2xl font-black text-emerald-500 mt-0.5">{calculatedTdee} kcal</p>
                  </div>
                  <div>
                    <span className="text-xs text-cyan-500 font-semibold">Lean Bulk Target (+300)</span>
                    <p className="text-xl font-bold text-cyan-500 mt-0.5">{calculatedTdee + 300} kcal</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 1RM Calculator Tab */}
        <TabsContent value="onerm" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>1-Repetition Maximum (1RM) Estimator</CardTitle>
              <CardDescription>
                Accurately evaluate your maximal theoretical lift without risking injury from testing true 1RMs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateOneRm} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lWeight">Weight Lifted (kg)</Label>
                    <Input
                      id="lWeight"
                      type="number"
                      step="0.5"
                      value={liftWeight}
                      onChange={(e) => setLiftWeight(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lReps">Repetitions Completed</Label>
                    <Input
                      id="lReps"
                      type="number"
                      min="1"
                      max="15"
                      value={liftReps}
                      onChange={(e) => setLiftReps(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Estimate 1RM Benchmark
                </Button>
              </form>

              {calculatedOneRm && (
                <div className="mt-6 p-4 rounded-xl bg-muted/60 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-xs text-muted-foreground">Estimated 1-Repetition Maximum</span>
                  <p className="text-3xl font-black text-emerald-500 mt-1">{calculatedOneRm} kg</p>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-muted-foreground">90% (3 Reps)</span>
                      <p className="font-bold text-foreground">{(calculatedOneRm * 0.9).toFixed(1)} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">85% (5 Reps)</span>
                      <p className="font-bold text-foreground">{(calculatedOneRm * 0.85).toFixed(1)} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">80% (8 Reps)</span>
                      <p className="font-bold text-foreground">{(calculatedOneRm * 0.8).toFixed(1)} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">70% (12 Reps)</span>
                      <p className="font-bold text-foreground">{(calculatedOneRm * 0.7).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
