"use client";

import React, { useState } from "react";
import {
  Plus,
  Download,
  Camera,
  Trophy,
  History,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ProgressOverviewCards } from "@/components/tracking/ProgressOverviewCards";
import { ProgressChartsGrid } from "@/components/tracking/ProgressChartsGrid";
import { BodyMeasurementsModal } from "@/components/tracking/BodyMeasurementsModal";
import { ProgressPhotoGallery } from "@/components/tracking/ProgressPhotoGallery";
import { WeeklySummaryCard } from "@/components/tracking/WeeklySummaryCard";
import { GoalProgressRings } from "@/components/tracking/GoalProgressRings";
import { AchievementsList } from "@/components/tracking/AchievementsList";
import { DataExportModal } from "@/components/tracking/DataExportModal";
import {
  getStoredMeasurements,
  saveMeasurement,
  getStoredDailyLogs,
  getStoredPhotos,
  savePhoto,
  deletePhoto,
} from "@/lib/tracking/storage";
import {
  calculateWeightStats,
  getWeightChartData,
  getCircumferenceChartData,
  getCaloriesChartData,
  getProteinChartData,
  getStepsChartData,
  getWorkoutConsistencyChartData,
  generateWeeklySummary,
  calculateGoalProgress,
} from "@/lib/tracking/progress-analytics";
import { evaluateAchievements } from "@/lib/tracking/achievements";
import { getStoredWorkoutSessions } from "@/lib/workout/storage";
import { getStoredDietPlans } from "@/lib/nutrition/storage";
import { BodyMeasurements, ProgressPhotoItem } from "@/types/tracking";
import { useMounted } from "@/hooks";

