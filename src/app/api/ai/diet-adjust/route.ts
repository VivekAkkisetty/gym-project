import { NextResponse } from "next/server";
import { aiDietAdjustmentSchema } from "@/lib/validations/ai";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { dispatchDietAdjustment } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`adjust_${clientIp}`, 20, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before recalculating.",
          resetSeconds: rateCheck.resetSeconds,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const parseResult = aiDietAdjustmentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid diet adjustment inputs", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const result = await dispatchDietAdjustment(parseResult.data);
    return NextResponse.json({ success: true, adjustment: result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: "Diet adjustment error", message: errorMsg }, { status: 500 });
  }
}
