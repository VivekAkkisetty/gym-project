import { BodyMeasurements, DailyTrackingLog, ExportDataPackage } from "@/types/tracking";
import { DietPlan } from "@/lib/validations/nutrition";
import { CompletedWorkoutSession } from "@/types/workout";

/**
 * Builds a complete structured JSON export package of all user fitness data.
 */
export function buildExportPackage(
  measurements: BodyMeasurements[],
  logs: DailyTrackingLog[],
  dietPlans: DietPlan[],
  workouts: CompletedWorkoutSession[],
  username = "User"
): ExportDataPackage {
  return {
    exportedAt: new Date().toISOString(),
    user: { username },
    progressMeasurements: measurements,
    dailyTrackingLogs: logs,
    dietPlans,
    completedWorkouts: workouts,
  };
}

/**
 * Converts Body Measurements array into CSV formatted string.
 */
export function measurementsToCSV(measurements: BodyMeasurements[]): string {
  const headers = [
    "Date",
    "Weight (kg)",
    "Body Fat (%)",
    "Waist (cm)",
    "Chest (cm)",
    "Arms (cm)",
    "Thighs (cm)",
    "Hips (cm)",
    "Neck (cm)",
    "Notes",
  ];

  const rows = measurements.map((m) => [
    m.recordedDate,
    m.weightKg,
    m.bodyFatPercentage ?? "",
    m.waistCm ?? "",
    m.chestCm ?? "",
    m.armsCm ?? "",
    m.thighsCm ?? "",
    m.hipsCm ?? "",
    m.neckCm ?? "",
    `"${(m.notes || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Converts Daily Tracking Logs array into CSV formatted string.
 */
export function dailyTrackingToCSV(logs: DailyTrackingLog[]): string {
  const headers = [
    "Date",
    "Steps",
    "Water (ml)",
    "Calories Consumed",
    "Calories Burned",
    "Protein (g)",
    "Carbs (g)",
    "Fat (g)",
    "Sleep (hrs)",
    "Workout Completed",
    "Mood",
  ];

  const rows = logs.map((l) => [
    l.trackingDate,
    l.stepsCount,
    l.waterIntakeMl,
    l.caloriesConsumed,
    l.caloriesBurned,
    l.proteinConsumedG,
    l.carbsConsumedG,
    l.fatConsumedG,
    l.sleepHours,
    l.workoutCompleted ? "Yes" : "No",
    l.mood,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Converts Workout Sessions array into CSV formatted string.
 */
export function workoutHistoryToCSV(workouts: CompletedWorkoutSession[]): string {
  const headers = [
    "Date",
    "Routine Title",
    "Split",
    "Duration (mins)",
    "Total Volume (kg)",
    "Total Sets",
    "Total Reps",
    "RPE",
    "Personal Records Hit",
    "Notes",
  ];

  const rows = workouts.map((w) => [
    new Date(w.completedAt).toISOString().split("T")[0],
    `"${w.title.replace(/"/g, '""')}"`,
    `"${w.splitName.replace(/"/g, '""')}"`,
    Math.round(w.durationSeconds / 60),
    w.totalVolumeKg,
    w.totalSets,
    w.totalReps,
    w.rpe ?? "",
    w.personalRecordsCount ?? 0,
    `"${(w.notes || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Initiates browser download of raw text content as file.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
