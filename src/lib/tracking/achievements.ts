import { AchievementItem, DailyTrackingLog, BodyMeasurements } from "@/types/tracking";
import { CompletedWorkoutSession } from "@/types/workout";

export const MASTER_ACHIEVEMENTS: Omit<AchievementItem, "unlockedAt" | "progressPercent" | "metricCurrent">[] = [
  {
    id: "ach-streak-7",
    title: "7-Day Tracking Streak",
    description: "Logged daily biometrics or nutrition for 7 consecutive days without skipping.",
    iconName: "Flame",
    category: "consistency",
    metricTarget: 7,
    unit: "days",
  },
  {
    id: "ach-workouts-10",
    title: "Iron Discipline (10 Workouts)",
    description: "Completed 10 full strength or conditioning workout sessions.",
    iconName: "Dumbbell",
    category: "milestone",
    metricTarget: 10,
    unit: "workouts",
  },
  {
    id: "ach-steps-100k",
    title: "Centurion (100k Steps)",
    description: "Accumulated 100,000 total steps towards cardiovascular health.",
    iconName: "Footprints",
    category: "habits",
    metricTarget: 100000,
    unit: "steps",
  },
  {
    id: "ach-protein-5d",
    title: "Protein Precision",
    description: "Reached your target daily protein requirement on 5 or more days.",
    iconName: "Target",
    category: "nutrition",
    metricTarget: 5,
    unit: "days",
  },
  {
    id: "ach-hydration-5d",
    title: "Hydration Master",
    description: "Drank at least 3,000 ml of water for 5 days.",
    iconName: "Droplets",
    category: "habits",
    metricTarget: 5,
    unit: "days",
  },
  {
    id: "ach-checkins-10",
    title: "Data Champion (10 Check-ins)",
    description: "Logged 10 body weight or circumference progress updates.",
    iconName: "Calendar",
    category: "milestone",
    metricTarget: 10,
    unit: "check-ins",
  },
];

/**
 * Evaluates user tracking data against master achievements to calculate real progress percentages and unlock status.
 */
export function evaluateAchievements(
  logs: DailyTrackingLog[],
  workouts: CompletedWorkoutSession[],
  measurements: BodyMeasurements[],
  targetProteinG = 160
): AchievementItem[] {
  // 1. Calculate consecutive streak
  const sortedDates = [...logs]
    .map((l) => l.trackingDate)
    .sort()
    .reverse();

  let streak = 0;
  if (sortedDates.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const logDate = new Date(sortedDates[i]);
      logDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= i + 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  // 2. Total completed workouts
  const totalWorkouts = workouts.length;

  // 3. Total steps accumulated
  const totalSteps = logs.reduce((acc, l) => acc + l.stepsCount, 0);

  // 4. Days protein goal was achieved
  const proteinDays = logs.filter((l) => l.proteinConsumedG >= targetProteinG).length;

  // 5. Days hydration was 3000ml+
  const hydrationDays = logs.filter((l) => l.waterIntakeMl >= 3000).length;

  // 6. Measurements check-ins count
  const checkInsCount = measurements.length;

  return MASTER_ACHIEVEMENTS.map((ach) => {
    let metricCurrent = 0;

    if (ach.id === "ach-streak-7") metricCurrent = streak;
    else if (ach.id === "ach-workouts-10") metricCurrent = totalWorkouts;
    else if (ach.id === "ach-steps-100k") metricCurrent = totalSteps;
    else if (ach.id === "ach-protein-5d") metricCurrent = proteinDays;
    else if (ach.id === "ach-hydration-5d") metricCurrent = hydrationDays;
    else if (ach.id === "ach-checkins-10") metricCurrent = checkInsCount;

    const progressPercent = Math.min(100, Math.round((metricCurrent / ach.metricTarget) * 100));
    const isUnlocked = progressPercent >= 100;

    return {
      ...ach,
      metricCurrent,
      progressPercent,
      unlockedAt: isUnlocked ? "Unlocked" : null,
    };
  });
}