export default function ProgressPage() {
  const isMounted = useMounted();
  const [, setRefreshTick] = useState(0);

  // Read from storage only after hydration mount to prevent SSR mismatch
  const measurements = isMounted ? getStoredMeasurements() : [];
  const dailyLogs = isMounted ? getStoredDailyLogs() : [];
  const photos = isMounted ? getStoredPhotos() : [];
  const workouts = isMounted ? getStoredWorkoutSessions() : [];
  const dietPlans = isMounted ? getStoredDietPlans() : [];

  // Modals state
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Analytics derivations
  const weightStats = calculateWeightStats(measurements);
  // Latest daily log — null if no data logged yet (never use fake numbers)
  const latestLog = dailyLogs[0] ?? null;

  const weeklyMetrics = generateWeeklySummary(dailyLogs, measurements);

  const goalTargets = {
    targetWeightKg: weightStats.currentWeight ? weightStats.currentWeight - 2 : 0,
    startWeightKg: weightStats.startingWeight || weightStats.currentWeight || 0,
    currentWeightKg: weightStats.currentWeight || 0,
    dailyProteinGoalG: 160,
    dailyStepGoal: 10000,
    dailyWaterGoalMl: 3000,
    weeklyWorkoutGoal: 4,
  };

  const goalProgressPercent = latestLog
    ? calculateGoalProgress(goalTargets, latestLog, weeklyMetrics.completedWorkouts)
    : {
        weightProgressPercent: 0,
        proteinProgressPercent: 0,
        stepProgressPercent: 0,
        waterProgressPercent: 0,
        workoutProgressPercent: 0,
      };

  const achievements = evaluateAchievements(dailyLogs, workouts, measurements, 160);

  // Time-series for Recharts
  const weightChartData = getWeightChartData(measurements);
  const circumferenceChartData = getCircumferenceChartData(measurements);
  const caloriesChartData = getCaloriesChartData(dailyLogs, 2400);
  const proteinChartData = getProteinChartData(dailyLogs, 160);
  const stepsChartData = getStepsChartData(dailyLogs, 10000);
  const workoutConsistencyData = getWorkoutConsistencyChartData(dailyLogs);

  // Handlers
  const handleSaveCheckin = (entry: BodyMeasurements) => {
    saveMeasurement(entry);
    setRefreshTick((t) => t + 1);
  };

  const handleUploadPhoto = (photo: ProgressPhotoItem) => {
    savePhoto(photo);
    setRefreshTick((t) => t + 1);
  };

  const handleDeletePhoto = (id: string) => {
    deletePhoto(id);
    setRefreshTick((t) => t + 1);
  };

  const handleDataReset = () => {
    setRefreshTick((t) => t + 1);
  };

  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="h-8 w-64 bg-muted/60 rounded-lg" />
            <div className="h-4 w-96 bg-muted/40 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card border border-border p-3.5" />
          ))}
        </div>
        <div className="h-72 rounded-xl bg-card border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Progress & Analytics
            </h1>
            <Badge variant="outline" className="text-xs font-mono border-emerald-500/50 text-emerald-500">
              REAL-TIME TRACKING
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Long-term physiological trends, circumference measurements, and private transformation milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>

          <Button
            size="sm"
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
            onClick={() => setIsCheckinModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Check-in</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards Banner */}
      <ProgressOverviewCards
        currentWeight={weightStats.currentWeight}
        totalChangeKg={weightStats.totalChangeKg}
        sevenDayAverage={weightStats.sevenDayAverage}
        sevenDayChangeKg={weightStats.sevenDayChangeKg}
        latestCalories={latestLog?.caloriesConsumed ?? 0}
        targetCalories={2400}
        latestProtein={latestLog?.proteinConsumedG ?? 0}
        targetProtein={160}
        latestWaterMl={latestLog?.waterIntakeMl ?? 0}
        targetWaterMl={3000}
        latestSteps={latestLog?.stepsCount ?? 0}
        targetSteps={10000}
        workoutConsistencyPercent={weeklyMetrics.workoutConsistencyPercent}
      />

      {/* Main Progress Tabs */}
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/60">
          <TabsTrigger value="charts" className="text-xs py-2 gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Analytics & Charts</span>
          </TabsTrigger>
          <TabsTrigger value="measurements" className="text-xs py-2 gap-1.5">
            <History className="h-3.5 w-3.5" />
            <span>Measurements Log</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-xs py-2 gap-1.5">
            <Camera className="h-3.5 w-3.5" />
            <span>Private Photos</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs py-2 gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            <span>Milestones</span>
          </TabsTrigger>
        </TabsList>

        {/* ========================================================= */}
        {/* TAB 1: CHARTS & ANALYTICS */}
        {/* ========================================================= */}
        <TabsContent value="charts" className="space-y-6">
          {/* Goal Progress Rings */}
          <GoalProgressRings
            targets={goalTargets}
            progressPercent={goalProgressPercent}
            latestProtein={latestLog?.proteinConsumedG ?? 0}
            latestSteps={latestLog?.stepsCount ?? 0}
            latestWaterMl={latestLog?.waterIntakeMl ?? 0}
            weeklyWorkouts={weeklyMetrics.completedWorkouts}
          />

          {/* 6 Core Recharts Graphs */}
          <ProgressChartsGrid
            weightData={weightChartData}
            circumferenceData={circumferenceChartData}
            caloriesData={caloriesChartData}
            proteinData={proteinChartData}
            stepsData={stepsChartData}
            workoutData={workoutConsistencyData}
          />

          {/* Weekly Summary */}
          <WeeklySummaryCard metrics={weeklyMetrics} />
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 2: MEASUREMENTS LOG */}
        {/* ========================================================= */}
        <TabsContent value="measurements" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Circumference & Scale History ({measurements.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Complete audit trail of all tape circumferences and weigh-in check-ins.
              </p>
            </div>
            <Button
              size="sm"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold"
              onClick={() => setIsCheckinModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record Entry</span>
            </Button>
          </div>

          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>Date</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Body Fat</TableHead>
                    <TableHead>Waist</TableHead>
                    <TableHead>Chest</TableHead>
                    <TableHead>Arms</TableHead>
                    <TableHead>Thighs</TableHead>
                    <TableHead>Neck</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {measurements.map((m) => (
                    <TableRow key={m.id || m.recordedDate} className="hover:bg-muted/40">
                      <TableCell className="font-mono font-semibold text-foreground whitespace-nowrap">
                        {m.recordedDate}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-500 whitespace-nowrap">
                        {m.weightKg} kg
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.bodyFatPercentage ? `${m.bodyFatPercentage}%` : "—"}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {m.waistCm ? `${m.waistCm} cm` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.chestCm ? `${m.chestCm} cm` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.armsCm ? `${m.armsCm} cm` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.thighsCm ? `${m.thighsCm} cm` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.neckCm ? `${m.neckCm} cm` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate text-[11px] italic">
                        {m.notes || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 3: PRIVATE PROGRESS PHOTOS */}
        {/* ========================================================= */}
        <TabsContent value="photos" className="space-y-4">
          <ProgressPhotoGallery
            photos={photos}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
            latestWeight={weightStats.currentWeight}
          />
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 4: ACHIEVEMENTS & MILESTONES */}
        {/* ========================================================= */}
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsList achievements={achievements} />
        </TabsContent>
      </Tabs>

      {/* Check-in Modal */}
      <BodyMeasurementsModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onSave={handleSaveCheckin}
        latestWeight={weightStats.currentWeight}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        measurements={measurements}
        dailyLogs={dailyLogs}
        dietPlans={dietPlans}
        workouts={workouts}
        onDataReset={handleDataReset}
      />
    </div>
  );
}
