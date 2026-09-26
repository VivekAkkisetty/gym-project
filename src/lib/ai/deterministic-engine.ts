import {
  AIDietAdjustmentResult,
  AIFoodSubstitution,
  AIWeeklySummaryData,
} from "@/types/ai";
import { AIDietAdjustmentInput, AIFoodSubstitutionInput, AIWeeklySummaryInput } from "@/lib/validations/ai";
import { FOOD_DATABASE } from "@/lib/nutrition/foods-data";

export const MEDICAL_DISCLAIMER_TEXT =
  "Notice: This guidance is provided for educational and fitness purposes only and constitutes an estimate. It is not medical or clinical nutrition advice. Please consult a qualified healthcare provider before initiating changes to your diet or exercise routine.";

/**
 * Intelligent deterministic answer generator for common and complex fitness queries
 */
export function generateDeterministicAnswer(
  query: string,
  userContextStr: string
): { answer: string; sources: string[]; disclaimer: string } {
  const q = query.toLowerCase();

  // 1. Protein questions
  if (q.includes("protein") || q.includes("how much protein") || q.includes("gram")) {
    return {
      answer: `### Precision Protein Guidelines

Optimal protein intake depends on your training volume, goal, and body composition:

- **Hypertrophy / Muscle Building**: Aim for **1.6 – 2.2g of protein per kg of bodyweight** (0.7 – 1.0g per lb). This provides optimal amino acid availability for muscle protein synthesis (MPS).
- **Fat Loss (Caloric Deficit)**: Increase protein to **2.0 – 2.4g per kg** to protect lean tissue from catabolism while in an energy deficit.
- **Distribution**: Distribute protein across **3 to 5 meals**, with approximately **25 – 40g per meal** (containing at least 2.5–3g of leucine) spaced 3 to 4 hours apart.
- **Quality Sources**: Whey isolate, chicken breast, eggs, salmon, lean beef, Greek yogurt, tofu, tempeh, and pea-rice protein blends.

${userContextStr ? `*Context note: Based on your recorded stats, prioritize anchoring your meals around high-leucine lean proteins.*` : ""}`,
      sources: ["International Society of Sports Nutrition (ISSN) Position Stand: Protein and Exercise (2017)", "Morton et al., British Journal of Sports Medicine (2018)"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // 2. Calorie / Deficit / Surplus questions
  if (q.includes("calorie") || q.includes("deficit") || q.includes("surplus") || q.includes("lose fat") || q.includes("cut")) {
    return {
      answer: `### Caloric Balance & Energy Expenditure

Energy balance dictates systemic weight trajectory:

- **Moderate Fat Loss Deficit**: Set calories **300 – 500 kcal below Total Daily Energy Expenditure (TDEE)**. This targets a sustainable fat loss rate of **0.5% – 1% of body weight per week**, sparing muscle mass and metabolic rate.
- **Lean Hypertrophy Surplus**: Set calories **200 – 350 kcal above TDEE** (approx. 5–10% surplus). Large surpluses do not accelerate muscle protein synthesis but increase adipose storage.
- **Maintenance / Recomposition**: Consume at estimated TDEE while progressively training to exchange fat mass for lean muscle.
- **Monitoring Rule**: Track 7-day rolling morning weigh-ins rather than single-day fluctuations (which reflect glycogen and water shifts).`,
      sources: ["Helms et al., Journal of the International Society of Sports Nutrition (2014)", "Hall et al., The Lancet: Energy Balance Dynamics (2011)"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // 3. Exercise / Workout / Split questions
  if (q.includes("workout") || q.includes("split") || q.includes("exercise") || q.includes("reps") || q.includes("sets") || q.includes("hypertrophy")) {
    return {
      answer: `### Progressive Training & Split Architecture

To maximize muscular adaptations:

1. **Weekly Volume**: Aim for **10 – 20 challenging sets per muscle group per week**, trained across 2–3 frequencies weekly.
2. **Effective Intensity**: Train within **1 to 3 Reps in Reserve (RIR)** or RPE 7–9. Taking every set to absolute muscular failure increases systemic fatigue without additive hypertrophy.
3. **Repetition Ranges**:
   - **Strength**: 3 – 6 reps (3–5 min rest) on compound movements.
   - **Hypertrophy**: 6 – 12 reps (90–120s rest) on compound & accessory exercises.
   - **Metabolic Stress**: 12 – 20 reps (60s rest) on isolation movements.
4. **Progressive Overload Rule**: Whenever you can perform the top of your target rep bracket across all working sets, increase load by **2.5% to 5%**.`,
      sources: ["Schoenfeld et al., Sports Medicine (2017) Dose-Response Relationship Between Weekly Resistance Training Volume and Muscle Mass", "Zourdos et al., J Strength Cond Res (2016)"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // 4. Food substitution / Vegan / Dairy
  if (q.includes("substitut") || q.includes("swap") || q.includes("replace") || q.includes("vegetarian") || q.includes("vegan")) {
    return {
      answer: `### Macro-Matched Food Substitutions

When swapping ingredients, match both total macronutrient profile and digestive density:

- **Chicken Breast (100g)**:
  - $\\rightarrow$ **Extra Firm Tofu (150g)** + 5g olive oil for vegan equivalence.
  - $\\rightarrow$ **White Fish / Tilapia (120g)** for virtually identical zero-carb lean protein.
  - $\\rightarrow$ **Egg Whites (200g)** for pure albumin protein.
- **White Rice (100g cooked)**:
  - $\\rightarrow$ **Boiled Sweet Potato (130g)** (higher fiber & micronutrients).
  - $\\rightarrow$ **Cooked Quinoa (110g)** (adds complete amino acid profile).
  - $\\rightarrow$ **Rolled Oats (40g dry)** (slower GI release).
- **Whey Protein (30g scoop)**:
  - $\\rightarrow$ **Pea & Brown Rice Protein Blend (32g)** for matching BCAA and leucine kinetics.`,
      sources: ["USDA Food Data Central", "Gorissen et al., Amino Acid Content of Plant vs Animal Proteins (2018)"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // 5. Water / Hydration / Creatine
  if (q.includes("water") || q.includes("hydration") || q.includes("creatine") || q.includes("supplements")) {
    return {
      answer: `### Hydration & Evidence-Based Supplementation

1. **Hydration Benchmark**: Consume **35 – 45 mL of water per kg of bodyweight daily**, plus an additional **500 – 1000 mL per hour of intense exercise** to support cellular hydration and thermoregulation.
2. **Creatine Monohydrate**: The most rigorously studied ergogenic aid:
   - **Dosing**: 3 – 5g daily taken consistently at any time of day.
   - **Mechanism**: Saturates intramuscular phosphocreatine stores, enhancing ATP replenishment during high-intensity contractions.
   - **Safety**: Safe in healthy adults with no need for cycling or expensive buffered forms.
3. **Caffeine**: 3–6 mg/kg taken 45–60 minutes pre-workout enhances alertness and muscular endurance.`,
      sources: ["Buford et al., Journal of the International Society of Sports Nutrition (2007)", "Sawka et al., ACSM Position Stand: Exercise and Fluid Replacement"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // 6. Recovery / Soreness / Sleep
  if (q.includes("sleep") || q.includes("recovery") || q.includes("doms") || q.includes("sore")) {
    return {
      answer: `### Recovery, Sleep & Muscle Adaptation

Muscle growth and neural adaptation happen during recovery, not during the workout:

- **Sleep Quantity & Quality**: Target **7 to 9 hours of uninterrupted sleep**. Slow-wave sleep is when growth hormone (GH) secretion peaks and muscle tissue repair accelerates.
- **Delayed Onset Muscle Soreness (DOMS)**: DOMS is caused by microtrauma from novel eccentric contractions, not lactic acid. Soreness is **not** a reliable indicator of workout effectiveness or muscle growth.
- **Active Recovery**: Light cardiovascular activity (e.g. 20–30 min walk) increases blood flow and nutrient delivery, expediting recovery compared to complete immobility.
- **Stress Management**: Chronically elevated cortisol impairs muscle protein synthesis and promotes fluid retention that masks true weight changes.`,
      sources: ["Dattilo et al., Sleep and Muscle Recovery: Endocrinological and Molecular Mechanisms (2011)", "Cheung et al., Sports Medicine: Delayed Onset Muscle Soreness"],
      disclaimer: MEDICAL_DISCLAIMER_TEXT,
    };
  }

  // Default general fitness synthesis
  return {
    answer: `### ApexFit Coaching Guidance

Based on evidence-based exercise science and sports nutrition:

1. **Consistency Over Perfection**: Sustainable progress comes from maintaining 80–90% adherence to your nutrition and workout regimen over weeks and months rather than short-term extreme measures.
2. **Key Fundamentals**:
   - Caloric balance matched to your primary goal (mild deficit for fat loss, mild surplus for muscle gain).
   - High protein intake (1.6 – 2.2g per kg) distributed across regular meals.
   - Progressive resistance training with compound movements (squat, hinge, push, pull, carry).
   - 7,000 – 10,000 daily steps for non-exercise activity thermogenesis (NEAT).
   - 7–9 hours of quality sleep for systemic recovery.

Feel free to ask specific questions about your daily calories, workout exercises, food swaps, or training splits!`,
    sources: ["ACSM Guidelines for Exercise Testing and Prescription", "ISSN Sports Nutrition Principles"],
    disclaimer: MEDICAL_DISCLAIMER_TEXT,
  };
}

/**
 * Deterministic AI Diet Adjustment Engine
 */
export function calculateAIDietAdjustment(input: AIDietAdjustmentInput): AIDietAdjustmentResult {
  const { currentCalories, currentProteinG, primaryGoal, weightDelta7DaysKg, adherencePercentage } = input;

  let calorieDelta = 0;
  let rationale = "";
  let confidenceScore = 88;
  let estimatedWeeklyRateKg = 0;

  if (primaryGoal === "fat_loss") {
    // If adherence is high (>80%) and weight hasn't dropped (<0.1 kg loss), adjust deficit
    if (adherencePercentage >= 80 && weightDelta7DaysKg >= -0.1) {
      calorieDelta = -180;
      estimatedWeeklyRateKg = -0.45;
      rationale =
        "Your recent 7-day average shows a plateau despite consistent logging. A gentle 180 kcal adjustment will reignite metabolic fat mobilization without spiking hunger or causing muscle loss.";
      confidenceScore = 92;
    } else if (weightDelta7DaysKg < -1.0) {
      // Losing too fast (>1kg/wk), risk of muscle loss
      calorieDelta = +150;
      estimatedWeeklyRateKg = -0.6;
      rationale =
        "Weight is dropping at over 1 kg/week, which elevates muscle catabolism and metabolic downregulation risks. Adding 150 kcal protects your lean muscle tissue while keeping fat loss steady.";
      confidenceScore = 90;
    } else {
      // Progressing as expected (0.3 - 0.9 kg/wk)
      calorieDelta = 0;
      estimatedWeeklyRateKg = weightDelta7DaysKg;
      rationale =
        "Your rate of fat loss is right in the optimal physiological sweet spot (approx. 0.5-0.8% body weight/week). No calorie changes are needed at this time—continue maintaining your current routine.";
      confidenceScore = 95;
    }
  } else if (primaryGoal === "muscle_gain") {
    if (weightDelta7DaysKg <= 0.05) {
      calorieDelta = +200;
      estimatedWeeklyRateKg = 0.25;
      rationale =
        "Weight gain has stalled. To maintain hypertrophy momentum, a conservative 200 kcal surplus bump is recommended to support glycogen replenishment and muscle tissue synthesis.";
      confidenceScore = 90;
    } else if (weightDelta7DaysKg > 0.6) {
      calorieDelta = -120;
      estimatedWeeklyRateKg = 0.3;
      rationale =
        "Weight is climbing faster than maximal muscle protein synthesis limits (approx. 0.25-0.35 kg/week for trained lifters). Reducing surplus slightly limits excess adipose accumulation.";
      confidenceScore = 88;
    } else {
      calorieDelta = 0;
      estimatedWeeklyRateKg = weightDelta7DaysKg;
      rationale =
        "Lean mass accretion rate is right on target. Calorie intake is optimal—keep focusing on progressive overload in the gym.";
      confidenceScore = 94;
    }
  } else {
    // Maintenance or recomposition
    if (Math.abs(weightDelta7DaysKg) > 0.5) {
      calorieDelta = weightDelta7DaysKg > 0 ? -150 : +150;
      estimatedWeeklyRateKg = 0;
      rationale = `Weight drifted by ${weightDelta7DaysKg > 0 ? "+" : ""}${weightDelta7DaysKg.toFixed(2)} kg. Re-centering calories closer to true maintenance expenditure.`;
      confidenceScore = 85;
    } else {
      calorieDelta = 0;
      estimatedWeeklyRateKg = 0;
      rationale = "Weight is stable within standard daily hydration variance. Current maintenance intake is dialed in accurately.";
      confidenceScore = 96;
    }
  }

  const suggestedCalories = Math.max(1200, Math.round(currentCalories + calorieDelta));
  // Protein stays anchored to preserve lean mass
  const suggestedProteinG = currentProteinG;
  // Fat kept healthy at ~25% of calories
  const suggestedFatG = Math.max(40, Math.round((suggestedCalories * 0.25) / 9));
  // Remaining calories to carbs
  const carbCalories = suggestedCalories - (suggestedProteinG * 4 + suggestedFatG * 9);
  const suggestedCarbsG = Math.max(50, Math.round(carbCalories / 4));

  return {
    currentCalories,
    suggestedCalories,
    calorieDelta,
    suggestedProteinG,
    suggestedCarbsG,
    suggestedFatG,
    rationale,
    confidenceScore,
    estimatedWeeklyRateKg,
    disclaimer: MEDICAL_DISCLAIMER_TEXT,
  };
}

/**
 * Deterministic AI Food Substitution Finder
 */
export function findDeterministicSubstitution(input: AIFoodSubstitutionInput): AIFoodSubstitution {
  const { foodName, servingQuantity, servingUnit } = input;
  const queryLower = foodName.toLowerCase();

  // Find exact or closest match in database
  const original = FOOD_DATABASE.find(
    (f) => f.name.toLowerCase().includes(queryLower) || queryLower.includes(f.name.toLowerCase())
  ) || FOOD_DATABASE[0];

  const scale = servingQuantity / original.servingSize;
  const originalCalories = Math.round(original.calories * scale);
  const originalProtein = Math.round(original.protein * scale * 10) / 10;
  const originalCarbs = Math.round(original.carbs * scale * 10) / 10;
  const originalFat = Math.round(original.fat * scale * 10) / 10;

  // Find candidates with similar macronutrient focus
  const candidates = FOOD_DATABASE.filter(
    (f) => f.id !== original.id && f.substitutionGroup === original.substitutionGroup
  );

  const substitute = candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : FOOD_DATABASE.find((f) => f.category === original.category && f.id !== original.id) || FOOD_DATABASE[1];

  // Calculate target quantity so calories or protein align
  let recommendedQuantity = substitute.servingSize;
  if (original.substitutionGroup.includes("protein") && substitute.protein > 0) {
    recommendedQuantity = Math.round((originalProtein / substitute.protein) * substitute.servingSize);
  } else if (substitute.calories > 0) {
    recommendedQuantity = Math.round((originalCalories / substitute.calories) * substitute.servingSize);
  }

  const subScale = recommendedQuantity / substitute.servingSize;
  const subCalories = Math.round(substitute.calories * subScale);
  const subProtein = Math.round(substitute.protein * subScale * 10) / 10;
  const subCarbs = Math.round(substitute.carbs * subScale * 10) / 10;
  const subFat = Math.round(substitute.fat * subScale * 10) / 10;

  // Calculate macro match score
  const calDiff = Math.abs(originalCalories - subCalories) / (originalCalories || 1);
  const protDiff = Math.abs(originalProtein - subProtein) / (originalProtein || 1);
  const macroMatchScore = Math.max(65, Math.min(98, Math.round(100 - (calDiff * 40 + protDiff * 40))));

  const dietaryFit: string[] = [];
  if (substitute.dietaryType === "vegetarian" || substitute.dietaryType === "vegan") dietaryFit.push("Vegetarian");
  if (substitute.dietaryType === "vegan") dietaryFit.push("Vegan");
  if (subProtein >= 20) dietaryFit.push("High-Protein");
  if (subCarbs <= 5) dietaryFit.push("Low-Carb");

  return {
    originalFood: {
      name: original.name,
      servingSize: servingQuantity,
      servingUnit,
      calories: originalCalories,
      protein: originalProtein,
      carbs: originalCarbs,
      fat: originalFat,
    },
    substituteFood: {
      name: substitute.name,
      servingSize: recommendedQuantity,
      servingUnit: substitute.servingUnit,
      calories: subCalories,
      protein: subProtein,
      carbs: subCarbs,
      fat: subFat,
    },
    recommendedQuantity,
    macroMatchScore,
    dietaryFit,
    culinaryTip: `To match texture and satiety, prepare ${substitute.name} with light seasoning. It provides a near-identical metabolic footprint while varying your micronutrient profile.`,
  };
}

/**
 * Deterministic AI Weekly Executive Summary
 */
export function generateDeterministicWeeklySummary(input: AIWeeklySummaryInput): AIWeeklySummaryData {
  const {
    totalWorkoutsCompleted,
    scheduledWorkouts,
    avgSteps,
    avgWaterMl,
    avgProteinG,
    targetProteinG,
    avgCalories,
    targetCalories,
    weightChange7DaysKg,
    currentWeightKg,
  } = input;

  const workoutScore = Math.min(100, Math.round((totalWorkoutsCompleted / Math.max(1, scheduledWorkouts)) * 100));
  const proteinScore = Math.min(100, Math.round((avgProteinG / Math.max(1, targetProteinG)) * 100));
  const dietScore = Math.round((proteinScore + (100 - Math.min(100, Math.abs(avgCalories - targetCalories) / 25))) / 2);

  const sign = weightChange7DaysKg > 0 ? "+" : "";
  const headline =
    workoutScore >= 80 && dietScore >= 75
      ? "Outstanding Week: High Consistency Across Training & Nutrition"
      : workoutScore >= 75
      ? "Strong Training Discipline with Opportunities for Nutrition Refinement"
      : "Solid Base Established: Focus on Closing Consistency Gaps Next Week";

  const keyWin =
    totalWorkoutsCompleted >= scheduledWorkouts
      ? `Completed 100% of your ${scheduledWorkouts} scheduled workouts!`
      : avgSteps >= 9000
      ? `Maintained an active lifestyle with an average of ${avgSteps.toLocaleString()} daily steps.`
      : avgProteinG >= targetProteinG * 0.9
      ? `Hit your daily protein target with a strong ${Math.round(avgProteinG)}g daily average.`
      : "Successfully recorded check-ins and maintained tracking accountability.";

  const focusArea =
    avgWaterMl < 2500
      ? "Hydration: Average intake was below 2.5L. Aim to drink 1 glass upon waking and 1 glass with every meal."
      : proteinScore < 80
      ? "Protein Adherence: Prioritize adding 15-20g protein to your first meal of the day to reach target."
      : workoutScore < 75
      ? "Workout Scheduling: Block out specific training times in your calendar to prevent missed sessions."
      : "Step Volume: Incorporate two 10-minute post-meal walks to elevate daily energy expenditure.";

  return {
    timeframe: "Last 7 Days",
    headline,
    dietAdherenceScore: Math.max(40, Math.min(100, dietScore)),
    dietAdherenceSummary: `Averaged ${Math.round(avgCalories)} kcal/day (Target: ${targetCalories} kcal) with ${Math.round(avgProteinG)}g protein (Target: ${targetProteinG}g). Protein adherence was at ${proteinScore}%.`,
    workoutAdherenceScore: workoutScore,
    workoutSummary: `Completed ${totalWorkoutsCompleted} of ${scheduledWorkouts} scheduled sessions (${workoutScore}% completion). Progressive stimulus maintained.`,
    stepsSummary: `Averaged ${avgSteps.toLocaleString()} steps per day, contributing steady baseline energy expenditure.`,
    hydrationSummary: `Averaged ${(avgWaterMl / 1000).toFixed(1)}L of water daily.`,
    weightTrendSummary: `7-day net weight shift: ${sign}${weightChange7DaysKg.toFixed(2)} kg (Current: ${currentWeightKg.toFixed(1)} kg).`,
    keyWin,
    focusAreaForNextWeek: focusArea,
    disclaimer: MEDICAL_DISCLAIMER_TEXT,
  };
}
