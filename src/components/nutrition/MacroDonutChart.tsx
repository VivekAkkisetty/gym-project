"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMounted } from "@/lib/use-mounted";

interface MacroDonutChartProps {
  caloriesConsumed: number;
  calorieTarget: number;
  proteinConsumed: number;
  proteinTarget: number;
  carbsConsumed: number;
  carbsTarget: number;
  fatConsumed: number;
  fatTarget: number;
  fiberConsumed?: number;
  fiberTarget?: number;
  className?: string;
}

export function MacroDonutChart({
  caloriesConsumed,
  calorieTarget,
  proteinConsumed,
  proteinTarget,
  carbsConsumed,
  carbsTarget,
  fatConsumed,
  fatTarget,
  fiberConsumed = 0,
  fiberTarget = 35,
  className,
}: MacroDonutChartProps) {
  const mounted = useMounted();

  const data = [
    { name: "Protein", value: Math.max(1, proteinConsumed), color: "#10b981", target: proteinTarget, unit: "g" },
    { name: "Carbs", value: Math.max(1, carbsConsumed), color: "#06b6d4", target: carbsTarget, unit: "g" },
    { name: "Fat", value: Math.max(1, fatConsumed), color: "#f59e0b", target: fatTarget, unit: "g" },
  ];

  const calPercentage = Math.round((caloriesConsumed / (calorieTarget || 1)) * 100);
  const remainingCals = Math.max(0, calorieTarget - caloriesConsumed);

  if (!mounted) {
    return (
      <Card className={`flex items-center justify-center p-6 min-h-[320px] ${className || ""}`}>
        <div className="h-44 w-44 rounded-full border-4 border-dashed border-zinc-200 dark:border-zinc-800 animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Macronutrient Allocation</CardTitle>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
            {calPercentage}% of Goal
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donut Chart with Center Display */}
        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: unknown) => [`${val}g`, "Logged"]}
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 23, 0.95)",
                  borderColor: "rgba(39, 39, 42, 0.8)",
                  borderRadius: "0.75rem",
                  color: "#fafafa",
                  fontSize: "12px",
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {caloriesConsumed}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              / {calorieTarget} kcal
            </span>
            <span className="text-[10px] text-emerald-500 font-medium mt-0.5">
              {remainingCals} kcal left
            </span>
          </div>
        </div>

        {/* Granular Macro Progress Bars */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          {/* Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-500">Protein</span>
              <span className="font-mono text-muted-foreground">
                <strong>{proteinConsumed}g</strong> / {proteinTarget}g
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.round((proteinConsumed / (proteinTarget || 1)) * 100))}
              indicatorClassName="bg-emerald-500"
              className="h-1.5"
            />
          </div>

          {/* Carbs */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-cyan-500">Carbohydrates</span>
              <span className="font-mono text-muted-foreground">
                <strong>{carbsConsumed}g</strong> / {carbsTarget}g
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.round((carbsConsumed / (carbsTarget || 1)) * 100))}
              indicatorClassName="bg-cyan-500"
              className="h-1.5"
            />
          </div>

          {/* Fat */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-500">Healthy Fats</span>
              <span className="font-mono text-muted-foreground">
                <strong>{fatConsumed}g</strong> / {fatTarget}g
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.round((fatConsumed / (fatTarget || 1)) * 100))}
              indicatorClassName="bg-amber-500"
              className="h-1.5"
            />
          </div>

          {/* Fibre */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-purple-500">Dietary Fibre</span>
              <span className="font-mono text-muted-foreground">
                <strong>{fiberConsumed}g</strong> / {fiberTarget}g
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.round((fiberConsumed / (fiberTarget || 1)) * 100))}
              indicatorClassName="bg-purple-500"
              className="h-1.5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
