import { DailyTrackingLog } from "@/types/tracking";
import { SmartRecommendation } from "@/types/ai";

/**
 * Analyzes recent tracking logs and returns non-intrusive smart recommendations
 */
export function generateSmartRecommendations(
  logs: DailyTrackingLog[],
  targetProteinG: number = 160,
  targetCalories: number = 2400,
  targetSteps: number = 10000
): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];

  if (!logs || logs.length === 0) {
    recommendations.push({
      id: "rec-start-tracking",
      category: "habit",
      severity: "tip",
      title: "Establish Your Baseline",
      message:
        "Consistent tracking for just 5 consecutive days provides the algorithmic baseline needed to optimize your calories and workout recovery.",
      actionText: "Log Today",
      actionHref: "/tracking",
      dismissible: true,
    });
    return recommendations;
  }

  const recent7 = logs.slice(0, 7);

  // 1. Hydration Analysis
  const avgWater = recent7.reduce((acc, l) => acc + (l.waterIntakeMl || 0), 0) / recent7.length;
  if (avgWater < 2200) {
    recommendations.push({
      id: "rec-hydration-low",
      category: "recovery",
      severity: "warning",
      title: "Hydration Dip Detected",
      message: `Your 7-day average hydration is ${(avgWater / 1000).toFixed(1)}L. Mild dehydration reduces gym strength output by up to 15%. Aim to add 500mL upon waking.`,
      actionText: "Quick Add +500mL",
      actionHref: "/tracking",
      dismissible: true,
    });
  } else if (avgWater >= 3200) {
    recommendations.push({
      id: "rec-hydration-high",
      category: "habit",
      severity: "celebration",
      title: "Optimal Hydration Maintained",
      message: `Great job averaging ${(avgWater / 1000).toFixed(1)}L daily! High hydration supports intracellular glycogen storage and joint lubrication.`,
      dismissible: true,
    });
  }

  // 2. Protein Target Consistency
  const proteinHits = recent7.filter((l) => (l.proteinConsumedG || 0) >= targetProteinG * 0.9).length;
  if (proteinHits >= 5) {
    recommendations.push({
      id: "rec-protein-streak",
      category: "nutrition",
      severity: "celebration",
      title: "Protein Discipline Milestone",
      message: `You hit your protein goal on ${proteinHits} of the last 7 days! This maximizes 24-hour muscle protein synthesis for your recovery.`,
      dismissible: true,
    });
  } else if (proteinHits <= 2) {
    recommendations.push({
      id: "rec-protein-low",
      category: "nutrition",
      severity: "tip",
      title: "Protein Intake Window",
      message: `You reached your protein target on only ${proteinHits} of the past 7 days. Adding a whey shake or Greek yogurt snack can easily close the gap.`,
      actionText: "View Substitutions",
      actionHref: "/assistant?tab=substitutions",
      dismissible: true,
    });
  }

  // 3. Step Volume (NEAT)
  const avgSteps = recent7.reduce((acc, l) => acc + (l.stepsCount || 0), 0) / recent7.length;
  if (avgSteps >= targetSteps) {
    recommendations.push({
      id: "rec-steps-high",
      category: "habit",
      severity: "celebration",
      title: "High Non-Exercise Activity",
      message: `Averaging ${Math.round(avgSteps).toLocaleString()} steps daily provides steady caloric expenditure and cardiovascular conditioning without central fatigue.`,
      dismissible: true,
    });
  } else if (avgSteps < 6000) {
    recommendations.push({
      id: "rec-steps-low",
      category: "habit",
      severity: "tip",
      title: "Boost Your Daily NEAT",
      message: `Daily steps averaged ${Math.round(avgSteps).toLocaleString()}. Two 10-minute post-meal walks can add 2,500 steps and dramatically improve postprandial glucose clearance.`,
      actionText: "Check Daily Log",
      actionHref: "/tracking",
      dismissible: true,
    });
  }

  // 4. Sleep Recovery
  const avgSleep = recent7.reduce((acc, l) => acc + (l.sleepHours || 7), 0) / recent7.length;
  if (avgSleep < 6.5) {
    recommendations.push({
      id: "rec-sleep-low",
      category: "recovery",
      severity: "warning",
      title: "Recovery Deficit Alert",
      message: `Sleep averaged only ${avgSleep.toFixed(1)} hours. Chronic short sleep elevates ghrelin (hunger hormone) and impairs growth hormone secretion by up to 50%.`,
      dismissible: true,
    });
  }

  // 5. Calorie Adherence
  const avgCals = recent7.reduce((acc, l) => acc + (l.caloriesConsumed || 0), 0) / recent7.length;
  if (Math.abs(avgCals - targetCalories) <= 150) {
    recommendations.push({
      id: "rec-calorie-balance",
      category: "nutrition",
      severity: "tip",
      title: "Caloric Target On Track",
      message: `Your 7-day average intake (${Math.round(avgCals)} kcal) is within 150 kcal of your ${targetCalories} kcal target.`,
      dismissible: true,
    });
  }

  // Prioritize warnings, then celebrations, then tips
  const severityOrder = { warning: 0, celebration: 1, tip: 2, info: 3 };
  recommendations.sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9));

  return recommendations.slice(0, 4);
}
