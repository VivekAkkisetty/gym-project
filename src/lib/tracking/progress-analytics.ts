import { BodyMeasurements, DailyTrackingLog, WeeklySummaryMetrics, GoalProgressTargets } from "@/types/tracking";

/**
 * Calculates overall weight statistics: current, total change, 7-day delta, and 7-day average.
 */
export function calculateWeightStats(measurements: BodyMeasurements[]): {
  currentWeight: number;
  startingWeight: number;
  totalChangeKg: number;
  sevenDayAverage: number;
  sevenDayChangeKg: number;
} {
  if (measurements.length === 0) {
    return {
      currentWeight: 0,
      startingWeight: 0,
      totalChangeKg: 0,
      sevenDayAverage: 0,
      sevenDayChangeKg: 0,
    };
  }

  // Sort ascending by date
  const sorted = [...measurements].sort((a, b) => new Date(a.recordedDate).getTime() - new Date(b.recordedDate).getTime());
  const startingWeight = sorted[0].weightKg;
  const currentWeight = sorted[sorted.length - 1].weightKg;
  const totalChangeKg = Math.round((currentWeight - startingWeight) * 10) / 10;

  // 7-day rolling subset
  const recentSeven = sorted.slice(-7);
  const sevenDayAverage =
    Math.round((recentSeven.reduce((acc, m) => acc + m.weightKg, 0) / recentSeven.length) * 10) / 10;

  const compareWeight = recentSeven.length > 1 ? recentSeven[0].weightKg : startingWeight;
  const sevenDayChangeKg = Math.round((currentWeight - compareWeight) * 10) / 10;

  return {
    currentWeight,
    startingWeight,
    totalChangeKg,
    sevenDayAverage,
    sevenDayChangeKg,
  };
}

/**
 * Transforms measurements into a clean time-series array for the Weight Recharts AreaChart.
 */
export function getWeightChartData(measurements: BodyMeasurements[]): {
  date: string;
  weight: number;
  rollingAvg: number;
}[] {
  const sorted = [...measurements].sort((a, b) => new Date(a.recordedDate).getTime() - new Date(b.recordedDate).getTime());

  return sorted.map((m, idx, arr) => {
    // 3-point rolling average
    const start = Math.max(0, idx - 2);
    const subset = arr.slice(start, idx + 1);
    const rollingAvg = Math.round((subset.reduce((acc, cur) => acc + cur.weightKg, 0) / subset.length) * 10) / 10;

    return {
      date: formatDateLabel(m.recordedDate),
      weight: m.weightKg,
      rollingAvg,
    };
  });
}

/**
 * Transforms measurements into circumference time-series for the Waist & Body Circumferences LineChart.
 */
export function getCircumferenceChartData(measurements: BodyMeasurements[]): {
  date: string;
  waist: number | null;
  chest: number | null;
  arms: number | null;
  neck: number | null;
}[] {
  const sorted = [...measurements].sort((a, b) => new Date(a.recordedDate).getTime() - new Date(b.recordedDate).getTime());

  return sorted.map((m) => ({
    date: formatDateLabel(m.recordedDate),
    waist: m.waistCm || null,
    chest: m.chestCm || null,
    arms: m.armsCm || null,
    neck: m.neckCm || null,
  }));
}

/**
 * Transforms daily tracking logs into time-series data for Calories Consumed vs Target BarChart.
 */
export function getCaloriesChartData(logs: DailyTrackingLog[], targetCalories = 2400): {
  date: string;
  calories: number;
  target: number;
  burned: number;
}[] {
  const sorted = [...logs].sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime()).slice(-14);

  return sorted.map((log) => ({
    date: formatDateLabel(log.trackingDate),
    calories: log.caloriesConsumed,
    target: targetCalories,
    burned: log.caloriesBurned,
  }));
}

/**
 * Transforms daily tracking logs into time-series data for Protein Consumed vs Target AreaChart.
 */
export function getProteinChartData(logs: DailyTrackingLog[], targetProteinG = 160): {
  date: string;
  protein: number;
  target: number;
}[] {
  const sorted = [...logs].sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime()).slice(-14);

  return sorted.map((log) => ({
    date: formatDateLabel(log.trackingDate),
    protein: log.proteinConsumedG,
    target: targetProteinG,
  }));
}

/**
 * Transforms daily tracking logs into Step Count vs Goal BarChart.
 */
export function getStepsChartData(logs: DailyTrackingLog[], stepGoal = 10000): {
  date: string;
  steps: number;
  goal: number;
}[] {
  const sorted = [...logs].sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime()).slice(-14);

  return sorted.map((log) => ({
    date: formatDateLabel(log.trackingDate),
    steps: log.stepsCount,
    goal: stepGoal,
  }));
}

