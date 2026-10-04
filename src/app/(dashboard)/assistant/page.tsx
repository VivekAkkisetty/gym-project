"use client";

import React, { useState } from "react";
import {
  Bot,
  UtensilsCrossed,
  Dumbbell,
  ArrowLeftRight,
  ShoppingCart,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AIChatDrawer } from "@/components/ai/AIChatDrawer";
import { AIDietAdjuster } from "@/components/ai/AIDietAdjuster";
import { AIWorkoutGeneratorModal } from "@/components/ai/AIWorkoutGeneratorModal";
import { FoodSubstitutionCard } from "@/components/ai/FoodSubstitutionCard";
import { ShoppingListTab } from "@/components/ai/ShoppingListTab";
import { MealPrepTab } from "@/components/ai/MealPrepTab";
import { SmartRecommendationsBanner } from "@/components/ai/SmartRecommendationsBanner";
import { PdfExportModal } from "@/components/ai/PdfExportModal";
import { getSavedDietPlans } from "@/lib/nutrition/storage";
import { getStoredWorkoutSplits } from "@/lib/workout/storage";
import { getStoredDailyLogs, getStoredMeasurements } from "@/lib/tracking/storage";
import { calculateWeightStats, generateWeeklySummary } from "@/lib/tracking/progress-analytics";
import { generateSmartRecommendations } from "@/lib/ai/recommendations";
import { SanitizedUserContext } from "@/types/ai";
import { DietPlan } from "@/lib/validations/nutrition";

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [activePlan, setActivePlan] = useState<DietPlan | null>(() => {
    const plans = getSavedDietPlans();
    return plans.find((p) => p.isActive) || plans[0] || null;
  });

  const splits = getStoredWorkoutSplits();
  const activeSplit = splits[0];
  const logs = getStoredDailyLogs();
  const measurements = getStoredMeasurements();
  const weightStats = calculateWeightStats(measurements);
  const weeklyMetrics = generateWeeklySummary(logs, measurements);

  // Smart non-intrusive proactive recommendations
  const recommendations = generateSmartRecommendations(
    logs,
    activePlan?.targetProteinG || 160,
    activePlan?.dailyCalories || 2400,
    10000
  );

  // Sanitized context for AI prompt
  const sanitizedContext: SanitizedUserContext = {
    fitnessGoal: "General Fitness",
    weightKg: weightStats.currentWeight || undefined,
    heightCm: undefined,
    activeDietName: activePlan?.name,
    targetCalories: activePlan?.dailyCalories,
    targetProteinG: activePlan?.targetProteinG,
    targetCarbsG: activePlan?.targetCarbsG,
    targetFatG: activePlan?.targetFatG,
    activeWorkoutSplit: activeSplit?.name,
    weeklyWorkoutsCount: weeklyMetrics.completedWorkouts,
    avgDailySteps: weeklyMetrics.averageSteps,
    avgDailyWaterMl: weeklyMetrics.averageWaterMl,
    weightDelta7DaysKg: weightStats.sevenDayChangeKg,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Bot className="h-5 w-5" />
            </div>
            <span>AI Coach & Smart Tools</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Evidence-based coaching, adaptive diet calibrations, tailored training splits, and grocery productivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 gap-1.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Zero PII Transmitted</span>
          </Badge>
        </div>
      </div>

      {/* Proactive Smart Insights Banner */}
      <SmartRecommendationsBanner recommendations={recommendations} />

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted/60">
          <TabsTrigger value="chat" className="text-xs py-2 gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            <span>AI Coach</span>
          </TabsTrigger>
          <TabsTrigger value="diet-adjust" className="text-xs py-2 gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Diet Adjust</span>
          </TabsTrigger>
          <TabsTrigger value="workout-gen" className="text-xs py-2 gap-1.5">
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Workout Gen</span>
          </TabsTrigger>
          <TabsTrigger value="substitutions" className="text-xs py-2 gap-1.5">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Food Swaps</span>
          </TabsTrigger>
          <TabsTrigger value="shopping-prep" className="text-xs py-2 gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Groceries & Prep</span>
          </TabsTrigger>
          <TabsTrigger value="pdf-reports" className="text-xs py-2 gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>PDF Reports</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. AI CHAT COACH */}
        <TabsContent value="chat" className="space-y-4">
          <AIChatDrawer userContext={sanitizedContext} />
        </TabsContent>

        {/* 2. SMART DIET ADJUSTMENT */}
        <TabsContent value="diet-adjust" className="space-y-4">
          {activePlan ? (
            <AIDietAdjuster
              activePlan={activePlan}
              weightDelta7DaysKg={weightStats.sevenDayChangeKg}
              onPlanUpdated={(updated) => setActivePlan(updated)}
            />
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground border border-border rounded-lg">
              No active diet plan found. Please create or activate a plan in the Diet Hub.
            </div>
          )}
        </TabsContent>

        {/* 3. AI WORKOUT GENERATOR */}
        <TabsContent value="workout-gen" className="space-y-4">
          <AIWorkoutGeneratorModal />
        </TabsContent>

        {/* 4. FOOD SUBSTITUTIONS */}
        <TabsContent value="substitutions" className="space-y-4">
          <FoodSubstitutionCard />
        </TabsContent>

        {/* 5. SHOPPING LIST & MEAL PREP */}
        <TabsContent value="shopping-prep" className="space-y-6">
          {activePlan ? (
            <div className="space-y-8">
              <ShoppingListTab activePlan={activePlan} />
              <MealPrepTab activePlan={activePlan} />
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground border border-border rounded-lg">
              Activate a diet plan to generate automated shopping lists and meal prep sequences.
            </div>
          )}
        </TabsContent>

        {/* 6. PDF EXPORT REPORTS */}
        <TabsContent value="pdf-reports" className="space-y-4">
          {activePlan && activeSplit ? (
            <PdfExportModal
              activeDietPlan={activePlan}
              activeWorkoutSplit={activeSplit}
              weeklyMetrics={weeklyMetrics}
              currentWeightKg={weightStats.currentWeight || 0}
              sevenDayAvgWeight={weightStats.sevenDayAverage || 0}
            />
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground border border-border rounded-lg">
              Loading active plans for PDF export...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
