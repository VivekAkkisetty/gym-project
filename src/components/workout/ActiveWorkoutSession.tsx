"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Check,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  WorkoutRoutine,
  SessionExercise,
  SessionSet,
  CompletedWorkoutSession,
} from "@/types/workout";
import { EXERCISE_DATABASE } from "@/lib/workout/exercises-data";
import { RestTimerBar } from "./RestTimerBar";

interface ActiveWorkoutSessionProps {
  routine: WorkoutRoutine;
  isOpen: boolean;
  onClose: () => void;
  onFinish: (session: CompletedWorkoutSession) => void;
}

export function ActiveWorkoutSession({
  routine,
  isOpen,
  onClose,
  onFinish,
}: ActiveWorkoutSessionProps) {
  // Live elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer state
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [activeExerciseName, setActiveExerciseName] = useState("");

  // Finish modal state
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState(8);

  // Exercise selector modal
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Active workout exercises state
  const [exercises, setExercises] = useState<SessionExercise[]>(() => {
    return routine.exercises.map((rx) => {
      const sets: SessionSet[] = Array.from({ length: rx.sets }, (_, i) => ({
        setNumber: i + 1,
        weightKg: rx.targetWeight ? parseFloat(rx.targetWeight) || 0 : 0,
        reps: parseInt(rx.reps) || 10,
        previousWeightKg: rx.targetWeight ? parseFloat(rx.targetWeight) || 0 : 0,
        previousReps: parseInt(rx.reps) || 10,
        isCompleted: false,
        isWarmup: i === 0 && rx.sets >= 4,
      }));

      return {
        exerciseId: rx.exerciseId,
        exerciseName: rx.name,
        muscleGroup: rx.muscleGroup,
        secondaryMuscles: rx.secondaryMuscles || [],
        equipment: rx.equipment,
        restTimeSeconds: rx.restTimeSeconds || 90,
        targetSets: rx.sets,
        targetReps: rx.reps,
        sets,
      };
    });
  });

  // Start timer on open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Toggle set completion and trigger rest timer
  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      const targetSet = updated[exIdx].sets[setIdx];
      const willBeCompleted = !targetSet.isCompleted;
      targetSet.isCompleted = willBeCompleted;

      // If completing set, trigger rest timer
      if (willBeCompleted) {
        setRestDuration(updated[exIdx].restTimeSeconds || 90);
        setActiveExerciseName(updated[exIdx].exerciseName);
        setIsRestTimerOpen(true);
      }

      return updated;
    });
  };

  // Update set values
  const updateSetValue = (
    exIdx: number,
    setIdx: number,
    field: "weightKg" | "reps",
    value: number
  ) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exIdx].sets[setIdx][field] = Math.max(0, value);
      return updated;
    });
  };

  // Add set to exercise
  const addSet = (exIdx: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      const currentSets = updated[exIdx].sets;
      const lastSet = currentSets[currentSets.length - 1];

      updated[exIdx].sets.push({
        setNumber: currentSets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 0,
        reps: lastSet ? lastSet.reps : 10,
        previousWeightKg: lastSet ? lastSet.weightKg : 0,
        previousReps: lastSet ? lastSet.reps : 10,
        isCompleted: false,
        isWarmup: false,
      });

      return updated;
    });
  };

  // Remove set
  const removeSet = (exIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exIdx].sets.splice(setIdx, 1);
      // Renumber
      updated[exIdx].sets.forEach((s, i) => {
        s.setNumber = i + 1;
      });
      return updated;
    });
  };

  // Add custom exercise from DB to active workout
  const addExerciseToSession = (exerciseId: string) => {
    const ex = EXERCISE_DATABASE.find((e) => e.id === exerciseId);
    if (!ex) return;

    setExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        secondaryMuscles: ex.secondaryMuscles,
        equipment: ex.equipment,
        restTimeSeconds: ex.restTimeSeconds,
        targetSets: ex.defaultSets,
        targetReps: ex.defaultReps,
        sets: [
          { setNumber: 1, weightKg: 0, reps: 10, isCompleted: false, isWarmup: false },
          { setNumber: 2, weightKg: 0, reps: 10, isCompleted: false, isWarmup: false },
          { setNumber: 3, weightKg: 0, reps: 10, isCompleted: false, isWarmup: false },
        ],
      },
    ]);

    setIsAddExerciseModalOpen(false);
    toast.success(`Added ${ex.name} to active session!`);
  };

  // Calculations for session summary
  let totalVolumeKg = 0;
  let totalSetsCompleted = 0;
  let totalRepsCompleted = 0;

  exercises.forEach((ex) => {
    ex.sets.forEach((s) => {
      if (s.isCompleted) {
        totalVolumeKg += s.weightKg * s.reps;
        totalSetsCompleted += 1;
        totalRepsCompleted += s.reps;
      }
    });
  });

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleFinishWorkout = (timestamp: number) => {
    if (totalSetsCompleted === 0) {
      toast.error("Please complete at least one set before finishing.");
      return;
    }

    const sessionPayload: CompletedWorkoutSession = {
      id: `session-${timestamp}`,
      title: routine.name,
      splitName: routine.splitType.replace("_", " ").toUpperCase(),
      durationSeconds: elapsedSeconds,
      startedAt: new Date(timestamp - elapsedSeconds * 1000).toISOString(),
      completedAt: new Date(timestamp).toISOString(),
      totalVolumeKg,
      totalSets: totalSetsCompleted,
      totalReps: totalRepsCompleted,
      exercises,
      notes,
      rpe,
      personalRecordsCount: totalVolumeKg > 5000 ? 1 : 0,
    };

    onFinish(sessionPayload);
    setIsFinishModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                LIVE WORKOUT
              </Badge>
              <span className="text-xs font-mono font-bold text-foreground">
                {formattedDuration}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate max-w-[280px] sm:max-w-md">
              {routine.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
              onClick={() => setIsFinishModalOpen(true)}
            >
              <Trophy className="h-4 w-4" />
              <span>Finish</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Exercises Container */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-xl border border-border text-center text-xs">
          <div>
            <span className="text-muted-foreground">Volume</span>
            <p className="font-bold text-sm text-foreground">{totalVolumeKg.toLocaleString()} kg</p>
          </div>
          <div>
            <span className="text-muted-foreground">Completed Sets</span>
            <p className="font-bold text-sm text-emerald-500">{totalSetsCompleted}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Reps</span>
            <p className="font-bold text-sm text-foreground">{totalRepsCompleted}</p>
          </div>
        </div>

        {/* Exercise Cards */}
        {exercises.map((exercise, exIdx) => (
          <Card key={exercise.exerciseId} className="border-border shadow-xs overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {exercise.muscleGroup}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {exercise.equipment}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    {exercise.exerciseName}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => {
                    setRestDuration(exercise.restTimeSeconds);
                    setActiveExerciseName(exercise.exerciseName);
                    setIsRestTimerOpen(true);
                  }}
                >
                  <Clock className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{exercise.restTimeSeconds}s Rest</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-2">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted-foreground px-2 pb-1">
                <span className="col-span-2 text-center">SET</span>
                <span className="col-span-3 text-center">PREVIOUS</span>
                <span className="col-span-3 text-center">KG</span>
                <span className="col-span-2 text-center">REPS</span>
                <span className="col-span-2 text-center">DONE</span>
              </div>

              {/* Set Rows */}
              {exercise.sets.map((set, setIdx) => {
                return (
                  <div
                    key={set.setNumber}
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-colors ${
                      set.isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-card border-border hover:bg-muted/30"
                    }`}
                  >
                    {/* Set Number */}
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          set.isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {set.setNumber}
                      </span>
                    </div>

                    {/* Previous Performance */}
                    <div className="col-span-3 text-center text-xs text-muted-foreground font-mono">
                      {set.previousWeightKg ? `${set.previousWeightKg}kg × ${set.previousReps}` : "—"}
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="2.5"
                        value={set.weightKg === 0 ? "" : set.weightKg}
                        placeholder="0"
                        onChange={(e) =>
                          updateSetValue(exIdx, setIdx, "weightKg", parseFloat(e.target.value) || 0)
                        }
                        className="h-10 text-center font-bold text-sm bg-background"
                      />
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={set.reps === 0 ? "" : set.reps}
                        placeholder="0"
                        onChange={(e) =>
                          updateSetValue(exIdx, setIdx, "reps", parseInt(e.target.value) || 0)
                        }
                        className="h-10 text-center font-bold text-sm bg-background"
                      />
                    </div>

                    {/* Checkbox Complete */}
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <button
                        onClick={() => toggleSetComplete(exIdx, setIdx)}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                          set.isCompleted
                            ? "bg-emerald-600 text-white shadow-xs scale-95"
                            : "bg-muted hover:bg-zinc-200 dark:hover:bg-zinc-800 text-muted-foreground"
                        }`}
                      >
                        <Check className={`h-5 w-5 ${set.isCompleted ? "stroke-[3]" : ""}`} />
                      </button>

                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => removeSet(exIdx, setIdx)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-rose-500 opacity-60 hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add Set Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => addSet(exIdx)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Set</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Exercise Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full py-6 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-emerald-500 font-semibold gap-2"
            onClick={() => setIsAddExerciseModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Exercise to This Workout</span>
          </Button>
        </div>
      </div>

      {/* Persistent Client-Side Rest Timer */}
      <RestTimerBar
        initialSeconds={restDuration}
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        exerciseName={activeExerciseName}
      />

      {/* Add Exercise Modal */}
      <Dialog open={isAddExerciseModalOpen} onOpenChange={setIsAddExerciseModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
            <DialogDescription>
              Select a movement from the verified exercise library.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 pt-2">
            {EXERCISE_DATABASE.slice(0, 15).map((ex) => (
              <div
                key={ex.id}
                onClick={() => addExerciseToSession(ex.id)}
                className="p-3 rounded-lg border border-border hover:border-emerald-500 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">{ex.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ex.muscleGroup} • {ex.equipment}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-emerald-500" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Finish Workout Summary Modal */}
      <Dialog open={isFinishModalOpen} onOpenChange={setIsFinishModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <Trophy className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Workout Complete!</span>
            </div>
            <DialogTitle className="text-2xl font-bold">Awesome Session!</DialogTitle>
            <DialogDescription>
              Review your training volume, log your perceived exertion (RPE), and store your session history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Stats Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-xl text-center text-xs">
              <div className="p-2 bg-background rounded-lg border">
                <span className="text-muted-foreground">Duration</span>
                <p className="font-bold text-sm text-foreground mt-0.5">{formattedDuration}</p>
              </div>
              <div className="p-2 bg-background rounded-lg border">
                <span className="text-muted-foreground">Total Volume</span>
                <p className="font-bold text-sm text-emerald-500 mt-0.5">{totalVolumeKg} kg</p>
              </div>
              <div className="p-2 bg-background rounded-lg border">
                <span className="text-muted-foreground">Total Sets</span>
                <p className="font-bold text-sm text-foreground mt-0.5">{totalSetsCompleted}</p>
              </div>
              <div className="p-2 bg-background rounded-lg border">
                <span className="text-muted-foreground">Total Reps</span>
                <p className="font-bold text-sm text-foreground mt-0.5">{totalRepsCompleted}</p>
              </div>
            </div>

            {/* RPE Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-foreground">Rate of Perceived Exertion (RPE): {rpe}/10</label>
                <span className="text-muted-foreground">
                  {rpe <= 6 ? "Light / Warm" : rpe <= 8 ? "Challenging / Solid" : "Near Failure / Extreme"}
                </span>
              </div>
              <div className="flex gap-1.5">
                {[5, 6, 7, 8, 9, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRpe(val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                      rpe === val
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Workout Notes / Reflections</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Great mind-muscle connection on rows, increased bench by 2.5kg..."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button
              className="w-full py-6 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md"
              onClick={() => handleFinishWorkout(Date.now())}
            >
              <Check className="h-5 w-5" />
              <span>Save & Log Workout Session</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
