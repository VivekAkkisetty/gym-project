import { BodyMeasurements, DailyTrackingLog, ProgressPhotoItem } from "@/types/tracking";
import { bodyMeasurementsSchema, dailyTrackingLogSchema } from "@/lib/validations/tracking";

const MEASUREMENTS_STORAGE_KEY = "apexfit_body_measurements";
const DAILY_TRACKING_STORAGE_KEY = "apexfit_daily_tracking_logs";
const PHOTOS_STORAGE_KEY = "apexfit_progress_photos";


export function getStoredMeasurements(): BodyMeasurements[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load measurements from storage:", err);
    return [];
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
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(DAILY_TRACKING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load daily logs from storage:", err);
    return [];
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
