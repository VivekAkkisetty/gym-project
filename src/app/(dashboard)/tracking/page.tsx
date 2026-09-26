"use client";

import React, { useState } from "react";
import {
  Calendar,
  Droplets,
  Footprints,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function TrackingPage() {
  const [waterMl, setWaterMl] = useState(2400);
  const [waterTarget] = useState(3200);
  const [steps, setSteps] = useState("8450");
  const [sleepHours, setSleepHours] = useState("7.5");
  const [mood, setMood] = useState("great");

  const addWater = (amount: number) => {
    const updated = waterMl + amount;
    setWaterMl(updated);
    toast.success(`Logged +${amount} ml. Daily hydration: ${updated} / ${waterTarget} ml`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Daily biometric logs saved successfully!");
  };

  const waterPercent = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Daily Habits & Biometric Tracking
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Record continuous daily metrics: water intake, steps, sleep, and recovery feel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span>Water Hydration</span>
              </CardTitle>
              <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                {waterPercent}% of target
              </span>
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

            <Progress value={waterPercent} className="h-2" indicatorClassName="bg-blue-500" />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWater(250)}
                className="text-xs font-semibold hover:bg-blue-500/10 hover:border-blue-500/30"
              >
                +250 ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWater(500)}
                className="text-xs font-semibold hover:bg-blue-500/10 hover:border-blue-500/30 bg-blue-500/5"
              >
                +500 ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWater(1000)}
                className="text-xs font-semibold hover:bg-blue-500/10 hover:border-blue-500/30"
              >
                +1000 ml
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Steps & Sleep Habits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Footprints className="h-5 w-5 text-amber-500" />
              <span>Activity & Recovery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveTracking} className="space-y-3.5">
              <div>
                <Label htmlFor="stepCount">Total Steps Logged</Label>
                <Input
                  id="stepCount"
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sleepHoursInput">Sleep Duration (Hours)</Label>
                <Input
                  id="sleepHoursInput"
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="moodSelect">Recovery & Energy State</Label>
                <select
                  id="moodSelect"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <option value="great">⚡ Great (Peak Energy & Motivation)</option>
                  <option value="good">🟢 Good (Ready for High Intensity)</option>
                  <option value="neutral">🟡 Neutral (Average Recovery)</option>
                  <option value="tired">🟠 Tired (Need Active Recovery)</option>
                  <option value="stressed">🔴 Stressed (High Fatigue)</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-2">
                Save Biometric Entry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