/**
 * Transforms daily logs into Workout Consistency weekly heat points.
 */
export function getWorkoutConsistencyChartData(logs: DailyTrackingLog[]): {
  date: string;
  dayName: string;
  completed: boolean;
  value: number; // 1 or 0 for charting
}[] {
  const sorted = [...logs].sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime()).slice(-14);

  return sorted.map((log) => {
    const d = new Date(log.trackingDate);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    return {
      date: formatDateLabel(log.trackingDate),
      dayName,
      completed: log.workoutCompleted,
      value: log.workoutCompleted ? 1 : 0,
    };
  });
}

/**
 * Generates structured weekly statistics summary.
 */
export function generateWeeklySummary(
  logs: DailyTrackingLog[],
  measurements: BodyMeasurements[]
): WeeklySummaryMetrics {
  const recentLogs = [...logs].sort((a, b) => new Date(b.trackingDate).getTime() - new Date(a.trackingDate).getTime()).slice(0, 7);
  const sortedMeasurements = [...measurements].sort((a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime());

  const count = Math.max(1, recentLogs.length);
  const completedWorkouts = recentLogs.filter((l) => l.workoutCompleted).length;
  const averageSteps = Math.round(recentLogs.reduce((acc, l) => acc + l.stepsCount, 0) / count);
  const averageWaterMl = Math.round(recentLogs.reduce((acc, l) => acc + l.waterIntakeMl, 0) / count);
  const averageProteinG = Math.round(recentLogs.reduce((acc, l) => acc + l.proteinConsumedG, 0) / count);
  const averageCalories = Math.round(recentLogs.reduce((acc, l) => acc + l.caloriesConsumed, 0) / count);

  const endWeightKg = sortedMeasurements.length > 0 ? sortedMeasurements[0].weightKg : 80;
  const startWeightKg = sortedMeasurements.length > 6 ? sortedMeasurements[6].weightKg : sortedMeasurements[sortedMeasurements.length - 1]?.weightKg || endWeightKg;
  const weightChangeKg = Math.round((endWeightKg - startWeightKg) * 10) / 10;
  const workoutConsistencyPercent = Math.min(100, Math.round((completedWorkouts / 4) * 100)); // assumes 4 workouts/week goal

  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 86400000);

  return {
    weekLabel: "Past 7 Days",
    startDate: weekStart.toISOString().split("T")[0],
    endDate: now.toISOString().split("T")[0],
    completedWorkouts,
    averageSteps,
    averageWaterMl,
    averageProteinG,
    averageCalories,
    startWeightKg,
    endWeightKg,
    weightChangeKg,
    workoutConsistencyPercent,
  };
}

/**
 * Calculates progress percentages toward all target goals.
 */
export function calculateGoalProgress(
  targets: GoalProgressTargets,
  latestLog?: DailyTrackingLog,
  weeklyWorkouts = 0
): {
  weightProgressPercent: number;
  proteinProgressPercent: number;
  stepProgressPercent: number;
  waterProgressPercent: number;
  workoutProgressPercent: number;
} {
  const { startWeightKg, targetWeightKg, currentWeightKg, dailyProteinGoalG, dailyStepGoal, dailyWaterGoalMl, weeklyWorkoutGoal } = targets;

  // Weight progress
  let weightProgressPercent = 0;
  const totalWeightDistance = Math.abs(startWeightKg - targetWeightKg);
  if (totalWeightDistance > 0) {
    const currentDistance = Math.abs(currentWeightKg - targetWeightKg);
    weightProgressPercent = Math.min(100, Math.max(0, Math.round(((totalWeightDistance - currentDistance) / totalWeightDistance) * 100)));
  } else {
    weightProgressPercent = 100;
  }

  const currentProtein = latestLog ? latestLog.proteinConsumedG : 0;
  const proteinProgressPercent = Math.min(100, Math.round((currentProtein / Math.max(1, dailyProteinGoalG)) * 100));

  const currentSteps = latestLog ? latestLog.stepsCount : 0;
  const stepProgressPercent = Math.min(100, Math.round((currentSteps / Math.max(1, dailyStepGoal)) * 100));

  const currentWater = latestLog ? latestLog.waterIntakeMl : 0;
  const waterProgressPercent = Math.min(100, Math.round((currentWater / Math.max(1, dailyWaterGoalMl)) * 100));

  const workoutProgressPercent = Math.min(100, Math.round((weeklyWorkouts / Math.max(1, weeklyWorkoutGoal)) * 100));

  return {
    weightProgressPercent,
    proteinProgressPercent,
    stepProgressPercent,
    waterProgressPercent,
    workoutProgressPercent,
  };
}

function formatDateLabel(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return isoDate;
  }
}
