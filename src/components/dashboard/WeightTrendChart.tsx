"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeightHistoryPoint } from "@/types/fitness";
import { useMounted } from "@/hooks";


interface WeightTrendChartProps {
  data: WeightHistoryPoint[];
  unit?: string;
}

export function WeightTrendChart({
  data,
  unit = "kg",
}: WeightTrendChartProps) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center">
        <div className="h-44 w-full mx-6 bg-muted/40 rounded-xl animate-pulse" />
      </Card>
    );
  }

  const minWeight = Math.min(...data.map((d) => d.weight)) - 1;
  const maxWeight = Math.max(...data.map((d) => d.weight)) + 1;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Weight Trend</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Progression over the last 30 days
          </p>
        </div>
        <span className="text-xs font-semibold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">
          -1.8 {unit} Total
        </span>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
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
                domain={[minWeight, maxWeight]}
              />
              <Tooltip
                formatter={(val: unknown) => [`${val} ${unit}`, "Body Weight"]}
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 23, 0.95)",
                  borderColor: "rgba(39, 39, 42, 0.8)",
                  borderRadius: "0.75rem",
                  color: "#fafafa",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#weightGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
