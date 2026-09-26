"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Play,
  Sparkles,
  Trophy,
  History,
  BookOpen,
  Home,
  Shield,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkoutStatsCards } from "@/components/workout/WorkoutStatsCards";
import { ActiveWorkoutSession } from "@/components/workout/ActiveWorkoutSession";
import { WorkoutGeneratorModal } from "@/components/workout/WorkoutGeneratorModal";
import { SplitDetailModal } from "@/components/workout/SplitDetailModal";
import {
  WORKOUT_SPLITS,
  DEDICATED_CORE_WORKOUTS,
  DEDICATED_HOME_WORKOUTS,
  WARMUP_COOLDOWN_PROTOCOLS,
} from "@/lib/workout/splits-data";
import {
  getStoredWorkoutSessions,
  saveCompletedWorkoutSession,
  deleteWorkoutSession,
  getActiveSplitPlan,
  setActiveSplitPlan,
} from "@/lib/workout/storage";
import {
  calculateWeeklyMetrics,
  extractPersonalRecords,
  getOverloadRecommendation,
} from "@/lib/workout/progressive-overload";
import { WorkoutRoutine, WorkoutSplitPlan, CompletedWorkoutSession } from "@/types/workout";

export default function WorkoutPage() {
  // Persistence state
  const [activeSplit, setActiveSplit] = useState<WorkoutSplitPlan>(() => getActiveSplitPlan());
  const [sessions, setSessions] = useState<CompletedWorkoutSession[]>(() => getStoredWorkoutSessions());

  // Modals state
  const [selectedRoutineForWorkout, setSelectedRoutineForWorkout] = useState<WorkoutRoutine | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [inspectingSplit, setInspectingSplit] = useState<WorkoutSplitPlan | null>(null);

  // Metrics
  const metrics = calculateWeeklyMetrics(sessions);
  const personalRecords = extractPersonalRecords(sessions);

  // Handle plan activation
  const handleActivateSplit = (split: WorkoutSplitPlan) => {
    setActiveSplit(split);
    setActiveSplitPlan(split);
    toast.success(`Active split updated to: ${split.name}!`);
  };

  // Handle session finish
  const handleFinishWorkout = (newSession: CompletedWorkoutSession) => {
    saveCompletedWorkoutSession(newSession);
    const updated = getStoredWorkoutSessions();
    setSessions(updated);
    toast.success("Workout session saved to history! Outstanding work!");
  };

  // Handle delete session
  const handleDeleteSession = (id: string) => {
    deleteWorkoutSession(id);
    setSessions(getStoredWorkoutSessions());
    toast.info("Workout session removed from history.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Workout Platform
            </h1>
            <Badge variant="outline" className="text-xs font-mono border-emerald-500/50 text-emerald-500">
              PRO TRAINING
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Current Split: <span className="font-semibold text-emerald-500">{activeSplit.name}</span> ({activeSplit.daysPerWeek} Days/Week)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-semibold text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            onClick={() => setIsGeneratorModalOpen(true)}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Workout Generator</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <WorkoutStatsCards
        weeklyCount={metrics.weeklyCount}
        totalVolumeKg={metrics.totalVolumeKg}
        personalRecordsCount={personalRecords.length}
        totalDurationMinutes={metrics.totalDurationMinutes}
      />

      {/* Main Navigation Tabs */}
      <Tabs defaultValue="active-split" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/60">
          <TabsTrigger value="active-split" className="text-xs py-2 gap-1.5">
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Active Split</span>
          </TabsTrigger>
          <TabsTrigger value="splits-library" className="text-xs py-2 gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Split Library</span>
          </TabsTrigger>
          <TabsTrigger value="home-core" className="text-xs py-2 gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <span>Home & Core</span>
          </TabsTrigger>
          <TabsTrigger value="warmup-cooldown" className="text-xs py-2 gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Warm-up / Cool</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-2 gap-1.5 col-span-2 md:col-span-1">
            <History className="h-3.5 w-3.5" />
            <span>History & PRs</span>
          </TabsTrigger>
        </TabsList>

        {/* ========================================================= */}
        {/* TAB 1: ACTIVE SPLIT ROUTINES */}
        {/* ========================================================= */}
        <TabsContent value="active-split" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Routines in {activeSplit.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Select a routine to begin your live active workout with audio rest timers and progressive overload tracking.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInspectingSplit(activeSplit)}
            >
              Educational Overview
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSplit.routines.map((routine, idx) => (
              <Card
                key={routine.id}
                className="flex flex-col justify-between border-border hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                        {routine.dayLabel}
                      </span>
                      {idx === 0 && (
                        <Badge variant="default" className="text-[10px] bg-emerald-600">
                          Recommended Next
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                      {routine.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-3.5 w-3.5" />
                        {routine.exercises.length} Movements
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        ~{routine.estimatedMinutes} mins
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 text-xs">
                    {routine.exercises.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50"
                      >
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[170px]">
                            {ex.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {ex.sets} sets × {ex.reps} reps
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] capitalize">
                          {ex.equipment}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </div>

                <div className="p-4 pt-2">
                  <Button
                    className="w-full gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    onClick={() => setSelectedRoutineForWorkout(routine)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Workout Session</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 2: SPLITS & PROGRAMS LIBRARY */}
        {/* ========================================================= */}
        <TabsContent value="splits-library" className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Educational Workout Split Library
            </h3>
            <p className="text-xs text-muted-foreground">
              Scientifically structured splits covering Full Body, Upper/Lower, Push Pull Legs, and Bro Split for 3, 4, 5, or 6 days/week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORKOUT_SPLITS.map((split) => {
              const isCurrent = activeSplit.id === split.id;
              return (
                <Card
                  key={split.id}
                  className={`border transition-all ${
                    isCurrent
                      ? "border-emerald-500/60 shadow-md shadow-emerald-950/10"
                      : "border-border hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <Badge variant="outline" className="text-xs font-mono uppercase">
                        {split.daysPerWeek} Days/Week • {split.recommendedExperience}
                      </Badge>
                      {isCurrent ? (
                        <Badge variant="default" className="text-[10px] bg-emerald-600">
                          Active Split
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {split.routines.length} Routines
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {split.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {split.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-1">
                    <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs">
                      <span className="font-semibold text-foreground">Weekly Structure:</span>
                      <p className="text-muted-foreground text-[11px]">
                        {split.educationalOverview.weeklySchedule.slice(0, 3).join(" • ")}...
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setInspectingSplit(split)}
                      >
                        Learn & View Routines
                      </Button>
                      <Button
                        size="sm"
                        disabled={isCurrent}
                        className="flex-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleActivateSplit(split)}
                      >
                        {isCurrent ? "Active" : "Activate Split"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 3: HOME WORKOUTS & DEDICATED CORE */}
        {/* ========================================================= */}
        <TabsContent value="home-core" className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Equipment-Free Home Workouts
              </h3>
              <p className="text-xs text-muted-foreground">
                100% Calisthenics and bodyweight sessions you can perform in any room with zero equipment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEDICATED_HOME_WORKOUTS.map((routine) => (
                <Card key={routine.id} className="border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">
                        100% Zero Equipment
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        ~{routine.estimatedMinutes}m
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold">{routine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5 text-xs">
                      {routine.exercises.map((ex, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-border/40">
                          <span className="font-medium text-foreground">{ex.name}</span>
                          <span className="text-muted-foreground">{ex.sets} × {ex.reps}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      onClick={() => setSelectedRoutineForWorkout(routine)}
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Start Home Workout</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Dedicated Core & Abdominal Circuits
              </h3>
              <p className="text-xs text-muted-foreground">
                Targeted routines for rectus abdominis, obliques, and rotational core stability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEDICATED_CORE_WORKOUTS.map((routine) => (
                <Card key={routine.id} className="border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">
                        Core Isolation
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        ~{routine.estimatedMinutes}m
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold">{routine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5 text-xs">
                      {routine.exercises.map((ex, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-border/40">
                          <span className="font-medium text-foreground">{ex.name}</span>
                          <span className="text-muted-foreground">{ex.sets} × {ex.reps}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      onClick={() => setSelectedRoutineForWorkout(routine)}
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Start Core Circuit</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 4: WARM-UP & COOL-DOWN PROTOCOLS */}
        {/* ========================================================= */}
        <TabsContent value="warmup-cooldown" className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Warm-up & Cool-down Protocols
            </h3>
            <p className="text-xs text-muted-foreground">
              Evidence-based dynamic joint mobility before heavy training and parasympathetic decompression afterward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WARMUP_COOLDOWN_PROTOCOLS.map((protocol) => (
              <Card key={protocol.id} className="border-border flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={protocol.type === "warmup" ? "default" : "secondary"}
                        className="text-[10px] uppercase font-mono"
                      >
                        {protocol.type} • {protocol.durationMinutes} Mins
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        {protocol.targetArea}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {protocol.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
                    {protocol.exercises.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>{item.name}</span>
                          <span className="text-emerald-500 font-mono text-[11px]">
                            {item.durationOrReps}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.cues}</p>
                      </div>
                    ))}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 5: WORKOUT HISTORY & PROGRESSIVE OVERLOAD */}
        {/* ========================================================= */}
        <TabsContent value="history" className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Workout History & Progressive Overload Tracking
            </h3>
            <p className="text-xs text-muted-foreground">
              Review completed sessions, recorded weights, reps, and automatic progressive overload recommendations.
            </p>
          </div>

          {/* Personal Records Banner */}
          {personalRecords.length > 0 && (
            <Card className="border-purple-500/30 bg-purple-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Trophy className="h-5 w-5" />
                  <CardTitle className="text-base font-bold">
                    Personal Records Logged ({personalRecords.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {personalRecords.slice(0, 6).map((pr, idx) => (
                  <div key={idx} className="p-3 bg-background rounded-xl border text-xs">
                    <span className="text-muted-foreground capitalize font-medium">
                      {pr.recordType.replace("_", " ")}
                    </span>
                    <p className="font-bold text-sm text-foreground truncate mt-0.5">
                      {pr.exerciseName}
                    </p>
                    <p className="text-base font-extrabold text-purple-500 mt-1">
                      {pr.value} {pr.unit}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Progressive Overload Next Session Targets */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Dumbbell className="h-5 w-5" />
                <CardTitle className="text-base font-bold">
                  Next Session Progressive Overload Targets
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                getOverloadRecommendation("ex-chest-1", "Barbell Flat Bench Press", "Chest", 90, 8),
                getOverloadRecommendation("ex-back-2", "Pull-ups (Overhand Grip)", "Back", 85, 12),
              ].map((rec, i) => (
                <div key={i} className="p-3 bg-background rounded-xl border space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{rec.exerciseName}</span>
                    <span className="text-emerald-500 font-mono">Target: {rec.suggestedWeightKg}kg × {rec.suggestedReps}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{rec.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <History className="h-4 w-4 text-emerald-500" />
              <span>Completed Sessions ({sessions.length})</span>
            </h4>

            {sessions.map((session) => (
              <Card key={session.id} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {session.splitName}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground">
                        {session.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        RPE: {session.rpe || 8}/10
                      </Badge>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1 transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 text-center text-xs">
                    <div>
                      <span className="text-muted-foreground">Volume</span>
                      <p className="font-bold text-foreground">{session.totalVolumeKg.toLocaleString()} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sets Completed</span>
                      <p className="font-bold text-emerald-500">{session.totalSets}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration</span>
                      <p className="font-bold text-foreground">
                        {Math.round(session.durationSeconds / 60)} mins
                      </p>
                    </div>
                  </div>

                  {/* Exercises and sets recorded */}
                  <div className="space-y-2 pt-1 text-xs">
                    {session.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="p-2.5 rounded-lg border border-border/50 bg-background/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-foreground">{ex.exerciseName}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {ex.sets.filter((s) => s.isCompleted).length} sets recorded
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ex.sets.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                                s.isCompleted
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {s.weightKg}kg × {s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {session.notes && (
                    <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/30">
                      &quot;{session.notes}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Workout Tracker Modal */}
      {selectedRoutineForWorkout && (
        <ActiveWorkoutSession
          routine={selectedRoutineForWorkout}
          isOpen={true}
          onClose={() => setSelectedRoutineForWorkout(null)}
          onFinish={handleFinishWorkout}
        />
      )}

      {/* Generator Modal */}
      <WorkoutGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onPlanGenerated={handleActivateSplit}
      />

      {/* Split Educational Detail Modal */}
      <SplitDetailModal
        split={inspectingSplit}
        isOpen={!!inspectingSplit}
        onClose={() => setInspectingSplit(null)}
        onSetActive={handleActivateSplit}
        isActive={activeSplit.id === inspectingSplit?.id}
      />
    </div>
  );
}
