import React from "react";
import Link from "next/link";
import {
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Flame,
  ArrowRight,
  CheckCircle,
  Activity,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Full Stack Fitness Platform</span>
                <span className="hidden sm:inline text-emerald-500/40">•</span>
                <span className="hidden sm:inline">Production V1.0 Ready</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Master Your Nutrition,{" "}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Dominate Your Lifts.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                One complete platform where athletes and lifters track macros, log progressive overload routines, monitor hydration and body measurements, with full database Row-Level Security.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-emerald-500/20">
                    <Activity className="h-4 w-4" />
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Architecture
                  </Button>
                </Link>
              </div>

              {/* Micro specs */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Supabase RLS Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Strict TypeScript
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Next.js 16 Turbopack
                </span>
              </div>
            </div>

            {/* Interactive Platform Mockup Card */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card/60 backdrop-blur-xl p-3 sm:p-5 shadow-2xl shadow-emerald-950/10">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground hidden sm:inline">
                    apexfit.app/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Flame className="h-3.5 w-3.5" /> 7-Day Active Streak
                </div>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Today&apos;s Energy
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">2,060</span>
                    <span className="text-xs text-muted-foreground">/ 2,400 kcal</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%] rounded-full" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Protein Target
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">165</span>
                    <span className="text-xs text-muted-foreground">/ 180 g</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[91%] rounded-full" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Hydration
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">2,400</span>
                    <span className="text-xs text-muted-foreground">/ 3,200 ml</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[75%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Sample workout snippet inside preview */}
              <div className="mt-4 p-4 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Active Routine: Push Hypertrophy A
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Incline Barbell Bench • Weighted Dips • Cable Lateral Raises
                    </p>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="text-xs font-semibold gap-1">
                    Open Live Interface
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500">
                Engineered for Peak Performance
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                All-in-One Fitness Architecture
              </p>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                No disconnected spreadsheets or fragmented apps. Every fitness variable is unified under a single relational schema.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card className="hover:border-emerald-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Diet, Nutrition & Macros
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Granular tracking for calories, protein, carbs, fats, fiber, and micronutrients. Build custom meal templates and structured daily meal plans.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="hover:border-cyan-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Workouts & Exercise Library
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Log sets, reps, weight, RPE, and rest timers. Access standard compound and isolation movements, or register custom gym equipment exercises.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="hover:border-amber-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Precision Fitness Calculators
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Compute Total Daily Energy Expenditure (TDEE), 1-Rep Max benchmarks, Target Heart Rate zones, and caloric deficits for cutting or bulking phases.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="hover:border-blue-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Daily Biometrics & Habits
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Monitor step counts, water consumption logs, sleep duration, and subjective energy/mood scores with fast 1-click quick log modals.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="hover:border-purple-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Progress & Physique Metrics
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track weight trends with smoothing filters, body fat estimates, and circumference tape measurements (chest, waist, arms, thighs).
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="hover:border-emerald-500/40 transition-all shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Security & Row-Level Privacy
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your health, weight, and diet records are strictly scoped to your authenticated UUID using PostgreSQL Row Level Security (RLS) policies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 sm:p-12 text-white overflow-hidden shadow-xl shadow-emerald-500/20">
              <div className="relative z-10 max-w-2xl space-y-4">
                <h3 className="text-3xl font-black tracking-tight">
                  Ready to optimize your training and nutrition?
                </h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Start logging your daily meals, workouts, and biometrics immediately with production-ready architecture.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-zinc-950 hover:bg-zinc-100 font-bold">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                    >
                      Explore Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
