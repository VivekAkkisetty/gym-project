"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMounted } from "@/hooks";


interface MacroData {
  name: string;
  value: number;
  color: string;
  target: number;
  unit: string;
}

interface CalorieRingChartProps {
  caloriesConsumed: number;
  calorieTarget: number;
  macros: MacroData[];
}

export function CalorieRingChart({
  caloriesConsumed,
  calorieTarget,
  macros,
}: CalorieRingChartProps) {
  const mounted = useMounted();
  const percentage = Math.round((caloriesConsumed / calorieTarget) * 100);

  if (!mounted) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-6 min-h-[300px]">
        <div className="h-44 w-44 rounded-full border-4 border-dashed border-zinc-200 dark:border-zinc-800 animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Macro & Calorie Balance</CardTitle>
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            {percentage}% Goal
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center justify-center p-4">
        {/* Relative donut container */}
        <div className="relative h-48 w-full max-w-[200px]">
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
                data={macros}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={80}
                paddingAngle={4}
                stroke="none"
              >
                {macros.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {caloriesConsumed}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase">
              / {calorieTarget} kcal
            </span>
          </div>
        </div>

        {/* Legend / Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {macros.map((item) => (
            <div key={item.name} className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-foreground">
                {item.value}g
              </span>
              <span className="text-[10px] text-muted-foreground">
                / {item.target}g
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
