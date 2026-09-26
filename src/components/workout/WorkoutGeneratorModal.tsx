"use client";

import React, { useState } from "react";
import { Sparkles, Dumbbell, Calendar, Clock, Target, Layers } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  WorkoutGoal,
  ExerciseDifficulty,
  EquipmentType,
  MuscleGroup,
} from "@/lib/validations/workout";
import { generateCustomWorkoutPlan } from "@/lib/workout/generator";
import { WorkoutSplitPlan } from "@/types/workout";

interface WorkoutGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: WorkoutSplitPlan) => void;
}

export function WorkoutGeneratorModal({
  isOpen,
  onClose,
  onPlanGenerated,
}: WorkoutGeneratorModalProps) {
  const [goal, setGoal] = useState<WorkoutGoal>("muscle_gain");
  const [experience, setExperience] = useState<ExerciseDifficulty>("intermediate");
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 6>(4);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>([
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "bodyweight",
  ]);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [sessionDuration, setSessionDuration] = useState<30 | 45 | 60 | 90>(60);

  const goalsList: { id: WorkoutGoal; label: string; desc: string }[] = [
    { id: "muscle_gain", label: "Muscle Gain (Hypertrophy)", desc: "8-12 reps, balanced volume, high mechanical tension" },
    { id: "fat_loss", label: "Fat Loss & Metabolic", desc: "12-15 reps, shorter rest intervals, elevated calorie burn" },
    { id: "strength", label: "Max Strength & Power", desc: "4-6 reps, heavy compound lifts, long neural rest" },
    { id: "body_recomposition", label: "Body Recomposition", desc: "Build muscle while dropping body fat simultaneously" },
    { id: "beginner_fitness", label: "Beginner Fitness", desc: "Movement pattern mastering with safe progression" },
    { id: "general_fitness", label: "General Health & Tone", desc: "Well-rounded full body conditioning and cardiovascular health" },
  ];

  const equipmentOptions: { id: EquipmentType; label: string }[] = [
    { id: "barbell", label: "Barbell & Plates" },
    { id: "dumbbell", label: "Dumbbells" },
    { id: "cable", label: "Cable Pulleys" },
    { id: "machine", label: "Gym Machines" },
    { id: "bodyweight", label: "Bodyweight (No Equipment)" },
    { id: "bands", label: "Resistance Bands" },
    { id: "kettlebell", label: "Kettlebells" },
  ];

  const muscleList: MuscleGroup[] = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Quads",
    "Hamstrings",
    "Glutes",
    "Calves",
    "Abs",
    "Forearms",
  ];

  const toggleEquipment = (eq: EquipmentType) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq)
        ? prev.length > 1
          ? prev.filter((item) => item !== eq)
          : prev
        : [...prev, eq]
    );
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleGenerate = () => {
    const plan = generateCustomWorkoutPlan({
      goal,
      experience,
      daysPerWeek,
      availableEquipment: selectedEquipment,
      targetMuscles: selectedMuscles.length > 0 ? selectedMuscles : undefined,
      sessionDurationMinutes: sessionDuration,
    });

    onPlanGenerated(plan);
    toast.success(`Generated ${plan.name}! Set as active split.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI / Algorithmic Engine</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Generate Personalized Workout Plan
          </DialogTitle>
          <DialogDescription>
            Tailored exercise selection, volume allocation, and rest periods matching your exact equipment and goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-3 text-xs sm:text-sm">
          {/* 1. Primary Goal */}
          <div className="space-y-2">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Target className="h-4 w-4 text-emerald-500" />
              <span>1. Select Primary Training Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalsList.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    goal === g.id
                      ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className="font-bold text-foreground text-xs sm:text-sm">{g.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Experience & Days Per Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-500" />
                <span>2. Experience Level</span>
              </label>
              <div className="flex gap-2">
                {(["beginner", "intermediate", "advanced"] as ExerciseDifficulty[]).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperience(exp)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                      experience === exp
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>3. Days Per Week</span>
              </label>
              <div className="flex gap-2">
                {([3, 4, 5, 6] as (3 | 4 | 5 | 6)[]).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysPerWeek(days)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                      daysPerWeek === days
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Equipment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-emerald-500" />
                <span>4. Available Equipment</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedEquipment(["bodyweight"])
                }
                className="text-[11px] text-emerald-500 hover:underline font-medium"
              >
                Home Only (Bodyweight)
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {equipmentOptions.map((eq) => {
                const isSelected = selectedEquipment.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {eq.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Session Duration & Priority Muscles */}
          <div className="space-y-2">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>5. Session Duration</span>
            </label>
            <div className="flex gap-2">
              {([30, 45, 60, 90] as (30 | 45 | 60 | 90)[]).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSessionDuration(dur)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    sessionDuration === dur
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dur} Mins
                </button>
              ))}
            </div>
          </div>

          {/* Optional Priority Muscles */}
          <div className="space-y-2">
            <label className="font-semibold text-foreground">
              Priority Target Muscles (Optional - Leave empty for balanced routine)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {muscleList.map((m) => {
                const isSelected = selectedMuscles.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMuscle(m)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500 font-semibold"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Action Button */}
          <Button
            className="w-full py-6 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md"
            onClick={handleGenerate}
          >
            <Sparkles className="h-5 w-5" />
            <span>Generate Scientific Workout Plan</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
