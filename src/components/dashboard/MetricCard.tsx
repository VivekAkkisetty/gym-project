import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  progressPercent?: number;
  change?: {
    value: string;
    positive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  accentColor?: "emerald" | "cyan" | "amber" | "rose" | "purple";
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  target,
  progressPercent,
  change,
  icon: Icon,
  accentColor = "emerald",
  className,
}: MetricCardProps) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-500",
      progress: "bg-emerald-500",
    },
    cyan: {
      bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      text: "text-cyan-500",
      progress: "bg-cyan-500",
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-500",
      progress: "bg-amber-500",
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      text: "text-rose-500",
      progress: "bg-rose-500",
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-500",
      progress: "bg-purple-500",
    },
  };

  const colors = colorMap[accentColor];

  return (
    <Card className={cn("overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", colors.bg, colors.text)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-muted-foreground">
              {unit}
            </span>
          )}
          {target && (
            <span className="ml-auto text-xs text-muted-foreground">
              / {target} {unit}
            </span>
          )}
        </div>

        {/* Progress Bar if percentage supplied */}
        {typeof progressPercent === "number" && (
          <div className="mt-3">
            <Progress
              value={Math.min(100, Math.max(0, progressPercent))}
              indicatorClassName={colors.progress}
              className="h-1.5"
            />
          </div>
        )}

        {/* Trend Indicator */}
        {change && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "flex items-center font-medium",
                change.positive ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {change.positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {change.value}
            </span>
            <span className="text-muted-foreground">
              {change.label || "vs. last week"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
