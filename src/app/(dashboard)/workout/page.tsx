"use client";

import React, { useState } from "react";
import { Dumbbell, Plus, Play, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WorkoutPage() {
  const [splitName] = useState("Push Pull Legs (Hypertrophy Focus)");

  const routines = [
    {
      day: "Today • Monday",
      name: "Push Day A: Chest, Delts & Triceps",
      exercisesCount: 5,
      estimatedMinutes: 55,
      exercises: [
        { name: "Barbell Incline Bench Press", sets: "4 sets × 8-10 reps", target: "85 kg" },
        { name: "Dumbbell Flat Bench Press", sets: "3 sets × 10-12 reps", target: "34 kg" },
        { name: "Standing Cable Lateral Raises", sets: "4 sets × 15 reps", target: "12 kg" },
        { name: "Overhead Rope Tricep Extension", sets: "3 sets × 12 reps", target: "25 kg" },
        { name: "Chest Dips (Bodyweight)", sets: "3 sets × to failure", target: "BW" },
      ],
      active: true,
    },
    {
      day: "Tuesday",
      name: "Pull Day A: Lat Width & Bicep Peak",
      exercisesCount: 6,
      estimatedMinutes: 60,
      exercises: [
        { name: "Weighted Neutral-Grip Pullups", sets: "4 sets × 6-8 reps", target: "+15 kg" },
        { name: "Chest-Supported T-Bar Row", sets: "4 sets × 10 reps", target: "65 kg" },
        { name: "Seated Cable Row (Close Grip)", sets: "3 sets × 12 reps", target: "70 kg" },
        { name: "Incline Dumbbell Curl", sets: "4 sets × 12 reps", target: "16 kg" },
      ],
      active: false,
    },
    {
      day: "Wednesday",
      name: "Legs & Core A: Quad Dominance",
      exercisesCount: 5,
      estimatedMinutes: 65,
      exercises: [
        { name: "Barbell Back Squat", sets: "4 sets × 6-8 reps", target: "120 kg" },
        { name: "Romanian Deadlift", sets: "4 sets × 10 reps", target: "110 kg" },
        { name: "Leg Press 45°", sets: "3 sets × 12 reps", target: "220 kg" },
        { name: "Standing Calf Raises", sets: "4 sets × 15 reps", target: "90 kg" },
      ],
      active: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Workout & Split Manager
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Active Split: <span className="font-semibold text-emerald-500">{splitName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" />
            <span>New Routine</span>
          </Button>
        </div>
      </div>

      {/* Routine Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {routines.map((routine, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between ${
              routine.active
                ? "border-emerald-500/60 dark:border-emerald-500/50 shadow-md shadow-emerald-950/10"
                : ""
            }`}
          >
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {routine.day}
                  </span>
                  {routine.active && (
                    <Badge variant="default" className="text-[10px]">
                      Scheduled Today
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold">{routine.name}</CardTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    {routine.exercisesCount} Exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{routine.estimatedMinutes} mins
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5">
                {routine.exercises.map((ex, eIdx) => (
                  <div
                    key={eIdx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-zinc-100 dark:border-zinc-800 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{ex.name}</p>
                      <p className="text-[11px] text-muted-foreground">{ex.sets}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {ex.target}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </div>

            <div className="p-6 pt-2">
              <Button
                variant={routine.active ? "default" : "outline"}
                className="w-full gap-2 font-semibold"
                onClick={() => toast.success(`Started session: ${routine.name}!`)}
              >
                <Play className="h-4 w-4" />
                {routine.active ? "Start Workout Session" : "Preview Routine"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
