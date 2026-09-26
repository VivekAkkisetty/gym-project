"use client";

import React from "react";
import { Target, Award, Footprints, Droplets, Dumbbell, Scale } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GoalProgressTargets } from "@/types/tracking";

interface GoalProgressRingsProps {
  targets: GoalProgressTargets;
  progressPercent: {
    weightProgressPercent: number;
    proteinProgressPercent: number;
    stepProgressPercent: number;
    waterProgressPercent: number;
    workoutProgressPercent: number;
  };
  latestProtein: number;
  latestSteps: number;
  latestWaterMl: number;
  weeklyWorkouts: number;
}

export function GoalProgressRings({
  targets,
  progressPercent,
  latestProtein,
  latestSteps,
  latestWaterMl,
  weeklyWorkouts,
}: GoalProgressRingsProps) {
  const goals = [
    {
      title: "Target Weight Progress",
      current: `${targets.currentWeightKg} kg`,
      target: `${targets.targetWeightKg} kg`,
      subtext: `From ${targets.startWeightKg} kg initial`,
      percent: progressPercent.weightProgressPercent,
      icon: Scale,
      color: "text-emerald-500",
      barColor: "bg-emerald-500",
    },
    {
      title: "Daily Protein Target",
      current: `${latestProtein}g`,
      target: `${targets.dailyProteinGoalG}g`,
      subtext: `${Math.max(0, targets.dailyProteinGoalG - latestProtein)}g remaining today`,
      percent: progressPercent.proteinProgressPercent,
      icon: Award,
      color: "text-purple-500",
      barColor: "bg-purple-500",
    },
    {
      title: "Daily Steps Goal",
      current: latestSteps.toLocaleString(),
      target: targets.dailyStepGoal.toLocaleString(),
      subtext: `${Math.max(0, targets.dailyStepGoal - latestSteps).toLocaleString()} steps left`,
      percent: progressPercent.stepProgressPercent,
      icon: Footprints,
      color: "text-indigo-500",
      barColor: "bg-indigo-500",
    },
    {
      title: "Hydration Target",
      current: `${latestWaterMl} ml`,
      target: `${targets.dailyWaterGoalMl} ml`,
      subtext: `${Math.max(0, targets.dailyWaterGoalMl - latestWaterMl)} ml left`,
      percent: progressPercent.waterProgressPercent,
      icon: Droplets,
      color: "text-cyan-500",
      barColor: "bg-cyan-500",
    },
    {
      title: "Weekly Workout Target",
      current: `${weeklyWorkouts} Sessions`,
      target: `${targets.weeklyWorkoutGoal} Sessions`,
      subtext: `${Math.max(0, targets.weeklyWorkoutGoal - weeklyWorkouts)} sessions left this week`,
      percent: progressPercent.workoutProgressPercent,
      icon: Dumbbell,
      color: "text-amber-500",
      barColor: "bg-amber-500",
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base font-bold">Progress Toward Core Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {goals.map((g, i) => {
            const Icon = g.icon;
            return (
              <div key={i} className="p-3 rounded-xl border border-border/50 bg-muted/30 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground truncate max-w-[130px]">{g.title}</span>
                  <Icon className={`h-4 w-4 ${g.color}`} />
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-foreground">{g.current}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">/ {g.target}</span>
                  </div>
                  <Progress value={g.percent} className="h-2" indicatorClassName={g.barColor} />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{g.percent}%</span>
                    <span className="truncate">{g.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
