"use client";

import React, { useState } from "react";
import { Plus, Ruler } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeightTrendChart } from "@/components/dashboard/WeightTrendChart";
import { WeightHistoryPoint } from "@/types/fitness";

export default function ProgressPage() {
  const [weightHistory] = useState<WeightHistoryPoint[]>([
    { date: "Week 1", weight: 81.2 },
    { date: "Week 2", weight: 80.7 },
    { date: "Week 3", weight: 80.4 },
    { date: "Week 4", weight: 80.0 },
    { date: "Week 5", weight: 79.6 },
    { date: "Week 6", weight: 79.4 },
  ]);

  const [newWeight, setNewWeight] = useState("");
  const [newBodyFat, setNewBodyFat] = useState("");
  const [newWaist, setNewWaist] = useState("");
  const [newChest, setNewChest] = useState("");
  const [newArms, setNewArms] = useState("");

  const handleRecordMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Progress entry recorded successfully!");
    setNewWeight("");
    setNewBodyFat("");
    setNewWaist("");
    setNewChest("");
    setNewArms("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Physique & Weight Progression
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor weight trends, body fat percentages, and circumference measurements over time.
          </p>
        </div>
      </div>

      {/* Top Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeightTrendChart data={weightHistory} unit="kg" />
        </div>

        {/* Current Body Measurements */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Ruler className="h-4 w-4 text-emerald-500" />
              <span>Current Circumferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-muted-foreground">Body Fat Percentage:</span>
              <span className="font-bold text-foreground text-sm">13.8%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-muted-foreground">Chest:</span>
              <span className="font-bold text-foreground text-sm">106.5 cm</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-muted-foreground">Waist:</span>
              <span className="font-bold text-foreground text-sm">81.0 cm</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-muted-foreground">Arms (Flexed):</span>
              <span className="font-bold text-foreground text-sm">41.2 cm</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Thighs:</span>
              <span className="font-bold text-foreground text-sm">62.0 cm</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log New Measurement Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record New Measurement Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecordMeasurement} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="progWeight">Weight (kg)</Label>
              <Input
                id="progWeight"
                type="number"
                step="0.1"
                placeholder="79.4"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="progBf">Body Fat (%)</Label>
              <Input
                id="progBf"
                type="number"
                step="0.1"
                placeholder="13.8"
                value={newBodyFat}
                onChange={(e) => setNewBodyFat(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="progWaist">Waist (cm)</Label>
              <Input
                id="progWaist"
                type="number"
                step="0.5"
                placeholder="81"
                value={newWaist}
                onChange={(e) => setNewWaist(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="progChest">Chest (cm)</Label>
              <Input
                id="progChest"
                type="number"
                step="0.5"
                placeholder="106.5"
                value={newChest}
                onChange={(e) => setNewChest(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="progArms">Arms (cm)</Label>
              <Input
                id="progArms"
                type="number"
                step="0.5"
                placeholder="41.2"
                value={newArms}
                onChange={(e) => setNewArms(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-5 flex justify-end pt-2">
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Save Progress Check-in</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
