import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading fitness data...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] w-full flex-col items-center justify-center p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-emerald-500/20 animate-ping absolute" />
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
