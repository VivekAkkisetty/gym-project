import { z } from "zod";

export const trackingMoodSchema = z.enum([
  "great",
  "good",
  "neutral",
  "tired",
  "stressed",
]);

export type TrackingMood = z.infer<typeof trackingMoodSchema>;

export const weightCheckInSchema = z.object({
  weightKg: z
    .number()
    .min(25, "Weight must be at least 25 kg")
    .max(400, "Weight cannot exceed 400 kg"),
  recordedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .transform((val) => (val ? val.trim().replace(/<[^>]*>?/gm, "") : "")),
});

export type WeightCheckIn = z.infer<typeof weightCheckInSchema>;

export const bodyMeasurementsSchema = z.object({
  id: z.string().optional(),
  recordedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  weightKg: z.number().min(25).max(400),
  bodyFatPercentage: z.number().min(3).max(65).optional().nullable(),
  waistCm: z.number().min(30).max(250).optional().nullable(),
  chestCm: z.number().min(30).max(250).optional().nullable(),
  armsCm: z.number().min(15).max(100).optional().nullable(),
  thighsCm: z.number().min(20).max(150).optional().nullable(),
  hipsCm: z.number().min(30).max(250).optional().nullable(),
  neckCm: z.number().min(15).max(100).optional().nullable(),
  photoUrls: z.array(z.string().url().or(z.string())).default([]),
  notes: z
    .string()
    .max(1000)
    .optional()
    .transform((val) => (val ? val.trim().replace(/<[^>]*>?/gm, "") : "")),
});

export type BodyMeasurements = z.infer<typeof bodyMeasurementsSchema>;

export const dailyTrackingLogSchema = z.object({
  id: z.string().optional(),
  trackingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  stepsCount: z.number().int().min(0, "Steps must be positive").max(150000, "Step count exceeds realistic threshold"),
  waterIntakeMl: z.number().int().min(0, "Water intake must be positive").max(20000, "Water intake exceeds realistic threshold"),
  caloriesConsumed: z.number().int().min(0).max(20000),
  caloriesBurned: z.number().int().min(0).max(15000).default(0),
  proteinConsumedG: z.number().int().min(0).max(800),
  carbsConsumedG: z.number().int().min(0).max(2000).default(0),
  fatConsumedG: z.number().int().min(0).max(1000).default(0),
  sleepHours: z.number().min(0).max(24),
  workoutCompleted: z.boolean().default(false),
  mood: trackingMoodSchema.default("good"),
});

export type DailyTrackingLog = z.infer<typeof dailyTrackingLogSchema>;

export const progressPhotoUploadSchema = z.object({
  fileSize: z.number().max(5242880, "File size exceeds 5MB limit"),
  fileType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "Only JPEG, PNG, and WebP images are allowed",
  }),
});

export type ProgressPhotoUpload = z.infer<typeof progressPhotoUploadSchema>;
