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
  Bot,
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
import { SmartRecommendationsBanner } from "@/components/ai/SmartRecommendationsBanner";
import { generateSmartRecommendations } from "@/lib/ai/recommendations";
import { getStoredDailyLogs, getStoredMeasurements } from "@/lib/tracking/storage";
import { useMounted } from "@/hooks";

export default function DashboardPage() {
  const { user } = useAuth();
  const isMounted = useMounted();

  const logs = isMounted ? getStoredDailyLogs() : [];
  const measurements = isMounted ? getStoredMeasurements() : [];

  // Dynamic time-of-day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Athlete";

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLog = logs.find((l) => l.trackingDate === todayStr);


  // Today metrics — zero for new users with no log yet
  const todayCalories = todayLog?.caloriesConsumed ?? 0;
  const todayProtein = todayLog?.proteinConsumedG ?? 0;
  const todayWater = todayLog?.waterIntakeMl ?? 0;
  const todaySteps = todayLog?.stepsCount ?? 0;
  const workoutDone = todayLog?.workoutCompleted ?? false;

  // Default daily targets (will be personalised once user preferences are loaded)
  const calTarget = 2000;
  const protTarget = 150;
  const waterTarget = 3000;
  const stepTarget = 10000;

  // Build last 7 days of activity from real log entries
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyActivity: ActivityDayPoint[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const log = logs.find((l) => l.trackingDate === dateStr);
    return {
      day: dayNames[d.getDay()],
      calories: log?.caloriesConsumed ?? 0,
      target: calTarget,
      steps: log?.stepsCount ?? 0,
    };
  });

  // Build weight trend from real measurement check-ins
  const weightTrend: WeightHistoryPoint[] = measurements
    .slice(0, 10)
    .reverse()
    .map((m) => ({ date: m.recordedDate, weight: m.weightKg }));

  // Macro breakdown for today
  const macroData = [
    { name: "Protein", value: todayProtein, target: protTarget, color: "#10b981", unit: "g" },
    { name: "Carbs", value: todayLog?.carbsConsumedG ?? 0, target: 200, color: "#06b6d4", unit: "g" },
    { name: "Fats", value: todayLog?.fatConsumedG ?? 0, target: 60, color: "#f59e0b", unit: "g" },
  ];

  // Recent activity list (empty — future: pull from workout sessions)
  const recentLogs: RecentLogItem[] = [];

  const recommendations = generateSmartRecommendations(logs);

  // Progress percentages
  const calPct = Math.min(100, Math.round((todayCalories / calTarget) * 100));
  const protPct = Math.min(100, Math.round((todayProtein / protTarget) * 100));
  const waterPct = Math.min(100, Math.round((todayWater / waterTarget) * 100));
  const stepPct = Math.min(100, Math.round((todaySteps / stepTarget) * 100));


  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 p-6 border border-emerald-500/20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            {todayLog
              ? `Today you have logged ${todayCalories.toLocaleString()} kcal and ${todaySteps.toLocaleString()} steps.`
              : "Start by logging your first meal or workout for today."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/assistant">
            <Button variant="outline" className="shadow-sm font-semibold border-emerald-500/30 text-emerald-400 gap-1.5">
              <Bot className="h-4 w-4" />
              <span>Ask AI Coach</span>
            </Button>
          </Link>
          <Link href="/workout">
            <Button className="shadow-sm font-semibold">
              <Dumbbell className="mr-2 h-4 w-4" />
              {workoutDone ? "Log Another" : "Start Workout"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Proactive Smart Recommendations Banner */}
      <SmartRecommendationsBanner recommendations={recommendations} />

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Calories"
          value={todayCalories > 0 ? todayCalories.toLocaleString() : "—"}
          unit="kcal"
          target={calTarget.toLocaleString()}
          progressPercent={calPct}
          accentColor="emerald"
          icon={Flame}
          change={
            todayCalories > 0
              ? { value: `${Math.max(0, calTarget - todayCalories)} kcal`, positive: true, label: "remaining" }
              : { value: "Log first meal", positive: true, label: "" }
          }
        />
        <MetricCard
          title="Protein Intake"
          value={todayProtein > 0 ? todayProtein.toString() : "—"}
          unit="g"
          target={protTarget.toString()}
          progressPercent={protPct}
          accentColor="cyan"
          icon={Utensils}
          change={
            todayProtein > 0
              ? { value: `${protPct}%`, positive: true, label: "completed" }
              : { value: "Not logged", positive: true, label: "today" }
          }
        />
        <MetricCard
          title="Hydration"
          value={todayWater > 0 ? todayWater.toLocaleString() : "—"}
          unit="ml"
          target={waterTarget.toLocaleString()}
          progressPercent={waterPct}
          accentColor="purple"
          icon={Droplets}
          change={
            todayWater > 0
              ? { value: `${Math.max(0, waterTarget - todayWater)} ml`, positive: true, label: "remaining" }
              : { value: "Not logged", positive: true, label: "today" }
          }
        />
        <MetricCard
          title="Daily Steps"
          value={todaySteps > 0 ? todaySteps.toLocaleString() : "—"}
          target={stepTarget.toLocaleString()}
          progressPercent={stepPct}
          accentColor="amber"
          icon={Footprints}
          change={
            todaySteps > 0
              ? { value: `${Math.max(0, stepTarget - todaySteps).toLocaleString()}`, positive: true, label: "steps to goal" }
              : { value: "Not tracked", positive: true, label: "today" }
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalorieRingChart
            caloriesConsumed={todayCalories}
            calorieTarget={calTarget}
            macros={macroData}
          />
        </div>
        <div className="lg:col-span-2">
          <ActivityBarChart data={weeklyActivity} dailyTarget={calTarget} />
        </div>
      </div>

      {/* Weight progression & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {weightTrend.length >= 2 ? (
            <WeightTrendChart data={weightTrend} unit="kg" />
          ) : (
            <Card className="p-6 border-border flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
              <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-semibold text-foreground">No weight data yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Log at least 2 check-ins to see your weight trend chart.</p>
              </div>
              <Link href="/progress">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5" /> Log Weight
                </Button>
              </Link>
            </Card>
          )}
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
          {recentLogs.length > 0 ? (
            <RecentActivityTable logs={recentLogs} />
          ) : (
            <Card className="p-8 border-dashed border-border flex flex-col items-center justify-center text-center gap-3">
              <Utensils className="h-8 w-8 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-semibold text-foreground">Nothing logged yet today</p>
                <p className="text-xs text-muted-foreground mt-0.5">Track your meals, workouts, water, and steps to see your daily activity here.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/tracking">
                  <Button size="sm" variant="outline" className="text-xs gap-1.5">
                    <ArrowRight className="h-3.5 w-3.5" /> Log Today
                  </Button>
                </Link>
                <Link href="/diet">
                  <Button size="sm" className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Utensils className="h-3.5 w-3.5" /> Diet Plan
                  </Button>
                </Link>
              </div>
            </Card>
          )}
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
