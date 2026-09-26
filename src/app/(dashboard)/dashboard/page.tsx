"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Utensils,
  Dumbbell,
  Droplets,
  Footprints,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CalorieRingChart } from "@/components/dashboard/CalorieRingChart";
import { ActivityBarChart } from "@/components/dashboard/ActivityBarChart";
import { WeightTrendChart } from "@/components/dashboard/WeightTrendChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { RecentLogItem, ActivityDayPoint, WeightHistoryPoint } from "@/types/fitness";

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || "Athlete";

  // Mock data for initial foundation preview
  const weeklyActivity: ActivityDayPoint[] = [
    { day: "Mon", calories: 2350, target: 2400, steps: 10420 },
    { day: "Tue", calories: 2480, target: 2400, steps: 11200 },
    { day: "Wed", calories: 2210, target: 2400, steps: 9800 },
    { day: "Thu", calories: 2550, target: 2400, steps: 12400 },
    { day: "Fri", calories: 2380, target: 2400, steps: 10900 },
    { day: "Sat", calories: 2600, target: 2400, steps: 13500 },
    { day: "Sun", calories: 2190, target: 2400, steps: 8900 },
  ];

  const weightTrend: WeightHistoryPoint[] = [
    { date: "Day 1", weight: 81.2 },
    { date: "Day 6", weight: 80.8 },
    { date: "Day 12", weight: 80.5 },
    { date: "Day 18", weight: 80.1 },
    { date: "Day 24", weight: 79.8 },
    { date: "Day 30", weight: 79.4 },
  ];

  const macroData = [
    { name: "Protein", value: 165, target: 180, color: "#10b981", unit: "g" },
    { name: "Carbs", value: 210, target: 250, color: "#06b6d4", unit: "g" },
    { name: "Fats", value: 58, target: 65, color: "#f59e0b", unit: "g" },
  ];

  const recentLogs: RecentLogItem[] = [
    {
      id: "1",
      type: "workout",
      title: "Chest & Triceps Hypertrophy",
      subtitle: "5 exercises • 16 total sets",
      time: "07:30 AM",
      metric: "52 mins (RPE 8)",
    },
    {
      id: "2",
      type: "food",
      title: "Post-Workout Whey & Oatmeal Bowl",
      subtitle: "Whey Isolate, Rolled Oats, Banana, Peanut Butter",
      time: "08:45 AM",
      metric: "620 kcal (48g Protein)",
    },
    {
      id: "3",
      type: "water",
      title: "Hydration Flask",
      subtitle: "Electrolyte infused water",
      time: "11:15 AM",
      metric: "750 ml",
    },
    {
      id: "4",
      type: "food",
      title: "Grilled Salmon & Quinoa Bowl",
      subtitle: "Avocado, Steamed Broccoli, Olive Oil",
      time: "01:30 PM",
      metric: "740 kcal (42g Protein)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Highlights Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 p-6 border border-emerald-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {userName}! 👋
            </h2>
            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Lean Bulk Phase
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            You&apos;re currently on track for your daily targets. 340 kcal remaining today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/workout">
            <Button className="shadow-sm font-semibold">
              <Dumbbell className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Calories"
          value="2,060"
          unit="kcal"
          target="2,400"
          progressPercent={85}
          accentColor="emerald"
          icon={Flame}
          change={{ value: "+120", positive: true, label: "vs. target" }}
        />
        <MetricCard
          title="Protein Intake"
          value="165"
          unit="g"
          target="180"
          progressPercent={91}
          accentColor="cyan"
          icon={Utensils}
          change={{ value: "91%", positive: true, label: "completed" }}
        />
        <MetricCard
          title="Hydration"
          value="2,400"
          unit="ml"
          target="3,200"
          progressPercent={75}
          accentColor="purple"
          icon={Droplets}
          change={{ value: "800 ml", positive: true, label: "remaining" }}
        />
        <MetricCard
          title="Daily Steps"
          value="8,450"
          target="10,000"
          progressPercent={84}
          accentColor="amber"
          icon={Footprints}
          change={{ value: "1,550", positive: true, label: "steps to goal" }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalorieRingChart
            caloriesConsumed={2060}
            calorieTarget={2400}
            macros={macroData}
          />
        </div>
        <div className="lg:col-span-2">
          <ActivityBarChart data={weeklyActivity} dailyTarget={2400} />
        </div>
      </div>

      {/* Weight progression & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WeightTrendChart data={weightTrend} unit="kg" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Today&apos;s Logged Activity
            </h3>
            <Link
              href="/tracking"
              className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1"
            >
              View Full History
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <RecentActivityTable logs={recentLogs} />
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <Link href="/diet" className="group">
          <Card className="p-4 hover:border-emerald-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Diet Plans</p>
                <p className="text-xs text-muted-foreground">Manage macros</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/workout" className="group">
          <Card className="p-4 hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Workout Split</p>
                <p className="text-xs text-muted-foreground">PPL Routines</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/calculators" className="group">
          <Card className="p-4 hover:border-amber-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Calculators</p>
                <p className="text-xs text-muted-foreground">TDEE & 1RM</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/progress" className="group">
          <Card className="p-4 hover:border-purple-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Progress</p>
                <p className="text-xs text-muted-foreground">Body metrics</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
