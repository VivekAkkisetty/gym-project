"use client";

import React from "react";
import {
  ChefHat,
  Clock,
  Flame,
  Refrigerator,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DietPlan } from "@/lib/validations/nutrition";
import { generateMealPrepGuide } from "@/lib/ai/meal-prep";

interface MealPrepTabProps {
  activePlan: DietPlan;
}

export function MealPrepTab({ activePlan }: MealPrepTabProps) {
  const guide = generateMealPrepGuide(activePlan);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="border-border">
        <CardHeader className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-bold">{guide.title}</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Efficiency blueprint to prepare a full week of macro-accurate meals in under 75 minutes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              ~{guide.estimatedPrepTimeMinutes} Mins Active Time
            </Badge>
            <Badge variant="outline" className="text-xs gap-1 border-emerald-500/30 text-emerald-400">
              Yield: {guide.servingsYield} Meals
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Step-by-Step Batch Cooking Sequence */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Batch Cooking & Assembly Sequence</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {guide.batchSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Step {step.stepNumber}: {step.title}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {step.phase}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.instruction}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refrigerator & Freezer Shelf-Life Guidelines */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Refrigerator className="h-4 w-4 text-cyan-500" />
            <span>Storage & Reheating Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-border/40">
            {guide.storageGuidelines.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-foreground">{item.item}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.reheatTips}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-[11px] text-cyan-400 border-cyan-500/30">
                    Fridge: {item.refrigeratorDays} Days
                  </Badge>
                  {item.freezerMonths > 0 && (
                    <Badge variant="outline" className="text-[11px] text-blue-400 border-blue-500/30">
                      Freezer: {item.freezerMonths} Mos
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Food Safety Directives */}
      <Card className="border-border bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Food Safety & Spoilage Prevention</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {guide.foodSafetyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
