"use client";

import React from "react";
import { Check, Calendar, ThumbsUp, ThumbsDown, ShieldAlert, Dumbbell, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutSplitPlan } from "@/types/workout";

interface SplitDetailModalProps {
  split: WorkoutSplitPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSetActive: (split: WorkoutSplitPlan) => void;
  isActive: boolean;
}

export function SplitDetailModal({
  split,
  isOpen,
  onClose,
  onSetActive,
  isActive,
}: SplitDetailModalProps) {
  if (!split) return null;

  const { educationalOverview, routines } = split;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-1">
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider">
              {split.daysPerWeek} Days / Week • {split.recommendedExperience}
            </Badge>
            {isActive && (
              <Badge variant="default" className="bg-emerald-600 text-white text-[10px]">
                Active Split
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{split.name}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {split.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-3 text-xs sm:text-sm">
          {/* Target Audience & Schedule */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
            <div>
              <span className="font-semibold text-foreground">Who This Is Best For: </span>
              <span className="text-muted-foreground">{educationalOverview.targetAudience}</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Weekly Schedule:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5">
                {educationalOverview.weeklySchedule.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                <ThumbsUp className="h-4 w-4" />
                <span>Advantages & Strengths</span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {educationalOverview.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 text-xs">
                <ThumbsDown className="h-4 w-4" />
                <span>Trade-offs & Considerations</span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {educationalOverview.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recovery Advice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Recovery & Fatigue Management: </span>
              <span>{educationalOverview.recoveryAdvice}</span>
            </div>
          </div>

          {/* Routines & Exercises Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              <span>Included Daily Routines ({routines.length})</span>
            </h4>

            <div className="space-y-3">
              {routines.map((routine) => (
                <div key={routine.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
                        {routine.dayLabel}
                      </span>
                      <h5 className="font-bold text-foreground text-sm">{routine.name}</h5>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock className="h-3.5 w-3.5" />
                      <span>~{routine.estimatedMinutes}m</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {routine.exercises.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-2 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[180px]">{ex.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {ex.sets} sets × {ex.reps} reps
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {ex.equipment}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <Button
              className="w-full py-6 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md"
              disabled={isActive}
              onClick={() => {
                onSetActive(split);
                onClose();
              }}
            >
              <Check className="h-5 w-5" />
              <span>{isActive ? "Currently Active Split" : "Activate This Workout Split"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
