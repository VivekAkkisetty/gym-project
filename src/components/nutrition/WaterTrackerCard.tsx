"use client";

import React, { useState } from "react";
import { Droplets, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface WaterTrackerCardProps {
  initialTargetMl?: number;
  initialConsumedMl?: number;
  onUpdateConsumed?: (consumedMl: number) => void;
  className?: string;
}

export function WaterTrackerCard({
  initialTargetMl = 3200,
  initialConsumedMl = 0,
  onUpdateConsumed,
  className,
}: WaterTrackerCardProps) {
  const [targetMl] = useState(initialTargetMl);
  const [consumedMl, setConsumedMl] = useState(initialConsumedMl);

  const addWater = (amount: number) => {
    const updated = consumedMl + amount;
    setConsumedMl(updated);
    onUpdateConsumed?.(updated);
    toast.success(`💧 Added +${amount} ml water! (${updated} / ${targetMl} ml)`);
  };

  const handleReset = () => {
    setConsumedMl(0);
    onUpdateConsumed?.(0);
    toast.info("Hydration log reset to 0 ml for today.");
  };

  const percentage = Math.min(100, Math.round((consumedMl / (targetMl || 1)) * 100));
  const remaining = Math.max(0, targetMl - consumedMl);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Daily Hydration Engine</CardTitle>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-mono">
            {percentage}% Goal
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-foreground">{consumedMl}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {targetMl} ml</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {remaining > 0 ? `${remaining} ml remaining` : "Daily target reached! 🎉"}
          </span>
        </div>

        <Progress
          value={percentage}
          indicatorClassName="bg-blue-500"
          className="h-2"
        />

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(250)}
            className="flex flex-col py-3.5 h-auto text-xs hover:border-blue-500/40 hover:bg-blue-500/10"
          >
            <span className="font-bold">+250ml</span>
            <span className="text-[10px] text-muted-foreground">Glass</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(500)}
            className="flex flex-col py-3.5 h-auto text-xs hover:border-blue-500/40 hover:bg-blue-500/10 bg-blue-500/5"
          >
            <span className="font-bold">+500ml</span>
            <span className="text-[10px] text-muted-foreground">Bottle</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(750)}
            className="flex flex-col py-3.5 h-auto text-xs hover:border-blue-500/40 hover:bg-blue-500/10"
          >
            <span className="font-bold">+750ml</span>
            <span className="text-[10px] text-muted-foreground">Shaker</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(1000)}
            className="flex flex-col py-3.5 h-auto text-xs hover:border-blue-500/40 hover:bg-blue-500/10"
          >
            <span className="font-bold">+1000ml</span>
            <span className="text-[10px] text-muted-foreground">Flask</span>
          </Button>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Today</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
