import { NextResponse } from "next/server";
import { aiWeeklySummarySchema } from "@/lib/validations/ai";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { dispatchWeeklySummary } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`summary_${clientIp}`, 20, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before generating another weekly summary.",
          resetSeconds: rateCheck.resetSeconds,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const parseResult = aiWeeklySummarySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid summary parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const summary = await dispatchWeeklySummary(parseResult.data);
    return NextResponse.json({ success: true, summary });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: "Weekly summary error", message: errorMsg }, { status: 500 });
  }
}
