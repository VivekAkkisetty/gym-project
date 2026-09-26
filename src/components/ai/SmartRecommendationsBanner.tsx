"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  ArrowRight,
  AlertCircle,
  Award,
} from "lucide-react";
import { SmartRecommendation } from "@/types/ai";

interface SmartRecommendationsBannerProps {
  recommendations: SmartRecommendation[];
}

export function SmartRecommendationsBanner({ recommendations }: SmartRecommendationsBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const activeRecs = recommendations.filter((r) => !dismissedIds.has(r.id));
  if (activeRecs.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const getSeverityStyle = (severity: SmartRecommendation["severity"]) => {
    switch (severity) {
      case "warning":
        return {
          border: "border-amber-500/30",
          bg: "bg-amber-500/[0.04]",
          icon: <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />,
          titleColor: "text-amber-400",
        };
      case "celebration":
        return {
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/[0.04]",
          icon: <Award className="h-4 w-4 text-emerald-500 shrink-0" />,
          titleColor: "text-emerald-400",
        };
      case "tip":
      default:
        return {
          border: "border-blue-500/30",
          bg: "bg-blue-500/[0.04]",
          icon: <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />,
          titleColor: "text-blue-400",
        };
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
        <span>ApexFit Smart Insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activeRecs.map((rec) => {
          const style = getSeverityStyle(rec.severity);
          return (
            <div
              key={rec.id}
              className={`p-3.5 rounded-lg border ${style.border} ${style.bg} relative flex flex-col justify-between space-y-2 transition-all`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pr-4">
                  <div className="flex items-center gap-2">
                    {style.icon}
                    <span className={`text-xs font-bold ${style.titleColor}`}>{rec.title}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  {rec.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                {rec.actionText && rec.actionHref ? (
                  <Link
                    href={rec.actionHref}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span />
                )}

                {rec.dismissible && (
                  <button
                    onClick={() => handleDismiss(rec.id)}
                    className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-0.5"
                    title="Dismiss insight"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
