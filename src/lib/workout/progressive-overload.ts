import { CompletedWorkoutSession, PersonalRecord, ProgressiveOverloadEntry } from "@/types/workout";

/**
 * Calculates estimated 1 Rep Max using the scientifically validated Epley formula:
 * 1RM = Weight * (1 + Reps / 30)
 */
export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  const raw = weightKg * (1 + reps / 30);
  return Math.round(raw * 10) / 10;
}

/**
 * Analyzes completed workout sessions to extract personal records per exercise.
 */
export function extractPersonalRecords(sessions: CompletedWorkoutSession[]): PersonalRecord[] {
  const recordsMap = new Map<string, { maxWeight: number; max1RM: number; maxVolume: number; latestDate: string; name: string }>();

  sessions.forEach((session) => {
    session.exercises.forEach((ex) => {
      let current = recordsMap.get(ex.exerciseId);
      if (!current) {
        current = { maxWeight: 0, max1RM: 0, maxVolume: 0, latestDate: session.completedAt, name: ex.exerciseName };
        recordsMap.set(ex.exerciseId, current);
      }

      let exerciseVolume = 0;
      ex.sets.forEach((set) => {
        if (!set.isCompleted) return;
        if (set.weightKg > current!.maxWeight) {
          current!.maxWeight = set.weightKg;
          current!.latestDate = session.completedAt;
        }
        const est1RM = calculateEstimated1RM(set.weightKg, set.reps);
        if (est1RM > current!.max1RM) {
          current!.max1RM = est1RM;
        }
        exerciseVolume += set.weightKg * set.reps;
      });

      if (exerciseVolume > current.maxVolume) {
        current.maxVolume = exerciseVolume;
      }
    });
  });

  const prList: PersonalRecord[] = [];
  recordsMap.forEach((rec, exerciseId) => {
    if (rec.maxWeight > 0) {
      prList.push({
        exerciseId,
        exerciseName: rec.name,
        recordType: "max_weight",
        value: rec.maxWeight,
        unit: "kg",
        achievedAt: rec.latestDate,
      });
    }
    if (rec.max1RM > 0) {
      prList.push({
        exerciseId,
        exerciseName: rec.name,
        recordType: "estimated_1rm",
        value: rec.max1RM,
        unit: "kg",
        achievedAt: rec.latestDate,
      });
    }
  });

  return prList;
}

/**
 * Generates actionable progressive overload advice for an exercise based on previous performance.
 */
export function getOverloadRecommendation(
  exerciseId: string,
  exerciseName: string,
  muscleGroup: string,
  lastWeightKg: number,
  lastReps: number
): ProgressiveOverloadEntry {
  // If lower body compound (legs/back), increment is typically 2.5-5kg; upper body is 1-2.5kg
  const isLowerBody = ["Quads", "Hamstrings", "Glutes", "Back"].includes(muscleGroup);
  const increment = isLowerBody ? 5 : 2.5;

  let suggestedWeightKg = lastWeightKg;
  let suggestedReps = "8-10";
  let rationale = "";

  if (lastReps >= 12) {
    suggestedWeightKg = lastWeightKg + increment;
    suggestedReps = "8-10";
    rationale = `You hit ${lastReps} reps! Progressive Overload recommends jumping up by +${increment} kg and building back up.`;
  } else if (lastReps >= 8) {
    suggestedWeightKg = lastWeightKg;
    suggestedReps = `${lastReps + 1}-12`;
    rationale = `Solid performance! Maintain ${lastWeightKg} kg and aim for +1 rep before increasing weight.`;
  } else {
    suggestedWeightKg = lastWeightKg;
    suggestedReps = "8-10";
    rationale = `Stick to ${lastWeightKg} kg. Focus on strict eccentric tempo (3 seconds down) until you comfortably hit 8+ reps.`;
  }

  return {
    exerciseId,
    exerciseName,
    lastWeightKg,
    lastReps,
    suggestedWeightKg,
    suggestedReps,
    rationale,
  };
}

/**
 * Computes weekly workout metrics: total sessions, volume in kg, sets, and duration in minutes.
 */
export function calculateWeeklyMetrics(sessions: CompletedWorkoutSession[]): {
  weeklyCount: number;
  totalVolumeKg: number;
  totalSets: number;
  totalDurationMinutes: number;
} {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentSessions = sessions.filter((s) => new Date(s.completedAt) >= oneWeekAgo);

  const weeklyCount = recentSessions.length;
  const totalVolumeKg = recentSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const totalSets = recentSessions.reduce((acc, s) => acc + s.totalSets, 0);
  const totalDurationMinutes = Math.round(
    recentSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

  return {
    weeklyCount,
    totalVolumeKg,
    totalSets,
    totalDurationMinutes,
  };
}
