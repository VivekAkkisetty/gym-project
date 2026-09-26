"use client";

import React, { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BodyMeasurements, DailyTrackingLog } from "@/types/tracking";
import { DietPlan } from "@/lib/validations/nutrition";
import { CompletedWorkoutSession } from "@/types/workout";
import {
  buildExportPackage,
  measurementsToCSV,
  dailyTrackingToCSV,
  workoutHistoryToCSV,
  triggerFileDownload,
} from "@/lib/tracking/export-service";
import { clearAllTrackingData } from "@/lib/tracking/storage";

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurements: BodyMeasurements[];
  dailyLogs: DailyTrackingLog[];
  dietPlans: DietPlan[];
  workouts: CompletedWorkoutSession[];
  onDataReset: () => void;
}

export function DataExportModal({
  isOpen,
  onClose,
  measurements,
  dailyLogs,
  dietPlans,
  workouts,
  onDataReset,
}: DataExportModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExportJSON = () => {
    const pkg = buildExportPackage(measurements, dailyLogs, dietPlans, workouts);
    const content = JSON.stringify(pkg, null, 2);
    const dateStr = new Date().toISOString().split("T")[0];
    triggerFileDownload(content, `apexfit-complete-export-${dateStr}.json`, "application/json");
    toast.success("Complete JSON fitness data package exported!");
  };

  const handleExportMeasurementsCSV = () => {
    const csv = measurementsToCSV(measurements);
    const dateStr = new Date().toISOString().split("T")[0];
    triggerFileDownload(csv, `apexfit-measurements-${dateStr}.csv`, "text/csv");
    toast.success("Progress measurements CSV exported!");
  };

  const handleExportDailyLogsCSV = () => {
    const csv = dailyTrackingToCSV(dailyLogs);
    const dateStr = new Date().toISOString().split("T")[0];
    triggerFileDownload(csv, `apexfit-daily-tracking-${dateStr}.csv`, "text/csv");
    toast.success("Daily biometric tracking CSV exported!");
  };

  const handleExportWorkoutsCSV = () => {
    const csv = workoutHistoryToCSV(workouts);
    const dateStr = new Date().toISOString().split("T")[0];
    triggerFileDownload(csv, `apexfit-workout-history-${dateStr}.csv`, "text/csv");
    toast.success("Workout history CSV exported!");
  };

  const handleResetData = () => {
    clearAllTrackingData();
    onDataReset();
    setConfirmDelete(false);
    toast.info("All local tracking and measurement data has been wiped.");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Privacy & Data Portability</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Export Your Personal Fitness Data
          </DialogTitle>
          <DialogDescription>
            You own 100% of your data. Export everything to open, portable formats (JSON & CSV) or perform an account data wipe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-3 text-xs sm:text-sm">
          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Download Structured Formats
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full JSON */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                    <FileJson className="h-4 w-4" />
                    <span>Complete Data Package</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Everything bundled: measurements, diet plans, workout sessions, and daily tracking logs.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={handleExportJSON}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .JSON</span>
                </Button>
              </div>

              {/* Measurements CSV */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-xs">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Weight & Tape CSV</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Spreadsheet-ready table of weight, body fat %, waist, chest, arms, neck, and dates.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5"
                  onClick={handleExportMeasurementsCSV}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CSV</span>
                </Button>
              </div>

              {/* Daily Tracking CSV */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Daily Biometrics CSV</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Daily logs of steps, water, calories consumed, protein intake, sleep, and workouts.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5"
                  onClick={handleExportDailyLogsCSV}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CSV</span>
                </Button>
              </div>

              {/* Workout History CSV */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-purple-500 font-bold text-xs">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Workout History CSV</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Every workout session with duration, total volume (kg), sets, reps, and RPE.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5"
                  onClick={handleExportWorkoutsCSV}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CSV</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Privacy & Data Deletion Flow */}
          <div className="pt-3 border-t border-border space-y-3">
            <h4 className="font-bold text-rose-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone: Privacy & Data Deletion</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              Permanently wipe all locally cached check-ins, measurements, and daily logs. This action cannot be reversed.
            </p>

            {confirmDelete ? (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Are you absolutely sure you want to delete all your tracking data?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 text-xs"
                    onClick={handleResetData}
                  >
                    Yes, Permanently Wipe Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-500/30 gap-1.5"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Wipe / Reset Local Fitness Tracking Data</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
