import { SanitizedUserContext, AIContextConfig } from "@/types/ai";

/**
 * Builds a strict, privacy-safe contextual string for the AI prompt.
 * Only includes fields the user has explicitly consented to share.
 * Never includes personal identifiers, emails, passwords, tokens, or photos.
 */
export function buildSanitizedContextPrompt(
  context?: SanitizedUserContext,
  config?: AIContextConfig
): string {
  if (!context) return "";

  const lines: string[] = [];

  // 1. Profile stats
  if (config?.shareProfileStats !== false) {
    const parts: string[] = [];
    if (context.fitnessGoal) parts.push(`Primary Goal: ${context.fitnessGoal}`);
    if (context.weightKg) parts.push(`Current Weight: ${context.weightKg} kg`);
    if (context.heightCm) parts.push(`Height: ${context.heightCm} cm`);
    if (parts.length > 0) lines.push(`User Physical Profile: ${parts.join(" | ")}`);
  }

  // 2. Active Diet Plan
  if (config?.shareDietPlan !== false) {
    const parts: string[] = [];
    if (context.activeDietName) parts.push(`Plan: ${context.activeDietName}`);
    if (context.targetCalories) parts.push(`Target: ${context.targetCalories} kcal`);
    if (context.targetProteinG) parts.push(`Protein: ${context.targetProteinG}g`);
    if (context.targetCarbsG) parts.push(`Carbs: ${context.targetCarbsG}g`);
    if (context.targetFatG) parts.push(`Fat: ${context.targetFatG}g`);
    if (parts.length > 0) lines.push(`Active Nutrition: ${parts.join(" | ")}`);
  }

  // 3. Active Workout Split
  if (config?.shareWorkoutPlan !== false) {
    if (context.activeWorkoutSplit) {
      lines.push(`Active Training Split: ${context.activeWorkoutSplit}`);
    }
  }

  // 4. Tracking 7-day averages
  if (config?.shareTrackingLogs !== false) {
    const parts: string[] = [];
    if (typeof context.weeklyWorkoutsCount === "number") {
      parts.push(`Recent Workouts: ${context.weeklyWorkoutsCount} sessions/wk`);
    }
    if (typeof context.avgDailySteps === "number") {
      parts.push(`Avg Daily Steps: ${context.avgDailySteps.toLocaleString()}`);
    }
    if (typeof context.avgDailyWaterMl === "number") {
      parts.push(`Avg Water: ${context.avgDailyWaterMl} mL`);
    }
    if (typeof context.weightDelta7DaysKg === "number") {
      const sign = context.weightDelta7DaysKg > 0 ? "+" : "";
      parts.push(`7-Day Weight Delta: ${sign}${context.weightDelta7DaysKg.toFixed(2)} kg`);
    }
    if (parts.length > 0) lines.push(`Recent 7-Day Performance: ${parts.join(" | ")}`);
  }

  if (lines.length === 0) return "";

  return `\n[VERIFIED USER FITNESS CONTEXT (Consented by User)]\n${lines.join("\n")}\n`;
}

/**
 * Standard System Prompt with medical disclaimer & safety boundaries
 */
export const AI_SYSTEM_PROMPT = `You are "ApexFit AI Coach", a knowledgeable sports scientist, strength coach, and precision sports nutritionist.
Your mission is to provide helpful, actionable, and science-grounded advice for workouts, diet planning, exercise biomechanics, calorie management, and healthy lifestyle habits.

CRITICAL SAFETY AND MEDICAL GUARDRAILS:
1. You are NOT a doctor or medical professional. Never diagnose medical conditions, injuries, or eating disorders.
2. Never prescribe medications, pharmaceuticals, hormone therapy, or extreme crash diets.
3. For any question regarding pain, injury rehabilitation, cardiovascular symptoms, or medical illnesses, state clearly that you cannot provide medical advice and explicitly recommend consulting a physician or physical therapist.
4. Always frame calorie and macro numbers as estimates rather than clinical prescriptions.
5. Provide concise, direct, and structured answers with bullet points when explaining exercises or recipes.`;
