import React from "react";
import Link from "next/link";
import { Dumbbell, Shield, Terminal, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-background/90 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Apex<span className="text-emerald-500">Fit</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Production-grade full stack fitness architecture built with Next.js, Supabase PostgreSQL, and modern athletic UI.
            </p>
          </div>

          {/* Platform Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/diet" className="hover:text-emerald-500 transition-colors">
                  Diet & Nutrition
                </Link>
              </li>
              <li>
                <Link href="/workout" className="hover:text-emerald-500 transition-colors">
                  Workouts & Splits
                </Link>
              </li>
              <li>
                <Link href="/exercises" className="hover:text-emerald-500 transition-colors">
                  Exercise Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Tracking */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Tools & Tracking
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/calculators" className="hover:text-emerald-500 transition-colors">
                  Fitness Calculators (TDEE, 1RM, Macro)
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-emerald-500 transition-colors">
                  Daily Logging (Water, Steps, Food)
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-emerald-500 transition-colors">
                  Weight & Body Measurements
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-500 transition-colors">
                  User Preferences & Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Security & Stack
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>Supabase Row Level Security</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-cyan-500" />
                <span>Next.js 16 SSR & Turbopack</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-amber-500" />
                <span>Strict TypeScript & Zod Validation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ApexFit Platform. Production foundation ready.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Crafted for high performance athletes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
