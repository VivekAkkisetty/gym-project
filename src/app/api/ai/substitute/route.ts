import { NextResponse } from "next/server";
import { aiFoodSubstitutionSchema } from "@/lib/validations/ai";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { dispatchFoodSubstitution } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`sub_${clientIp}`, 30, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before querying more substitutions.",
          resetSeconds: rateCheck.resetSeconds,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const parseResult = aiFoodSubstitutionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid food substitution parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const result = await dispatchFoodSubstitution(parseResult.data);
    return NextResponse.json({ success: true, substitution: result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: "Substitution error", message: errorMsg }, { status: 500 });
  }
}
