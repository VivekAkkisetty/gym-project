"use client";

import React from "react";
import {
  FileText,
  Printer,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DietPlan } from "@/lib/validations/nutrition";
import { WorkoutSplitPlan } from "@/types/workout";
import { WeeklySummaryMetrics } from "@/types/tracking";
import {
  exportDietPlanToPdf,
  exportWorkoutPlanToPdf,
  exportWeeklyProgressReportToPdf,
} from "@/lib/ai/pdf-generator";

interface PdfExportModalProps {
  activeDietPlan: DietPlan;
  activeWorkoutSplit: WorkoutSplitPlan;
  weeklyMetrics: WeeklySummaryMetrics;
  currentWeightKg: number;
  sevenDayAvgWeight: number;
}

export function PdfExportModal({
  activeDietPlan,
  activeWorkoutSplit,
  weeklyMetrics,
  currentWeightKg,
  sevenDayAvgWeight,
}: PdfExportModalProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              <span>Professional Document & PDF Export Suite</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
              Print-Ready A4
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate clean, printer-optimized PDF documents for your nutrition schedule, gym workout cards, and weekly executive recap.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Diet Plan PDF */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <UtensilsCrossed className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {activeDietPlan.dailyCalories} kcal
                  </Badge>
                </div>
                <div className="font-bold text-xs text-foreground mt-2">{activeDietPlan.name}</div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Complete meal breakdown, gram measurements, and macronutrient schedules.
                </p>
              </div>
              <Button
                onClick={() => exportDietPlanToPdf(activeDietPlan)}
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export Diet PDF</span>
              </Button>
            </div>

            {/* 2. Workout Plan PDF */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {activeWorkoutSplit.daysPerWeek} Days/Wk
                  </Badge>
                </div>
                <div className="font-bold text-xs text-foreground mt-2">{activeWorkoutSplit.name}</div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Printable gym cards with target exercises, sets, rep ranges, and rest intervals.
                </p>
              </div>
              <Button
                onClick={() => exportWorkoutPlanToPdf(activeWorkoutSplit)}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export Workout PDF</span>
              </Button>
            </div>

            {/* 3. Weekly Progress Report PDF */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {weeklyMetrics.completedWorkouts} Sessions
                  </Badge>
                </div>
                <div className="font-bold text-xs text-foreground mt-2">7-Day Progress Recap</div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Weight delta, steps volume, hydration consistency, and habit scores.
                </p>
              </div>
              <Button
                onClick={() =>
                  exportWeeklyProgressReportToPdf(weeklyMetrics, currentWeightKg, sevenDayAvgWeight)
                }
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export Progress PDF</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
