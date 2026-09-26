"use client";

import React, { useState } from "react";
import { Search, Filter, Dumbbell, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EXERCISE_DATABASE,
  searchExercises,
} from "@/lib/workout/exercises-data";
import { MuscleGroup, EquipmentType, ExerciseDifficulty, ExerciseItem } from "@/types/workout";
import { ExerciseDetailModal } from "@/components/workout/ExerciseDetailModal";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "All">("All");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | "All">("All");
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseItem | null>(null);

  const muscleGroups: (MuscleGroup | "All")[] = [
    "All",
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Quads",
    "Hamstrings",
    "Glutes",
    "Calves",
    "Abs",
    "Forearms",
  ];

  const equipmentTypes: (EquipmentType | "All")[] = [
    "All",
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "bodyweight",
    "bands",
  ];

  const difficulties: (ExerciseDifficulty | "All")[] = [
    "All",
    "beginner",
    "intermediate",
    "advanced",
  ];

  const filteredExercises = searchExercises(
    search,
    selectedMuscle,
    selectedEquipment,
    selectedDifficulty
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Exercise Library
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              {EXERCISE_DATABASE.length} Exercises
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Biomechanical execution cues, target musculature, and equipment requirements.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, primary muscles, synergists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        {/* Muscle group chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3 w-3 text-emerald-500" />
            <span className="font-semibold">Target Muscle Group:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedMuscle === muscle
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Dumbbell className="h-3 w-3 text-emerald-500" />
            <span className="font-semibold">Equipment Type:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {equipmentTypes.map((eq) => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap capitalize transition-colors ${
                  selectedEquipment === eq
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {eq === "bodyweight" ? "Bodyweight (Home)" : eq}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold">Difficulty Level:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap capitalize transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            onClick={() => setActiveModalExercise(exercise)}
            className="border-border hover:border-emerald-500/50 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {exercise.category}
                  </Badge>
                  <Badge
                    variant={
                      exercise.difficulty === "advanced"
                        ? "destructive"
                        : exercise.difficulty === "intermediate"
                        ? "amber"
                        : "default"
                    }
                    className="text-[10px] capitalize"
                  >
                    {exercise.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  {exercise.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-t border-border/40">
                  <span className="text-muted-foreground">Primary Muscle:</span>
                  <span className="font-semibold text-emerald-500">{exercise.muscleGroup}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border/40">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="font-medium text-foreground capitalize">{exercise.equipment}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border/40">
                  <span className="text-muted-foreground">Recommended:</span>
                  <span className="font-mono text-muted-foreground">
                    {exercise.defaultSets} sets × {exercise.defaultReps}
                  </span>
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="w-full text-xs text-emerald-500 hover:text-emerald-600 justify-between">
                <span>View Technique Cues</span>
                <Clock className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}

        {filteredExercises.length === 0 && (
          <div className="col-span-full p-8 text-center bg-muted/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm">
              No exercises match your search filters. Try selecting &quot;All&quot; or refining your keywords.
            </p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        isOpen={!!activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
      />
    </div>
  );
}
