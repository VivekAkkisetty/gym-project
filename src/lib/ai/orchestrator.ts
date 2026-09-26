import { AIChatMessage, SanitizedUserContext, AIContextConfig, AIDietAdjustmentResult, AIFoodSubstitution, AIWeeklySummaryData } from "@/types/ai";
import {
  generateDeterministicAnswer,
  calculateAIDietAdjustment,
  findDeterministicSubstitution,
  generateDeterministicWeeklySummary,
  MEDICAL_DISCLAIMER_TEXT,
} from "./deterministic-engine";
import { buildSanitizedContextPrompt, AI_SYSTEM_PROMPT } from "./context-sanitizer";
import { AIDietAdjustmentInput, AIFoodSubstitutionInput, AIWeeklySummaryInput } from "../validations/ai";

/**
 * Dispatches chat queries to configured LLM (OpenAI/Gemini) with graceful fallback to deterministic engine
 */
export async function dispatchAIChat(
  message: string,
  history: { role: string; content: string }[],
  userContext?: SanitizedUserContext,
  contextConfig?: AIContextConfig
): Promise<AIChatMessage> {
  const contextSnippet = buildSanitizedContextPrompt(userContext, contextConfig);
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. If OpenAI key configured, attempt OpenAI API
  if (openAiKey) {
    try {
      const messages = [
        { role: "system", content: `${AI_SYSTEM_PROMPT}\n${contextSnippet}` },
        ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content,
            timestamp: new Date().toISOString(),
            sources: ["OpenAI LLM Engine (Server-Side)"],
            disclaimer: MEDICAL_DISCLAIMER_TEXT,
          };
        }
      }
    } catch {
      // Gracefully fall through to deterministic engine
    }
  }

  // 2. If Gemini key configured, attempt Gemini API
  if (geminiKey) {
    try {
      const prompt = `${AI_SYSTEM_PROMPT}\n${contextSnippet}\nUser Question: ${message}`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          return {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content,
            timestamp: new Date().toISOString(),
            sources: ["Google Gemini Engine (Server-Side)"],
            disclaimer: MEDICAL_DISCLAIMER_TEXT,
          };
        }
      }
    } catch {
      // Gracefully fall through to deterministic engine
    }
  }

  // 3. Robust Sports-Science Deterministic Engine (Offline / Default Fallback)
  const result = generateDeterministicAnswer(message, contextSnippet);
  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: result.answer,
    timestamp: new Date().toISOString(),
    sources: result.sources,
    disclaimer: result.disclaimer,
  };
}

/**
 * Dispatches Diet Adjustment request
 */
export async function dispatchDietAdjustment(
  input: AIDietAdjustmentInput
): Promise<AIDietAdjustmentResult> {
  // Uses deterministic sports-science energy balance formulas
  return calculateAIDietAdjustment(input);
}

/**
 * Dispatches Food Substitution request
 */
export async function dispatchFoodSubstitution(
  input: AIFoodSubstitutionInput
): Promise<AIFoodSubstitution> {
  return findDeterministicSubstitution(input);
}

/**
 * Dispatches Weekly Summary request
 */
export async function dispatchWeeklySummary(
  input: AIWeeklySummaryInput
): Promise<AIWeeklySummaryData> {
  return generateDeterministicWeeklySummary(input);
}
