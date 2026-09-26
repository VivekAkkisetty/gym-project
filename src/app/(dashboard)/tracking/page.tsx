"use client";

import React, { useState } from "react";
import {
  Calendar,
  Droplets,
  Footprints,
  Flame,
  Award,
  Moon,
  Dumbbell,
  CheckCircle,
  Save,
  Smile,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getStoredDailyLogs, saveDailyLog } from "@/lib/tracking/storage";
import { DailyTrackingLog, TrackingMood } from "@/types/tracking";

export default function TrackingPage() {
  const [logs, setLogs] = useState<DailyTrackingLog[]>(() => getStoredDailyLogs());
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Find existing log for selected date or default
  const existingForDate = logs.find((l) => l.trackingDate === selectedDate);

  const [steps, setSteps] = useState(existingForDate ? existingForDate.stepsCount.toString() : "8500");
  const [waterMl, setWaterMl] = useState(existingForDate ? existingForDate.waterIntakeMl : 2500);
  const [calories, setCalories] = useState(existingForDate ? existingForDate.caloriesConsumed.toString() : "2350");
  const [caloriesBurned, setCaloriesBurned] = useState(existingForDate ? existingForDate.caloriesBurned.toString() : "400");
  const [protein, setProtein] = useState(existingForDate ? existingForDate.proteinConsumedG.toString() : "165");
  const [sleepHours, setSleepHours] = useState(existingForDate ? existingForDate.sleepHours.toString() : "7.5");
  const [workoutCompleted, setWorkoutCompleted] = useState(existingForDate ? existingForDate.workoutCompleted : true);
  const [mood, setMood] = useState<TrackingMood>(existingForDate ? existingForDate.mood : "great");

  // Sync state when date changes
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const log = logs.find((l) => l.trackingDate === newDate);
    if (log) {
      setSteps(log.stepsCount.toString());
      setWaterMl(log.waterIntakeMl);
      setCalories(log.caloriesConsumed.toString());
      setCaloriesBurned(log.caloriesBurned.toString());
      setProtein(log.proteinConsumedG.toString());
      setSleepHours(log.sleepHours.toString());
      setWorkoutCompleted(log.workoutCompleted);
      setMood(log.mood);
    }
  };

  const addWater = (amount: number) => {
    const updated = waterMl + amount;
    setWaterMl(updated);
    toast.success(`Logged +${amount} ml. Daily hydration: ${updated} ml`);
  };

  const addSteps = (amount: number) => {
    const current = parseInt(steps) || 0;
    const updated = current + amount;
    setSteps(updated.toString());
    toast.success(`Added +${amount} steps. Total: ${updated.toLocaleString()}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: DailyTrackingLog = {
      id: existingForDate?.id || `log-${Date.now()}`,
      trackingDate: selectedDate,
      stepsCount: Math.max(0, parseInt(steps) || 0),
      waterIntakeMl: Math.max(0, waterMl),
      caloriesConsumed: Math.max(0, parseInt(calories) || 0),
      caloriesBurned: Math.max(0, parseInt(caloriesBurned) || 0),
      proteinConsumedG: Math.max(0, parseInt(protein) || 0),
      carbsConsumedG: 220,
      fatConsumedG: 60,
      sleepHours: Math.max(0, parseFloat(sleepHours) || 0),
      workoutCompleted,
      mood,
    };

    saveDailyLog(payload);
    const updatedLogs = getStoredDailyLogs();
    setLogs(updatedLogs);
    toast.success(`Daily metrics saved for ${selectedDate}!`);
  };

  const waterTarget = 3200;
  const stepTarget = 10000;
  const waterPercent = Math.min(100, Math.round((waterMl / waterTarget) * 100));
  const stepPercent = Math.min(100, Math.round(((parseInt(steps) || 0) / stepTarget) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Daily Habit & Biometric Tracking
            </h1>
            <Badge variant="outline" className="text-xs font-mono border-emerald-500/50 text-emerald-500">
              LOGGING
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Record daily movement, hydration, nutrition, sleep recovery, and workout status.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-40 text-xs font-mono bg-card"
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. HYDRATION TRACKER */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <span>Hydration Tracking</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs text-cyan-500 border-cyan-500/30">
                  {waterPercent}% of target
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-foreground">{waterMl}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ {waterTarget} ml</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.max(0, waterTarget - waterMl)} ml left
                </span>
              </div>

              <Progress value={waterPercent} className="h-2" indicatorClassName="bg-cyan-500" />

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[250, 500, 750, 1000].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addWater(amt)}
                    className="text-xs font-semibold hover:bg-cyan-500/10 hover:border-cyan-500/30"
                  >
                    +{amt}ml
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. STEPS & ACTIVITY TRACKER */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Footprints className="h-5 w-5 text-indigo-500" />
                  <span>Daily Steps Activity</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs text-indigo-500 border-indigo-500/30">
                  {stepPercent}% of 10k
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-foreground">
                    {(parseInt(steps) || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ {stepTarget.toLocaleString()} steps</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-28 text-right font-bold text-sm bg-card"
                />
              </div>

              <Progress value={stepPercent} className="h-2" indicatorClassName="bg-indigo-500" />

              <div className="grid grid-cols-3 gap-2 pt-2">
                {[1000, 2500, 5000].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSteps(amt)}
                    className="text-xs font-semibold hover:bg-indigo-500/10 hover:border-indigo-500/30"
                  >
                    +{amt.toLocaleString()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. CALORIES & PROTEIN */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <span>Nutrition & Macros Intake</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="calInput" className="text-xs flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>Calories Consumed</span>
                  </Label>
                  <Input
                    id="calInput"
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="font-bold text-sm bg-card"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="protInput" className="text-xs flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-purple-500" />
                    <span>Protein Consumed (g)</span>
                  </Label>
                  <Input
                    id="protInput"
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="font-bold text-sm bg-card"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="burnInput" className="text-xs">Active Calories Burned (Cardio/NEAT)</Label>
                <Input
                  id="burnInput"
                  type="number"
                  min="0"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  className="bg-card"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. SLEEP, WORKOUT & MOOD */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Moon className="h-5 w-5 text-blue-500" />
                <span>Recovery & Workout Completion</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="sleepInput" className="text-xs flex items-center gap-1">
                    <Moon className="h-3.5 w-3.5 text-blue-500" />
                    <span>Sleep (Hours)</span>
                  </Label>
                  <Input
                    id="sleepInput"
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="bg-card font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="moodSelect" className="text-xs flex items-center gap-1">
                    <Smile className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Recovery Mood</span>
                  </Label>
                  <select
                    id="moodSelect"
                    value={mood}
                    onChange={(e) => setMood(e.target.value as TrackingMood)}
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                  >
                    <option value="great">⚡ Great (Peak)</option>
                    <option value="good">🟢 Good (Ready)</option>
                    <option value="neutral">🟡 Neutral (Average)</option>
                    <option value="tired">🟠 Tired</option>
                    <option value="stressed">🔴 Stressed</option>
                  </select>
                </div>
              </div>

              {/* Workout Toggle */}
              <div
                onClick={() => setWorkoutCompleted(!workoutCompleted)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  workoutCompleted
                    ? "bg-emerald-500/15 border-emerald-500/40 text-foreground"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Dumbbell className={`h-4 w-4 ${workoutCompleted ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-bold">
                      {workoutCompleted ? "Workout Completed Today" : "Rest / No Workout"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Tap to toggle workout completion status
                    </p>
                  </div>
                </div>

                <CheckCircle
                  className={`h-5 w-5 ${workoutCompleted ? "text-emerald-500 fill-emerald-500/20" : "text-zinc-600"}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Bar */}
        <Button
          type="submit"
          className="w-full py-6 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md"
        >
          <Save className="h-5 w-5" />
          <span>Save Daily Biometrics for {selectedDate}</span>
        </Button>
      </form>

      {/* Recent 7 Days Audit History */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-500" />
          <span>Recent Biometric Logs (Past 7 Days)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {logs.slice(0, 8).map((log) => (
            <Card
              key={log.id || log.trackingDate}
              onClick={() => handleDateChange(log.trackingDate)}
              className={`p-3.5 border cursor-pointer hover:border-emerald-500/50 transition-all ${
                log.trackingDate === selectedDate ? "border-emerald-500 bg-emerald-500/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-foreground">{log.trackingDate}</span>
                {log.workoutCompleted ? (
                  <Badge variant="default" className="text-[9px] bg-emerald-600 px-1.5 py-0">
                    Workout
                  </Badge>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Rest</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                <span>Steps: <strong className="text-foreground">{log.stepsCount.toLocaleString()}</strong></span>
                <span>Water: <strong className="text-foreground">{log.waterIntakeMl}ml</strong></span>
                <span>Calories: <strong className="text-foreground">{log.caloriesConsumed}</strong></span>
                <span>Protein: <strong className="text-foreground">{log.proteinConsumedG}g</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
