/**
 * Strength analytics and One-Rep Maximum (1RM) formulas.
 * Implements validated kinesiology estimation models.
 */

export interface OneRepMaxResult {
  oneRepMax: number;
  brzycki: number;
  epley: number;
  percentages: { percentage: number; reps: number; weight: number }[];
}

/**
 * Calculates estimated One-Rep Maximum using Brzycki formula.
 * Formula: Weight / (1.0278 - (0.0278 * Reps))
 */
export function calculateBrzycki1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  if (reps >= 36) return Math.round(weightKg * 2);
  const result = weightKg / (1.0278 - 0.0278 * reps);
  return Number(result.toFixed(1));
}

/**
 * Calculates estimated One-Rep Maximum using Epley formula.
 * Formula: Weight * (1 + 0.0333 * Reps)
 */
export function calculateEpley1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  const result = weightKg * (1 + 0.0333 * reps);
  return Number(result.toFixed(1));
}

/**
 * Computes comprehensive 1RM analysis including multi-formula average and training percentages.
 */
export function calculateOneRepMax(
  weightKg: number,
  reps: number
): OneRepMaxResult {
  const brzycki = calculateBrzycki1RM(weightKg, reps);
  const epley = calculateEpley1RM(weightKg, reps);
  const average1RM = Number(((brzycki + epley) / 2).toFixed(1));

  const percentageTable = [
    { percentage: 100, reps: 1 },
    { percentage: 95, reps: 2 },
    { percentage: 90, reps: 4 },
    { percentage: 85, reps: 6 },
    { percentage: 80, reps: 8 },
    { percentage: 75, reps: 10 },
    { percentage: 70, reps: 12 },
    { percentage: 65, reps: 15 },
  ];

  const percentages = percentageTable.map((item) => ({
    ...item,
    weight: Number(((average1RM * item.percentage) / 100).toFixed(1)),
  }));

  return {
    oneRepMax: average1RM,
    brzycki,
    epley,
    percentages,
  };
}
