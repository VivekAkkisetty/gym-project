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

export default function ProgressPage() {
  // State from persistence
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>(() => getStoredMeasurements());
  const [dailyLogs, setDailyLogs] = useState(() => getStoredDailyLogs());
  const [photos, setPhotos] = useState<ProgressPhotoItem[]>(() => getStoredPhotos());
  const workouts = getStoredWorkoutSessions();
  const dietPlans = getStoredDietPlans();

  // Modals state
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Analytics derivations
  const weightStats = calculateWeightStats(measurements);
  const latestLog = dailyLogs[0] || {
    caloriesConsumed: 2350,
    proteinConsumedG: 165,
    waterIntakeMl: 3100,
    stepsCount: 10420,
    workoutCompleted: true,
  };

  const weeklyMetrics = generateWeeklySummary(dailyLogs, measurements);

  const goalTargets = {
    targetWeightKg: 78.0,
    startWeightKg: weightStats.startingWeight || 82.4,
    currentWeightKg: weightStats.currentWeight || 79.4,
    dailyProteinGoalG: 160,
    dailyStepGoal: 10000,
    dailyWaterGoalMl: 3200,
    weeklyWorkoutGoal: 4,
  };

  const goalProgressPercent = calculateGoalProgress(
    goalTargets,
    latestLog,
    weeklyMetrics.completedWorkouts
  );

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
    setMeasurements(getStoredMeasurements());
  };

  const handleUploadPhoto = (photo: ProgressPhotoItem) => {
    savePhoto(photo);
    setPhotos(getStoredPhotos());
  };

  const handleDeletePhoto = (id: string) => {
    deletePhoto(id);
    setPhotos(getStoredPhotos());
  };

  const handleDataReset = () => {
    setMeasurements(getStoredMeasurements());
    setDailyLogs(getStoredDailyLogs());
    setPhotos(getStoredPhotos());
  };

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
        latestCalories={latestLog.caloriesConsumed}
        targetCalories={2400}
        latestProtein={latestLog.proteinConsumedG}
        targetProtein={160}
        latestWaterMl={latestLog.waterIntakeMl}
        targetWaterMl={3200}
        latestSteps={latestLog.stepsCount}
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
            latestProtein={latestLog.proteinConsumedG}
            latestSteps={latestLog.stepsCount}
            latestWaterMl={latestLog.waterIntakeMl}
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
