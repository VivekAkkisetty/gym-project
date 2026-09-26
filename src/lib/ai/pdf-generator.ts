import { DietPlan } from "@/lib/validations/nutrition";
import { WorkoutSplitPlan } from "@/types/workout";
import { WeeklySummaryMetrics } from "@/types/tracking";

/**
 * Clean printable HTML document builder for Diet Plans, Workout Plans, and Weekly Reports.
 * Opens an isolated print preview window that immediately triggers browser Print-to-PDF.
 */

const BASE_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 1.5cm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
    background: #ffffff;
    line-height: 1.5;
    font-size: 13px;
    margin: 0;
    padding: 20px;
  }
  .header {
    border-bottom: 2px solid #10b981;
    padding-bottom: 12px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .brand {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #10b981;
  }
  .brand span {
    color: #111827;
  }
  .subtitle {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px 0;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 20px;
  }
  .meta-item {
    text-align: center;
  }
  .meta-label {
    font-size: 10px;
    text-transform: uppercase;
    color: #6b7280;
    font-weight: 600;
  }
  .meta-val {
    font-size: 16px;
    font-weight: 700;
    color: #10b981;
    margin-top: 2px;
  }
  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 6px;
    margin: 20px 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }
  th, td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  th {
    background: #f9fafb;
    font-size: 11px;
    font-weight: 600;
    color: #4b5563;
    text-transform: uppercase;
  }
  tr:nth-child(even) td {
    background: #fafafa;
  }
  .disclaimer {
    margin-top: 30px;
    padding: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    font-size: 10px;
    color: #991b1b;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }
`;

function triggerPrintWindow(htmlContent: string) {
  if (typeof window === "undefined") return;
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) {
    alert("Please allow popups to export printable documents.");
    return;
  }
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}

/**
 * 1. Export Diet Plan to PDF
 */
export function exportDietPlanToPdf(plan: DietPlan) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ApexFit - ${plan.name}</title>
  <style>${BASE_PRINT_STYLES}</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">APEX<span>FIT</span></div>
      <div class="subtitle">Precision Evidence-Based Fitness System</div>
    </div>
    <div style="text-align: right;">
      <div class="title">${plan.name}</div>
      <div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><div class="meta-label">Daily Calories</div><div class="meta-val">${plan.dailyCalories} kcal</div></div>
    <div class="meta-item"><div class="meta-label">Protein</div><div class="meta-val">${plan.targetProteinG}g</div></div>
    <div class="meta-item"><div class="meta-label">Carbohydrates</div><div class="meta-val">${plan.targetCarbsG}g</div></div>
    <div class="meta-item"><div class="meta-label">Healthy Fats</div><div class="meta-val">${plan.targetFatG}g</div></div>
  </div>

  <div class="section-title">Daily Meal Architecture (${plan.meals.length} Scheduled Meals)</div>
  ${plan.meals
    .map(
      (m, idx) => `
    <div style="margin-bottom: 16px;">
      <div style="font-weight: 700; font-size: 13px; color: #047857; margin-bottom: 6px;">
        Meal ${idx + 1}: ${m.slotName} (${m.time})
      </div>
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Serving Size</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody>
          ${m.items
            .map(
              (i) => `
            <tr>
              <td style="font-weight: 500;">${i.name}</td>
              <td>${i.quantity || i.servingSize} ${i.servingUnit}</td>
              <td>${i.calories} kcal</td>
              <td>${i.protein}g</td>
              <td>${i.carbs}g</td>
              <td>${i.fat}g</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
    )
    .join("")}

  <div class="disclaimer">
    <strong>Notice:</strong> This nutrition plan provides dietary estimates intended for educational fitness purposes only. It does not replace individualized medical advice or clinical dietetics.
  </div>
</body>
</html>`;

  triggerPrintWindow(html);
}

/**
 * 2. Export Workout Plan to PDF
 */
export function exportWorkoutPlanToPdf(split: WorkoutSplitPlan) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ApexFit - ${split.name}</title>
  <style>${BASE_PRINT_STYLES}</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">APEX<span>FIT</span></div>
      <div class="subtitle">Evidence-Based Strength & Conditioning</div>
    </div>
    <div style="text-align: right;">
      <div class="title">${split.name}</div>
      <div class="subtitle">${split.daysPerWeek} Days/Week | Level: ${split.recommendedExperience.toUpperCase()}</div>
    </div>
  </div>

  <p style="color: #4b5563; font-size: 12px; margin-bottom: 18px;">${split.description}</p>

  <div class="section-title">Training Schedule & Exercise Protocols</div>
  ${split.routines
    .map(
      (r) => `
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <div style="font-weight: 700; font-size: 13px; color: #047857; border-bottom: 1px solid #d1fae5; padding-bottom: 4px; margin-bottom: 8px;">
        ${r.name} (${r.targetMuscles.join(", ")}) — ~${r.estimatedMinutes} mins
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 35%;">Exercise</th>
            <th style="width: 20%;">Equipment</th>
            <th style="width: 15%;">Target Sets</th>
            <th style="width: 15%;">Reps</th>
            <th style="width: 15%;">Rest</th>
          </tr>
        </thead>
        <tbody>
          ${r.exercises
            .map(
              (ex) => `
            <tr>
              <td style="font-weight: 500;">${ex.name}</td>
              <td style="color: #6b7280; text-transform: capitalize;">${ex.equipment}</td>
              <td>${ex.sets} sets</td>
              <td>${ex.reps}</td>
              <td>${ex.restTimeSeconds}s</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
    )
    .join("")}

  <div class="disclaimer">
    <strong>Notice:</strong> Always perform a thorough warm-up prior to high-intensity lifting. Maintain proper biomechanics and stop if you experience acute or sharp joint pain.
  </div>
</body>
</html>`;

  triggerPrintWindow(html);
}

/**
 * 3. Export Weekly Progress Report to PDF
 */
export function exportWeeklyProgressReportToPdf(
  metrics: WeeklySummaryMetrics,
  currentWeightKg: number,
  sevenDayAvgWeight: number
) {
  const sign = metrics.weightChangeKg > 0 ? "+" : "";
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ApexFit - Weekly Progress Report</title>
  <style>${BASE_PRINT_STYLES}</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">APEX<span>FIT</span></div>
      <div class="subtitle">Executive Progress & Analytics Recap</div>
    </div>
    <div style="text-align: right;">
      <div class="title">7-Day Performance Report</div>
      <div class="subtitle">${metrics.startDate} to ${metrics.endDate}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><div class="meta-label">Current Weight</div><div class="meta-val">${currentWeightKg.toFixed(1)} kg</div></div>
    <div class="meta-item"><div class="meta-label">7-Day Delta</div><div class="meta-val">${sign}${metrics.weightChangeKg.toFixed(2)} kg</div></div>
    <div class="meta-item"><div class="meta-label">7-Day Average</div><div class="meta-val">${sevenDayAvgWeight.toFixed(1)} kg</div></div>
    <div class="meta-item"><div class="meta-label">Consistency</div><div class="meta-val">${metrics.workoutConsistencyPercent}%</div></div>
  </div>

  <div class="section-title">Weekly Habit Benchmarks</div>
  <table>
    <thead>
      <tr>
        <th>Performance Metric</th>
        <th>Recorded Average</th>
        <th>Target Benchmark</th>
        <th>Adherence Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: 500;">Workouts Completed</td>
        <td>${metrics.completedWorkouts} Sessions</td>
        <td>4+ Sessions / Week</td>
        <td style="font-weight: 600; color: ${metrics.completedWorkouts >= 4 ? "#059669" : "#d97706"};">${metrics.workoutConsistencyPercent}% of Goal</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Daily Step Volume</td>
        <td>${metrics.averageSteps.toLocaleString()} Steps</td>
        <td>10,000 Steps / Day</td>
        <td style="font-weight: 600; color: ${metrics.averageSteps >= 9000 ? "#059669" : "#d97706"};">${metrics.averageSteps >= 10000 ? "Goal Met" : "In Progress"}</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Daily Hydration</td>
        <td>${(metrics.averageWaterMl / 1000).toFixed(1)} L / Day</td>
        <td>3.2 L / Day</td>
        <td style="font-weight: 600; color: ${metrics.averageWaterMl >= 3000 ? "#059669" : "#d97706"};">${Math.round((metrics.averageWaterMl / 3200) * 100)}%</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Daily Protein Intake</td>
        <td>${Math.round(metrics.averageProteinG)}g / Day</td>
        <td>160g / Day</td>
        <td style="font-weight: 600; color: ${metrics.averageProteinG >= 140 ? "#059669" : "#d97706"};">${Math.round((metrics.averageProteinG / 160) * 100)}%</td>
      </tr>
    </tbody>
  </table>

  <div class="disclaimer">
    <strong>Notice:</strong> Biometric tracking numbers fluctuate due to fluid balance, sodium intake, and muscle glycogen storage. Evaluate multi-week trends rather than single-day variations.
  </div>
</body>
</html>`;

  triggerPrintWindow(html);
}
