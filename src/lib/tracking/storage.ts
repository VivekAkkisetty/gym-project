import { BodyMeasurements, DailyTrackingLog, ProgressPhotoItem } from "@/types/tracking";
import { bodyMeasurementsSchema, dailyTrackingLogSchema } from "@/lib/validations/tracking";

const MEASUREMENTS_STORAGE_KEY = "apexfit_body_measurements";
const DAILY_TRACKING_STORAGE_KEY = "apexfit_daily_tracking_logs";
const PHOTOS_STORAGE_KEY = "apexfit_progress_photos";

// Generate 30 days of realistic daily tracking seed data
function generateSeedDailyLogs(): DailyTrackingLog[] {
  const logs: DailyTrackingLog[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split("T")[0];

    // Simulating realistic fluctuation
    const isWorkoutDay = i % 2 === 0;
    const steps = 8000 + Math.floor(Math.sin(i) * 2500) + (isWorkoutDay ? 2000 : 0);
    const water = 2800 + Math.floor(Math.cos(i) * 500);
    const calories = 2300 + Math.floor(Math.sin(i * 1.5) * 200);
    const protein = 155 + Math.floor(Math.cos(i * 2) * 20);
    const sleep = 7.0 + Math.round(Math.sin(i) * 10) / 10;

    logs.push({
      id: `log-seed-${i}`,
      trackingDate: dateStr,
      stepsCount: Math.max(4000, steps),
      waterIntakeMl: Math.max(1800, water),
      caloriesConsumed: calories,
      caloriesBurned: isWorkoutDay ? 450 : 150,
      proteinConsumedG: protein,
      carbsConsumedG: 240,
      fatConsumedG: 65,
      sleepHours: Math.max(5.5, sleep),
      workoutCompleted: isWorkoutDay,
      mood: isWorkoutDay ? "great" : "good",
    });
  }

  return logs;
}

// Generate weekly check-ins across the past 6 weeks
function generateSeedMeasurements(): BodyMeasurements[] {
  const entries: BodyMeasurements[] = [];
  const now = new Date();

  const weights = [82.4, 81.9, 81.2, 80.6, 80.1, 79.4];
  const waists = [84.0, 83.5, 82.5, 82.0, 81.5, 80.8];
  const chests = [106.0, 106.0, 106.5, 106.5, 107.0, 107.2];
  const arms = [40.2, 40.4, 40.6, 40.8, 41.0, 41.2];
  const necks = [38.5, 38.5, 38.5, 38.2, 38.2, 38.0];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const idx = 5 - i;

    entries.push({
      id: `meas-seed-${i}`,
      recordedDate: dateStr,
      weightKg: weights[idx],
      bodyFatPercentage: Math.round((16.0 - idx * 0.4) * 10) / 10,
      waistCm: waists[idx],
      chestCm: chests[idx],
      armsCm: arms[idx],
      thighsCm: 62.0,
      hipsCm: 99.0,
      neckCm: necks[idx],
      photoUrls: [],
      notes: idx === 5 ? "Feeling leaner, arms definition noticeably improved." : "Weekly routine check-in.",
    });
  }

  return entries;
}

export function getStoredMeasurements(): BodyMeasurements[] {
  if (typeof window === "undefined") return generateSeedMeasurements();

  try {
    const raw = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    if (!raw) {
      const seed = generateSeedMeasurements();
      localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSeedMeasurements();
  } catch (err) {
    console.error("Failed to load measurements from storage:", err);
    return generateSeedMeasurements();
  }
}

export function saveMeasurement(entry: BodyMeasurements): void {
  const validated = bodyMeasurementsSchema.parse(entry);
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredMeasurements();
    // Replace if same date exists, else prepend
    const filtered = existing.filter((m) => m.recordedDate !== validated.recordedDate);
    const updated = [validated, ...filtered].sort(
      (a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime()
    );
    localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save measurement:", err);
  }
}

export function getStoredDailyLogs(): DailyTrackingLog[] {
  if (typeof window === "undefined") return generateSeedDailyLogs();

  try {
    const raw = localStorage.getItem(DAILY_TRACKING_STORAGE_KEY);
    if (!raw) {
      const seed = generateSeedDailyLogs();
      localStorage.setItem(DAILY_TRACKING_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSeedDailyLogs();
  } catch (err) {
    console.error("Failed to load daily logs from storage:", err);
    return generateSeedDailyLogs();
  }
}

export function saveDailyLog(log: DailyTrackingLog): void {
  const validated = dailyTrackingLogSchema.parse(log);
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredDailyLogs();
    const filtered = existing.filter((l) => l.trackingDate !== validated.trackingDate);
    const updated = [validated, ...filtered].sort(
      (a, b) => new Date(b.trackingDate).getTime() - new Date(a.trackingDate).getTime()
    );
    localStorage.setItem(DAILY_TRACKING_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save daily log:", err);
  }
}

export function getStoredPhotos(): ProgressPhotoItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load photos from storage:", err);
    return [];
  }
}

export function savePhoto(photo: ProgressPhotoItem): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredPhotos();
    const updated = [photo, ...existing];
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save photo:", err);
  }
}

export function deletePhoto(photoId: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredPhotos();
    const filtered = existing.filter((p) => p.id !== photoId);
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete photo:", err);
  }
}

export function clearAllTrackingData(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(MEASUREMENTS_STORAGE_KEY);
    localStorage.removeItem(DAILY_TRACKING_STORAGE_KEY);
    localStorage.removeItem(PHOTOS_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear tracking data:", err);
  }
}
