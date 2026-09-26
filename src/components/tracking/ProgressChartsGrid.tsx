"use client";

import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Scale, Ruler, Flame, Award, Footprints, Dumbbell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProgressChartsGridProps {
  weightData: { date: string; weight: number; rollingAvg: number }[];
  circumferenceData: { date: string; waist: number | null; chest: number | null; arms: number | null; neck: number | null }[];
  caloriesData: { date: string; calories: number; target: number; burned: number }[];
  proteinData: { date: string; protein: number; target: number }[];
  stepsData: { date: string; steps: number; goal: number }[];
  workoutData: { date: string; dayName: string; completed: boolean; value: number }[];
}

export function ProgressChartsGrid({
  weightData,
  circumferenceData,
  caloriesData,
  proteinData,
  stepsData,
  workoutData,
}: ProgressChartsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. WEIGHT TREND CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-500" />
              <span>Body Weight Trend</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">kg (30 Days)</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(val: any) => [typeof val === "number" ? `${val} kg` : val, ""]}
                />
                <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" name="Recorded" />
                <Line type="monotone" dataKey="rollingAvg" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={false} name="3-Pt Average" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. WAIST & CIRCUMFERENCES CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Ruler className="h-4 w-4 text-cyan-500" />
              <span>Waist & Body Circumferences</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">cm</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={circumferenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(val: any) => [typeof val === "number" ? `${val} cm` : val, ""]}
                />
                <Line type="monotone" dataKey="waist" stroke="#06b6d4" strokeWidth={2} name="Waist" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="chest" stroke="#f59e0b" strokeWidth={1.5} name="Chest" dot={false} />
                <Line type="monotone" dataKey="arms" stroke="#a855f7" strokeWidth={1.5} name="Arms" dot={false} />
                <Line type="monotone" dataKey="neck" stroke="#64748b" strokeWidth={1.5} name="Neck" dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. CALORIES INTAKE VS TARGET CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Caloric Adherence</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">kcal (14 Days)</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(val: any) => [typeof val === "number" ? `${val} kcal` : val, ""]}
                />
                <ReferenceLine y={2400} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Target", fill: "#ef4444", fontSize: 9, position: "top" }} />
                <Bar dataKey="calories" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Consumed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. PROTEIN INTAKE VS TARGET CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>Protein Target Consistency</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">grams</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={proteinData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <YAxis domain={[100, 200]} tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(val: any) => [typeof val === "number" ? `${val}g` : val, ""]}
                />
                <ReferenceLine y={160} stroke="#10b981" strokeDasharray="3 3" label={{ value: "160g Goal", fill: "#10b981", fontSize: 9, position: "top" }} />
                <Area type="monotone" dataKey="protein" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#proteinGrad)" name="Protein" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 5. STEPS VS 10K GOAL CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Footprints className="h-4 w-4 text-indigo-500" />
              <span>Daily Step Volume</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">Steps</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(val: any) => [typeof val === "number" ? val.toLocaleString() : val, "Steps"]}
                />
                <ReferenceLine y={10000} stroke="#6366f1" strokeDasharray="3 3" label={{ value: "10k Goal", fill: "#6366f1", fontSize: 9, position: "top" }} />
                <Bar dataKey="steps" fill="#6366f1" radius={[4, 4, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 6. WORKOUT CONSISTENCY CHART */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              <span>Workout Completion Flow</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">14 Days</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full flex flex-col justify-between py-2">
            <div className="grid grid-cols-7 gap-2">
              {workoutData.map((d, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    d.completed
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500 font-bold shadow-xs"
                      : "bg-muted/30 border-border text-muted-foreground"
                  }`}
                >
                  <span className="text-[10px] font-semibold">{d.dayName}</span>
                  <span className="text-xs font-mono mt-0.5">{d.date}</span>
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full ${
                      d.completed ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Workout Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                <span>Rest Day</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
