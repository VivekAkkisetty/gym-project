import React from "react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Zap, Activity } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-2 bg-background">
      {/* Left athletic marketing column */}
      <div className="relative hidden md:flex flex-col justify-between p-10 bg-zinc-950 text-white border-r border-zinc-800 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <Dumbbell className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Apex<span className="text-emerald-500">Fit</span>
            </span>
          </Link>
          <div className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            Production V1.0
          </div>
        </div>

        {/* Feature showcase quote */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Activity className="h-3.5 w-3.5" /> High-Performance Athletics
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One Unified Engine for Nutrition, Training & Physique Analytics.
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Log daily macros, orchestrate hypertrophy splits, analyze body composition changes, and achieve peak conditioning with database-backed integrity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-emerald-400 border border-zinc-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Supabase RLS</p>
                <p className="text-[11px] text-zinc-400">Zero data leaks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400 border border-zinc-800">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Instant Metrics</p>
                <p className="text-[11px] text-zinc-400">Real-time sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} ApexFit Platform. Built for elite consistency.
        </div>
      </div>

      {/* Right form column */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="md:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Apex<span className="text-emerald-500">Fit</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="my-auto mx-auto w-full max-w-md py-8">{children}</div>

        <div className="text-center text-xs text-muted-foreground">
          Protected by Supabase Auth & Row Level Security encryption.
        </div>
      </div>
    </div>
  );
}
