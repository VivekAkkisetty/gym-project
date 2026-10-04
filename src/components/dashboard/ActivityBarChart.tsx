"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityDayPoint } from "@/types/fitness";
import { useMounted } from "@/hooks";


interface ActivityBarChartProps {
  data: ActivityDayPoint[];
  dailyTarget?: number;
}

export function ActivityBarChart({
  data,
  dailyTarget = 2400,
}: ActivityBarChartProps) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center">
        <div className="h-44 w-full mx-6 bg-muted/40 rounded-xl animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Weekly Calorie Intake</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily caloric balance vs. 2,400 kcal target
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, "dataMax + 400"]}
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                formatter={(val: unknown) => [`${val} kcal`, "Intake"]}
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 23, 0.95)",
                  borderColor: "rgba(39, 39, 42, 0.8)",
                  borderRadius: "0.75rem",
                  color: "#fafafa",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={dailyTarget}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: "Target",
                  fill: "#10b981",
                  fontSize: 10,
                  position: "top",
                }}
              />
              <Bar
                dataKey="calories"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
