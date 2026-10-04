"use client";

import React from "react";
import { Scale, TrendingDown, TrendingUp, Flame, Dumbbell, Droplets, Footprints, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressOverviewCardsProps {
  currentWeight: number;
  totalChangeKg: number;
  sevenDayAverage: number;
  sevenDayChangeKg: number;
  latestCalories: number;
  targetCalories: number;
  latestProtein: number;
  targetProtein: number;
  latestWaterMl: number;
  targetWaterMl: number;
  latestSteps: number;
  targetSteps: number;
  workoutConsistencyPercent: number;
}

export function ProgressOverviewCards({
  currentWeight,
  totalChangeKg,
  sevenDayAverage,
  sevenDayChangeKg,
  latestCalories,
  targetCalories,
  latestProtein,
  targetProtein,
  latestWaterMl,
  targetWaterMl,
  latestSteps,
  targetSteps,
  workoutConsistencyPercent,
}: ProgressOverviewCardsProps) {
  const isLosingWeight = totalChangeKg < 0;

  const cards = [
    {
      label: "Current Weight",
      value: `${currentWeight} kg`,
      subtext: `7-Day Avg: ${sevenDayAverage} kg`,
      badge: `${totalChangeKg > 0 ? "+" : ""}${totalChangeKg} kg overall`,
      badgeVariant: isLosingWeight ? "emerald" : "amber",
      icon: Scale,
      trendIcon: isLosingWeight ? TrendingDown : TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "7-Day Weight Delta",
      value: `${sevenDayChangeKg > 0 ? "+" : ""}${sevenDayChangeKg} kg`,
      subtext: "vs. 7 days ago",
      badge: sevenDayChangeKg <= 0 ? "On Track" : "Surplus",
      badgeVariant: sevenDayChangeKg <= 0 ? "emerald" : "outline",
      icon: isLosingWeight ? TrendingDown : TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Calories Today",
      value: `${latestCalories}`,
      subtext: `Target: ${targetCalories} kcal`,
      badge: `${Math.round((latestCalories / targetCalories) * 100)}%`,
      badgeVariant: "outline",
      icon: Flame,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Protein Today",
      value: `${latestProtein}g`,
      subtext: `Target: ${targetProtein}g`,
      badge: latestProtein >= targetProtein ? "Hit" : `${targetProtein - latestProtein}g left`,
      badgeVariant: latestProtein >= targetProtein ? "emerald" : "outline",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Daily Hydration",
      value: `${latestWaterMl} ml`,
      subtext: `Target: ${targetWaterMl} ml`,
      badge: `${Math.round((latestWaterMl / targetWaterMl) * 100)}%`,
      badgeVariant: "outline",
      icon: Droplets,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Daily Steps",
      value: `${latestSteps.toLocaleString()}`,
      subtext: `Goal: ${targetSteps.toLocaleString()}`,
      badge: `${Math.round((latestSteps / targetSteps) * 100)}%`,
      badgeVariant: latestSteps >= targetSteps ? "emerald" : "outline",
      icon: Footprints,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Workout Consistency",
      value: `${workoutConsistencyPercent}%`,
      subtext: "Weekly target adherence",
      badge: workoutConsistencyPercent >= 75 ? "Consistent" : "Build Momentum",
      badgeVariant: workoutConsistencyPercent >= 75 ? "emerald" : "amber",
      icon: Dumbbell,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="border-border">
            <CardContent className="p-3.5 flex flex-col justify-between h-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground truncate">{c.label}</span>
                <div className={`p-1.5 rounded-lg ${c.bgColor} ${c.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div>
                <p className="text-xl font-bold tracking-tight text-foreground" suppressHydrationWarning>{c.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate" suppressHydrationWarning>{c.subtext}</p>
              </div>

              <div className="pt-1">
                <Badge
                  variant={c.badgeVariant === "emerald" ? "default" : c.badgeVariant === "amber" ? "amber" : "outline"}
                  className={`text-[9px] px-1.5 py-0 h-4 font-mono ${
                    c.badgeVariant === "emerald" ? "bg-emerald-600 text-white" : ""
                  }`}
                >
                  {c.badge}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
