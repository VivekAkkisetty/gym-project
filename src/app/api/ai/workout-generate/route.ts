import { NextResponse } from "next/server";
import { aiWorkoutGenerationSchema } from "@/lib/validations/ai";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { generateCustomWorkoutPlan } from "@/lib/workout/generator";
import { EquipmentType } from "@/lib/validations/workout";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`workout_gen_${clientIp}`, 20, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before generating another workout.",
          resetSeconds: rateCheck.resetSeconds,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const parseResult = aiWorkoutGenerationSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid workout generation parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const params = parseResult.data;

    const equipmentMap: Record<string, EquipmentType[]> = {
      full_gym: ["barbell", "dumbbell", "cable", "machine", "bodyweight"],
      dumbbells_only: ["dumbbell", "bodyweight"],
      home_minimal: ["bodyweight", "bands", "kettlebell"],
      bodyweight: ["bodyweight"],
    };

    const daysCount = Math.max(3, Math.min(6, params.daysAvailable));
    const generatedSplit = generateCustomWorkoutPlan({
      goal: params.goal,
      experience: params.experience,
      daysPerWeek: daysCount,
      availableEquipment: equipmentMap[params.equipment] || ["barbell", "dumbbell", "bodyweight"],
      sessionDurationMinutes: params.durationMinutes,
      targetMuscles: [],
    });

    return NextResponse.json({
      success: true,
      split: generatedSplit,
      disclaimer:
        "Notice: Verify form and perform proper mobility warm-ups prior to lifting. Adjust weights to maintain 1-3 Reps in Reserve.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: "Workout generation error", message: errorMsg }, { status: 500 });
  }
}
