import { EXERCISE_DATABASE } from "./exercises-data";
import {
  WorkoutGeneratorInput,
  WorkoutGoal,
  MuscleGroup,
  ExerciseDifficulty,
} from "@/lib/validations/workout";
import { WorkoutSplitPlan, WorkoutRoutine, RoutineExercise, ExerciseItem } from "@/types/workout";

export function generateCustomWorkoutPlan(input: WorkoutGeneratorInput): WorkoutSplitPlan {
  const { goal, experience, daysPerWeek, availableEquipment, targetMuscles, sessionDurationMinutes } = input;

  // Filter exercises compatible with available equipment
  const validExercises = EXERCISE_DATABASE.filter((ex) => {
    // If equipment is available
    if (availableEquipment.includes(ex.equipment)) return true;
    // Bodyweight is always valid unless explicitly unsupported
    if (ex.isBodyweight && availableEquipment.includes("bodyweight")) return true;
    return false;
  });

  // Target exercise count based on duration
  const exerciseCount =
    sessionDurationMinutes === 30 ? 4 : sessionDurationMinutes === 45 ? 5 : sessionDurationMinutes === 60 ? 6 : 8;

  // Determine rep scheme and rest intervals based on goal
  const { defaultSets, repRange, restMultiplier } = getGoalParameters(goal, experience);

  // Determine split type and routine blueprints based on days per week
  let splitType: WorkoutSplitPlan["splitType"] = "full_body";
  let routineBlueprints: {
    dayLabel: string;
    name: string;
    muscles: MuscleGroup[];
  }[] = [];

  if (daysPerWeek === 3) {
    splitType = "full_body";
    routineBlueprints = [
      { dayLabel: "Day 1 • Monday", name: "Full Body A: Squat & Horizontal Focus", muscles: ["Quads", "Chest", "Back", "Abs"] },
      { dayLabel: "Day 2 • Wednesday", name: "Full Body B: Hinge & Vertical Push/Pull", muscles: ["Hamstrings", "Back", "Shoulders", "Biceps"] },
      { dayLabel: "Day 3 • Friday", name: "Full Body C: Unilateral & Arm Focus", muscles: ["Glutes", "Chest", "Back", "Triceps", "Abs"] },
    ];
  } else if (daysPerWeek === 4) {
    splitType = "upper_lower";
    routineBlueprints = [
      { dayLabel: "Day 1 • Monday", name: "Upper Body Power: Chest & Back", muscles: ["Chest", "Back", "Shoulders", "Triceps"] },
      { dayLabel: "Day 2 • Tuesday", name: "Lower Body Power: Squats & Posterior", muscles: ["Quads", "Hamstrings", "Calves", "Abs"] },
      { dayLabel: "Day 3 • Thursday", name: "Upper Body Hypertrophy: Delts & Arms", muscles: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"] },
      { dayLabel: "Day 4 • Friday", name: "Lower Body Hypertrophy: Glutes & Quads", muscles: ["Glutes", "Quads", "Hamstrings", "Calves", "Abs"] },
    ];
  } else if (daysPerWeek === 5) {
    splitType = "bro_split";
    routineBlueprints = [
      { dayLabel: "Day 1 • Monday", name: "Chest & Front Delts Specialization", muscles: ["Chest", "Shoulders"] },
      { dayLabel: "Day 2 • Tuesday", name: "Back Thickness & Lat Width", muscles: ["Back", "Forearms"] },
      { dayLabel: "Day 3 • Wednesday", name: "Shoulders 3D & Core Armor", muscles: ["Shoulders", "Abs"] },
      { dayLabel: "Day 4 • Thursday", name: "Lower Body & Glute Dynamics", muscles: ["Quads", "Hamstrings", "Glutes", "Calves"] },
      { dayLabel: "Day 5 • Friday", name: "Biceps & Triceps Arm Day", muscles: ["Biceps", "Triceps", "Forearms"] },
    ];
  } else {
    // 6 days - PPL
    splitType = "push_pull_legs";
    routineBlueprints = [
      { dayLabel: "Day 1 • Monday", name: "Push A: Chest, Shoulders & Triceps", muscles: ["Chest", "Shoulders", "Triceps"] },
      { dayLabel: "Day 2 • Tuesday", name: "Pull A: Back, Rear Delts & Biceps", muscles: ["Back", "Biceps", "Forearms"] },
      { dayLabel: "Day 3 • Wednesday", name: "Legs A: Quad Focus & Calves", muscles: ["Quads", "Glutes", "Calves", "Abs"] },
      { dayLabel: "Day 4 • Thursday", name: "Push B: Overhead Press & Incline", muscles: ["Shoulders", "Chest", "Triceps"] },
      { dayLabel: "Day 5 • Friday", name: "Pull B: Deadlifts & Upper Back", muscles: ["Back", "Biceps", "Forearms"] },
      { dayLabel: "Day 6 • Saturday", name: "Legs B: Hamstrings & Glutes", muscles: ["Hamstrings", "Glutes", "Quads", "Abs"] },
    ];
  }

  // Generate routines
  const routines: WorkoutRoutine[] = routineBlueprints.map((bp, bpIdx) => {
    const selectedExercises: RoutineExercise[] = [];
    const usedExerciseIds = new Set<string>();

    // If user selected priority target muscles, include them
    const musclesToTarget = targetMuscles && targetMuscles.length > 0 ? targetMuscles : bp.muscles;

    // Pick 1-2 exercises per target muscle group
    for (const muscle of musclesToTarget) {
      if (selectedExercises.length >= exerciseCount) break;

      const candidates = validExercises.filter(
        (ex) => (ex.muscleGroup === muscle || ex.secondaryMuscles.includes(muscle)) && !usedExerciseIds.has(ex.id)
      );

      if (candidates.length > 0) {
        // Prioritize compound movements first
        candidates.sort((a, b) => (b.category === "full_body" || b.category === "back" || b.category === "legs" ? 1 : -1));
        const picked = candidates[0];
        usedExerciseIds.add(picked.id);

        selectedExercises.push(createRoutineExercise(picked, defaultSets, repRange, restMultiplier));
      }
    }

    // If still under exercise count, fill with remaining suitable exercises
    if (selectedExercises.length < exerciseCount) {
      for (const ex of validExercises) {
        if (selectedExercises.length >= exerciseCount) break;
        if (!usedExerciseIds.has(ex.id) && bp.muscles.includes(ex.muscleGroup)) {
          usedExerciseIds.add(ex.id);
          selectedExercises.push(createRoutineExercise(ex, defaultSets, repRange, restMultiplier));
        }
      }
    }

    // Fallback if equipment was extremely restricted
    if (selectedExercises.length === 0) {
      const fallback = validExercises.length > 0 ? validExercises[0] : EXERCISE_DATABASE[0];
      selectedExercises.push(createRoutineExercise(fallback, defaultSets, repRange, restMultiplier));
    }

    return {
      id: `gen-routine-${bpIdx + 1}-${Date.now()}`,
      dayLabel: bp.dayLabel,
      name: bp.name,
      splitType,
      targetMuscles: bp.muscles,
      estimatedMinutes: sessionDurationMinutes,
      exercises: selectedExercises,
      isHomeWorkout: availableEquipment.length === 1 && availableEquipment[0] === "bodyweight",
    };
  });

  const goalTitle =
    goal === "muscle_gain"
      ? "Hypertrophy Muscle Builder"
      : goal === "strength"
      ? "Power & Max Strength System"
      : goal === "fat_loss"
      ? "Metabolic Shred & Conditioning"
      : goal === "body_recomposition"
      ? "Body Recomposition Engine"
      : "General Athletic Fitness";

  return {
    id: `custom-plan-${Date.now()}`,
    name: `${goalTitle} (${daysPerWeek} Days)`,
    splitType,
    daysPerWeek,
    recommendedExperience: experience,
    description: `Algorithmic ${goal.replace("_", " ")} plan generated for ${experience} lifter across ${daysPerWeek} training days using ${availableEquipment.join(", ")}.`,
    educationalOverview: {
      targetAudience: `Custom plan tailored for ${experience} lifters focusing on ${goal.replace("_", " ")}.`,
      weeklySchedule: routineBlueprints.map((b) => `${b.dayLabel}: ${b.name}`),
      pros: ["100% tailored to your available equipment", "Optimized volume and rest for your fitness goal", "Scientific exercise sequencing"],
      cons: ["Requires disciplined execution and progressive overload logging"],
      recoveryAdvice: "Track weights accurately. Ensure adequate dietary protein (1.8-2.2g/kg) and 7-9 hours of restorative sleep.",
    },
    routines,
  };
}

function getGoalParameters(goal: WorkoutGoal, experience: ExerciseDifficulty) {
  if (goal === "strength") {
    return {
      defaultSets: experience === "beginner" ? 3 : 4,
      repRange: "4-6",
      restMultiplier: 1.5, // longer rest for ATP recovery
    };
  } else if (goal === "muscle_gain") {
    return {
      defaultSets: experience === "advanced" ? 4 : 3,
      repRange: "8-12",
      restMultiplier: 1.0,
    };
  } else if (goal === "fat_loss" || goal === "body_recomposition") {
    return {
      defaultSets: 3,
      repRange: "12-15",
      restMultiplier: 0.75, // shorter rest to maintain elevated heart rate
    };
  } else {
    // general or beginner fitness
    return {
      defaultSets: 3,
      repRange: "10-12",
      restMultiplier: 1.0,
    };
  }
}

function createRoutineExercise(
  ex: ExerciseItem,
  defaultSets: number,
  repRange: string,
  restMultiplier: number
): RoutineExercise {
  const calculatedRest = Math.max(30, Math.round((ex.restTimeSeconds * restMultiplier) / 15) * 15);
  return {
    exerciseId: ex.id,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    secondaryMuscles: ex.secondaryMuscles,
    equipment: ex.equipment,
    sets: defaultSets,
    reps: repRange,
    restTimeSeconds: calculatedRest,
  };
}
