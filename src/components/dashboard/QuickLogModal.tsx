"use client";

import React, { useState } from "react";
import { Utensils, Dumbbell, Droplets, Scale } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QuickLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function QuickLogModal({
  open,
  onOpenChange,
  onSuccess,
}: QuickLogModalProps) {
  const [activeTab, setActiveTab] = useState("food");

  // Food form state
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");


  // Workout form state
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [durationMins, setDurationMins] = useState("45");

  // Weight form state
  const [weightKg, setWeightKg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) {
      toast.error("Please enter food name and calories");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Logged ${foodName} (+${calories} kcal)`);
      setFoodName("");
      setCalories("");
      setProtein("");
      onOpenChange(false);
      onSuccess?.();
    }, 400);
  };

  const handleSubmitWater = (amount: number) => {
    toast.success(`Added +${amount} ml water intake! 💧`);
    onOpenChange(false);
    onSuccess?.();
  };

  const handleSubmitWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle) {
      toast.error("Please enter workout name");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Logged session: ${workoutTitle} (${durationMins}m)`);
      setWorkoutTitle("");
      onOpenChange(false);
      onSuccess?.();
    }, 400);
  };

  const handleSubmitWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) {
      toast.error("Please enter your current weight");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Recorded morning weigh-in: ${weightKg} kg`);
      setWeightKg("");
      onOpenChange(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick Metric Log</DialogTitle>
          <DialogDescription className="text-xs">
            Log today&apos;s nutrition, workout session, water intake, or weigh-in.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="food" className="gap-1.5 text-xs">
              <Utensils className="h-3.5 w-3.5" />
              <span>Food</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="gap-1.5 text-xs">
              <Dumbbell className="h-3.5 w-3.5" />
              <span>Workout</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-1.5 text-xs">
              <Droplets className="h-3.5 w-3.5" />
              <span>Water</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="gap-1.5 text-xs">
              <Scale className="h-3.5 w-3.5" />
              <span>Weight</span>
            </TabsTrigger>
          </TabsList>

          {/* Food Tab */}
          <TabsContent value="food" className="space-y-4 pt-3">
            <form onSubmit={handleSubmitFood} className="space-y-3">
              <div>
                <Label htmlFor="foodName" className="text-xs">Food Item Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g. Grilled Chicken Breast with Rice"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="calories" className="text-xs">Calories (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="38"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? "Logging..." : "Save Meal Log"}
              </Button>
            </form>
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-4 pt-3">
            <form onSubmit={handleSubmitWorkout} className="space-y-3">
              <div>
                <Label htmlFor="workoutTitle" className="text-xs">Workout Session Title</Label>
                <Input
                  id="workoutTitle"
                  placeholder="e.g. Push Hypertrophy: Chest & Delts"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="durationMins" className="text-xs">Duration (Minutes)</Label>
                <Input
                  id="durationMins"
                  type="number"
                  placeholder="60"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? "Recording..." : "Save Workout Session"}
              </Button>
            </form>
          </TabsContent>

          {/* Water Tab */}
          <TabsContent value="water" className="space-y-4 pt-3">
            <p className="text-xs text-muted-foreground text-center">
              Quickly increment your daily hydration:
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmitWater(250)}
                className="flex flex-col py-6 h-auto border-blue-500/30 hover:bg-blue-500/10"
              >
                <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                <span className="font-bold text-sm">+250 ml</span>
                <span className="text-[10px] text-muted-foreground">Glass</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmitWater(500)}
                className="flex flex-col py-6 h-auto border-blue-500/40 hover:bg-blue-500/10 bg-blue-500/5"
              >
                <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                <span className="font-bold text-sm">+500 ml</span>
                <span className="text-[10px] text-muted-foreground">Standard Bottle</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmitWater(1000)}
                className="flex flex-col py-6 h-auto border-blue-500/30 hover:bg-blue-500/10"
              >
                <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                <span className="font-bold text-sm">+1000 ml</span>
                <span className="text-[10px] text-muted-foreground">Large Shaker</span>
              </Button>
            </div>
          </TabsContent>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4 pt-3">
            <form onSubmit={handleSubmitWeight} className="space-y-3">
              <div>
                <Label htmlFor="weightKg" className="text-xs">Morning Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  placeholder="78.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? "Saving..." : "Record Weigh-In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
