"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  Save,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { WorkoutSplitPlan } from "@/types/workout";
import { saveWorkoutSplitPlan } from "@/lib/workout/storage";

export function AIWorkoutGeneratorModal() {
  const [goal, setGoal] = useState<"muscle_gain" | "fat_loss" | "strength" | "general_fitness" | "beginner_fitness" | "body_recomposition">("muscle_gain");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [equipment, setEquipment] = useState<"full_gym" | "dumbbells_only" | "home_minimal" | "bodyweight">("full_gym");
  const [days, setDays] = useState<number>(4);
  const [duration, setDuration] = useState<30 | 45 | 60 | 90>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedSplit, setGeneratedSplit] = useState<WorkoutSplitPlan | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/workout-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          experience,
          equipment,
          daysAvailable: Number(days),
          durationMinutes: Number(duration),
        }),
      });

      if (!res.ok) throw new Error("Generation error");
      const data = await res.json();
      setGeneratedSplit(data.split);
      toast.success("AI Workout Program generated successfully!");
    } catch {
      toast.error("Failed to generate workout program.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToSplits = () => {
    if (!generatedSplit) return;
    saveWorkoutSplitPlan(generatedSplit);
    toast.success(`"${generatedSplit.name}" saved to your workout library!`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              <span>AI Workout Program Architect</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
              Periodized Hypertrophy
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure your training constraints to algorithmically generate an optimal split with exercise biomechanics.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Training Goal</Label>
              <select
                value={goal}
                onChange={(e) =>
                  setGoal(
                    e.target.value as
                      | "muscle_gain"
                      | "fat_loss"
                      | "strength"
                      | "general_fitness"
                      | "beginner_fitness"
                      | "body_recomposition"
                  )
                }
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                <option value="fat_loss">Fat Loss (High Metabolic Density)</option>
                <option value="strength">Strength & Power (Low Rep Heavy)</option>
                <option value="body_recomposition">Body Recomposition</option>
                <option value="beginner_fitness">Beginner Foundation</option>
                <option value="general_fitness">General Health & Longevity</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Lifter Experience</Label>
              <select
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value as "beginner" | "intermediate" | "advanced")
                }
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="beginner">Beginner (&lt; 1 Year)</option>
                <option value="intermediate">Intermediate (1–3 Years)</option>
                <option value="advanced">Advanced (3+ Years)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Equipment Access</Label>
              <select
                value={equipment}
                onChange={(e) =>
                  setEquipment(
                    e.target.value as "full_gym" | "dumbbells_only" | "home_minimal" | "bodyweight"
                  )
                }
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="full_gym">Full Commercial Gym (Barbells, Cables, Machines)</option>
                <option value="dumbbells_only">Dumbbells & Adjustable Bench</option>
                <option value="home_minimal">Home Minimal (Pull-up Bar, Bands, Kettlebell)</option>
                <option value="bodyweight">100% Calisthenics / Bodyweight</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Days Per Week</Label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="2">2 Days (Full Body Focus)</option>
                <option value="3">3 Days (Full Body / PPL Rotation)</option>
                <option value="4">4 Days (Upper / Lower Split)</option>
                <option value="5">5 Days (Bro Split / Hybrid)</option>
                <option value="6">6 Days (Push Pull Legs 2x)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Session Length</Label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) as 30 | 45 | 60 | 90)}
                className="w-full mt-1.5 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="30">30 Minutes (High Density)</option>
                <option value="45">45 Minutes (Efficient)</option>
                <option value="60">60 Minutes (Standard)</option>
                <option value="90">90 Minutes (High Volume)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate AI Program</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Program Results */}
      {generatedSplit && (
        <Card className="border-emerald-500/30 bg-card">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{generatedSplit.name}</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{generatedSplit.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs gap-1">
                  <Calendar className="h-3 w-3" />
                  {generatedSplit.daysPerWeek} Days/Wk
                </Badge>
                <Button
                  size="sm"
                  onClick={handleSaveToSplits}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Program</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedSplit.routines.map((routine) => (
                <div
                  key={routine.id}
                  className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{routine.name}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{routine.estimatedMinutes}m
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {routine.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] flex items-center justify-between py-1 border-b border-border/40 last:border-0"
                      >
                        <span className="font-medium text-foreground truncate pr-2">
                          {idx + 1}. {ex.name}
                        </span>
                        <span className="text-muted-foreground shrink-0 font-mono">
                          {ex.sets} × {ex.reps} ({ex.restTimeSeconds}s rest)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded bg-muted/50 border border-border text-[11px] text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>
                Safety note: Warm up dynamically before working sets. Maintain 1–3 Reps in Reserve (RIR) on all compound exercises.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
