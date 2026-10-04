/**
 * Global application metadata and configuration constants.
 */

export const APP_CONFIG = {
  name: "ApexFit",
  fullName: "ApexFit Platform",
  tagline: "High-Performance Nutrition, Training & Physique Analytics",
  description:
    "Evidence-based fitness engine for macro tracking, hypertrophy programming, and physique analytics.",
  version: "1.0.0",
  author: "ApexFit Athletics",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const DEFAULT_MACRO_TARGETS = {
  calories: 2500,
  proteinG: 160,
  carbsG: 280,
  fatG: 70,
  waterMl: 3000,
  steps: 10000,
} as const;
