"use client";

import { Dumbbell, CheckCircle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExerciseItem } from "@/types/workout";

interface ExerciseDetailModalProps {
  exercise: ExerciseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isOpen, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="capitalize text-xs font-semibold">
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
              className="text-xs capitalize"
            >
              {exercise.difficulty}
            </Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{exercise.name}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Biomechanical cues, muscular loading pattern, and execution technique.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs sm:text-sm">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border text-center text-xs">
            <div>
              <span className="text-muted-foreground">Recommended Sets</span>
              <p className="font-bold text-sm text-foreground mt-0.5">{exercise.defaultSets} Sets</p>
            </div>
            <div>
              <span className="text-muted-foreground">Target Reps</span>
              <p className="font-bold text-sm text-emerald-500 mt-0.5">{exercise.defaultReps}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Rest Interval</span>
              <p className="font-bold text-sm text-foreground mt-0.5">{exercise.restTimeSeconds}s</p>
            </div>
          </div>

          {/* Muscle Anatomy Breakdown */}
          <div className="space-y-2 p-3.5 rounded-xl border border-border bg-card">
            <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              <span>Target Musculature</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Primary Muscle Group:</span>
                <span className="font-bold text-emerald-500">{exercise.muscleGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Secondary Synergists:</span>
                <span className="font-medium text-foreground">
                  {exercise.secondaryMuscles.length > 0 ? exercise.secondaryMuscles.join(", ") : "None (Isolated)"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Required Equipment:</span>
                <span className="font-medium text-foreground capitalize">{exercise.equipment}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              <span>Step-by-Step Execution Technique</span>
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {exercise.instructions}
            </p>
          </div>

          {/* Pro Tips / Safety Cues */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Perform all repetitions with a controlled 2 to 3 second lowering (eccentric) phase. Never sacrifice joint alignment or spinal posture to lift heavier weights.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
