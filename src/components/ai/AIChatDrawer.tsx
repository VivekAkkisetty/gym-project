"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  Shield,
  Loader2,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIChatMessage, AIContextConfig, SanitizedUserContext } from "@/types/ai";

const PROMPT_SUGGESTIONS = [
  "How much protein should I eat per day for muscle growth?",
  "What is the best warm-up protocol before heavy squats?",
  "Can you suggest healthy low-calorie high-protein snacks?",
  "My weight loss has stalled for 2 weeks. How should I adjust?",
  "What is the difference between RPE and Reps in Reserve (RIR)?",
  "How much water should I drink on heavy training days?",
];

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: "initial-welcome",
    role: "assistant",
    content:
      "Hello! I am your **ApexFit AI Coach**. I can answer questions about your diet plan, workout routines, exercise technique cues, and evidence-based nutrition.\n\n*Notice: I am an educational fitness coach, not a doctor. I provide estimations, not medical diagnosis or treatment.*",
    timestamp: "2026-01-01T00:00:00.000Z",
    disclaimer: "Educational fitness guidance only. Consult a physician for medical concerns.",
  },
];

function createUserMessage(content: string): AIChatMessage {
  return {
    id: `user-${Date.now()}`,
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  };
}

function createFallbackMessage(): AIChatMessage {
  return {
    id: `fallback-${Date.now()}`,
    role: "assistant",
    content:
      "I'm temporarily operating offline. For workouts, focus on compound movements (8-12 reps). For nutrition, maintain 1.6-2.2g of protein per kg of body weight.",
    timestamp: new Date().toISOString(),
    disclaimer: "Educational fitness guidance only.",
  };
}

interface AIChatDrawerProps {
  userContext?: SanitizedUserContext;
}

export function AIChatDrawer({ userContext }: AIChatDrawerProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyConfig, setShowPrivacyConfig] = useState(false);
  const [contextConfig, setContextConfig] = useState<AIContextConfig>({
    shareProfileStats: true,
    shareDietPlan: true,
    shareWorkoutPlan: true,
    shareTrackingLogs: true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    if (query.length > 500) {
      toast.error("Please limit your question to 500 characters.");
      return;
    }

    const userMessage = createUserMessage(query);

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          userContext,
          contextConfig,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Rate limit reached. Please wait a few seconds before asking again.");
          return;
        }
        throw new Error("Unable to contact AI Coach.");
      }

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {
      toast.error("Failed to receive AI response. Falling back to local offline coach.");
      setMessages((prev) => [...prev, createFallbackMessage()]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const handleSendClick = () => {
    void handleSendMessage();
  };

  return (
    <Card className="border-border flex flex-col h-[700px] overflow-hidden">
      {/* Top Header */}
      <CardHeader className="py-3 px-4 border-b border-border bg-card/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span>ApexFit AI Coach</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-emerald-500/30 text-emerald-400">
                Evidence-Based
              </Badge>
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">Server-Secured & Privacy Protected</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground gap-1 hover:text-foreground"
            onClick={() => setShowPrivacyConfig(!showPrivacyConfig)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Context</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={clearChat}
            title="Clear Chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      {/* Persistent Medical Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-xs text-amber-500">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="text-[11px] leading-tight">
          <strong>Non-Medical Notice:</strong> AI Coach provides fitness & nutrition estimates. Not medical diagnosis. Consult a physician for health or injury concerns.
        </span>
      </div>

      {/* Privacy Context Toggles (Expandable) */}
      {showPrivacyConfig && (
        <div className="p-3 bg-muted/40 border-b border-border text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5 text-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>Personalized Context Controls (Zero PII Sent)</span>
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowPrivacyConfig(false)}>
              Close
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Control which fitness metrics are included in prompt context. Passwords, auth tokens, photos, and notes are NEVER transmitted.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={contextConfig.shareProfileStats}
                onChange={(e) => setContextConfig({ ...contextConfig, shareProfileStats: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Weight & Height</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={contextConfig.shareDietPlan}
                onChange={(e) => setContextConfig({ ...contextConfig, shareDietPlan: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Diet Plan Macros</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={contextConfig.shareWorkoutPlan}
                onChange={(e) => setContextConfig({ ...contextConfig, shareWorkoutPlan: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Active Split</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={contextConfig.shareTrackingLogs}
                onChange={(e) => setContextConfig({ ...contextConfig, shareTrackingLogs: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>7-Day Averages</span>
            </label>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-emerald-600 text-white font-medium"
                  : "bg-muted/70 text-foreground border border-border"
              }`}
            >
              {m.content}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex flex-wrap gap-1">
                  <span className="font-semibold">References:</span>
                  {m.sources.map((s, idx) => (
                    <span key={idx} className="bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 px-1">
              {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg w-fit border border-border">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
            <span>ApexFit Coach is analyzing sports science principles...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Prompt Pills */}
      <div className="px-4 py-2 border-t border-border/60 bg-card/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        {PROMPT_SUGGESTIONS.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              void handleSendMessage(pill);
            }}
            className="text-[11px] whitespace-nowrap bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full border border-border transition-colors shrink-0"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-border bg-card flex items-center gap-2">
        <Input
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about protein, exercises, calories, recovery, or food swaps... (max 500 chars)"
          maxLength={500}
          className="text-xs h-10"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendClick}
          disabled={isLoading || !inputQuery.trim()}
          size="sm"
          className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </div>
    </Card>
  );
}
