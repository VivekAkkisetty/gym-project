"use client";

import React from "react";
import { Calendar, Dumbbell, Footprints, Droplets, Award, Flame, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeeklySummaryMetrics } from "@/types/tracking";

interface WeeklySummaryCardProps {
  metrics: WeeklySummaryMetrics;
}

export function WeeklySummaryCard({ metrics }: WeeklySummaryCardProps) {
  const isLoss = metrics.weightChangeKg < 0;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-base font-bold">Weekly Performance Summary</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {metrics.startDate} — {metrics.endDate}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Completed Workouts */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Dumbbell className="h-3.5 w-3.5 text-emerald-500" />
              <span>Workouts</span>
            </div>
            <p className="text-lg font-bold text-foreground">{metrics.completedWorkouts}</p>
            <p className="text-[10px] text-emerald-500">{metrics.workoutConsistencyPercent}% of weekly goal</p>
          </div>

          {/* Average Steps */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Footprints className="h-3.5 w-3.5 text-indigo-500" />
              <span>Avg Steps</span>
            </div>
            <p className="text-lg font-bold text-foreground">{metrics.averageSteps.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">per day</p>
          </div>

          {/* Average Water */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets className="h-3.5 w-3.5 text-cyan-500" />
              <span>Avg Hydration</span>
            </div>
            <p className="text-lg font-bold text-foreground">{metrics.averageWaterMl} ml</p>
            <p className="text-[10px] text-muted-foreground">per day</p>
          </div>

          {/* Average Protein */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-purple-500" />
              <span>Avg Protein</span>
            </div>
            <p className="text-lg font-bold text-foreground">{metrics.averageProteinG}g</p>
            <p className="text-[10px] text-muted-foreground">per day</p>
          </div>

          {/* Average Calories */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Avg Calories</span>
            </div>
            <p className="text-lg font-bold text-foreground">{metrics.averageCalories} kcal</p>
            <p className="text-[10px] text-muted-foreground">daily intake</p>
          </div>

          {/* Net Weight Change */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {isLoss ? (
                <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span>Weight Delta</span>
            </div>
            <p className={`text-lg font-bold ${isLoss ? "text-emerald-500" : "text-amber-500"}`}>
              {metrics.weightChangeKg > 0 ? "+" : ""}
              {metrics.weightChangeKg} kg
            </p>
            <p className="text-[10px] text-muted-foreground">
              {metrics.startWeightKg}kg $\to$ {metrics.endWeightKg}kg
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
