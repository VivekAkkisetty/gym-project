import { NextResponse } from "next/server";
import { aiChatQuerySchema } from "@/lib/validations/ai";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { dispatchAIChat } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting check
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`chat_${clientIp}`, 20, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before asking another question.",
          resetSeconds: rateCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetSeconds),
            "X-RateLimit-Limit": String(rateCheck.totalLimit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Body parsing and Zod validation
    const rawBody = await req.json();
    const parseResult = aiChatQuerySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { message, history, userContext, contextConfig } = parseResult.data;

    // 3. Dispatch to AI Orchestrator (Server-side LLM with deterministic sports-science fallback)
    const reply = await dispatchAIChat(message, history, userContext, contextConfig);

    return NextResponse.json(
      { success: true, message: reply },
      {
        headers: {
          "X-RateLimit-Limit": String(rateCheck.totalLimit),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: "AI Assistant error", message: errorMsg },
      { status: 500 }
    );
  }
}
