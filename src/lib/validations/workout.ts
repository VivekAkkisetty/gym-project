import { z } from "zod";

export const workoutGoalSchema = z.enum([
  "muscle_gain",
  "fat_loss",
  "strength",
  "general_fitness",
  "beginner_fitness",
  "body_recomposition",
]);

export type WorkoutGoal = z.infer<typeof workoutGoalSchema>;

export const splitTypeSchema = z.enum([
  "full_body",
  "upper_lower",
  "push_pull_legs",
  "bro_split",
  "3_day",
  "4_day",
  "5_day",
  "6_day",
  "home_workout",
  "core_workout",
]);

export type SplitType = z.infer<typeof splitTypeSchema>;

export const muscleGroupSchema = z.enum([
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs",
  "Forearms",
]);

export type MuscleGroup = z.infer<typeof muscleGroupSchema>;

export const equipmentSchema = z.enum([
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "bodyweight",
  "bands",
  "kettlebell",
]);

export type EquipmentType = z.infer<typeof equipmentSchema>;

export const exerciseDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export type ExerciseDifficulty = z.infer<typeof exerciseDifficultySchema>;

export const workoutGeneratorInputSchema = z.object({
  goal: workoutGoalSchema,
  experience: exerciseDifficultySchema,
  daysPerWeek: z.number().int().min(3).max(6),
  availableEquipment: z.array(equipmentSchema).min(1),
  targetMuscles: z.array(muscleGroupSchema).optional(),
  sessionDurationMinutes: z.union([
    z.literal(30),
    z.literal(45),
    z.literal(60),
    z.literal(90),
  ]),
});

export type WorkoutGeneratorInput = z.infer<typeof workoutGeneratorInputSchema>;

export const sessionSetSchema = z.object({
  setNumber: z.number().int().min(1).max(30),
  previousWeightKg: z.number().min(0).max(1000).optional(),
  previousReps: z.number().int().min(0).max(300).optional(),
  weightKg: z.number().min(0).max(1000),
  reps: z.number().int().min(0).max(300),
  isCompleted: z.boolean(),
  isWarmup: z.boolean().default(false),
  rpe: z.number().min(1).max(10).optional(),
});

export type SessionSet = z.infer<typeof sessionSetSchema>;

export const sessionExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  exerciseName: z.string().min(1),
  muscleGroup: muscleGroupSchema,
  secondaryMuscles: z.array(z.string()).default([]),
  equipment: equipmentSchema,
  restTimeSeconds: z.number().int().min(15).max(600).default(90),
  targetSets: z.number().int().min(1).max(10).default(3),
  targetReps: z.string().default("8-12"),
  sets: z.array(sessionSetSchema),
});

export type SessionExercise = z.infer<typeof sessionExerciseSchema>;

export const completedWorkoutSessionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  splitName: z.string().min(1).max(120),
  durationSeconds: z.number().int().min(0).max(86400),
  startedAt: z.string().datetime({ offset: true }).or(z.string()),
  completedAt: z.string().datetime({ offset: true }).or(z.string()),
  totalVolumeKg: z.number().min(0),
  totalSets: z.number().int().min(0),
  totalReps: z.number().int().min(0),
  exercises: z.array(sessionExerciseSchema),
  notes: z
    .string()
    .max(2000)
    .optional()
    .transform((val) => (val ? val.trim().replace(/<[^>]*>?/gm, "") : "")), // Basic HTML tag stripping
  rpe: z.number().int().min(1).max(10).optional(),
  personalRecordsCount: z.number().int().min(0).default(0),
});

export type CompletedWorkoutSession = z.infer<typeof completedWorkoutSessionSchema>;
