"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Movements" },
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "legs", label: "Legs" },
    { id: "shoulders", label: "Shoulders" },
    { id: "arms", label: "Arms" },
    { id: "core", label: "Core" },
  ];

  const exercises = [
    {
      id: "1",
      name: "Barbell Incline Bench Press",
      category: "chest",
      muscle: "Upper Pectoralis Major",
      equipment: "Barbell & Incline Bench",
      difficulty: "Intermediate",
    },
    {
      id: "2",
      name: "Conventional Deadlift",
      category: "back",
      muscle: "Erector Spinae & Hamstrings",
      equipment: "Barbell & Plates",
      difficulty: "Advanced",
    },
    {
      id: "3",
      name: "Barbell High-Bar Back Squat",
      category: "legs",
      muscle: "Quadriceps & Gluteus Maximus",
      equipment: "Squat Rack & Barbell",
      difficulty: "Intermediate",
    },
    {
      id: "4",
      name: "Standing Dumbbell Lateral Raise",
      category: "shoulders",
      muscle: "Lateral Deltoid",
      equipment: "Dumbbells",
      difficulty: "Beginner",
    },
    {
      id: "5",
      name: "Weighted Neutral-Grip Pullup",
      category: "back",
      muscle: "Latissimus Dorsi",
      equipment: "Pullup Bar & Dip Belt",
      difficulty: "Advanced",
    },
    {
      id: "6",
      name: "Incline Dumbbell Bicep Curl",
      category: "arms",
      muscle: "Biceps Brachii (Long Head)",
      equipment: "Dumbbells & Incline Bench",
      difficulty: "Beginner",
    },
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory = selectedCategory === "all" || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Movement & Exercise Library
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verified exercise database with biomechanical cues and equipment filters.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" />
          <span>Add Custom Exercise</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, muscles, or techniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant="outline" className="capitalize text-[10px]">
                  {exercise.category}
                </Badge>
                <Badge
                  variant={
                    exercise.difficulty === "Advanced"
                      ? "destructive"
                      : exercise.difficulty === "Intermediate"
                      ? "amber"
                      : "default"
                  }
                  className="text-[10px]"
                >
                  {exercise.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold text-foreground">
                {exercise.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-muted-foreground">Primary Muscle:</span>
                <span className="font-medium text-foreground">{exercise.muscle}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-muted-foreground">Equipment:</span>
                <span className="font-medium text-foreground">{exercise.equipment}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
