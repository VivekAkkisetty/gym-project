"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  BookOpen,
  Calculator,
  CalendarCheck,
  TrendingUp,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onItemClick?: () => void;
}

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Diet & Nutrition",
    href: "/diet",
    icon: UtensilsCrossed,
    badge: "Macros",
  },
  {
    name: "Workouts",
    href: "/workout",
    icon: Dumbbell,
    badge: null,
  },
  {
    name: "Exercise Library",
    href: "/exercises",
    icon: BookOpen,
    badge: null,
  },
  {
    name: "Calculators",
    href: "/calculators",
    icon: Calculator,
    badge: "TDEE",
  },
  {
    name: "Daily Tracking",
    href: "/tracking",
    icon: CalendarCheck,
    badge: null,
  },
  {
    name: "Progress & Metrics",
    href: "/progress",
    icon: TrendingUp,
    badge: null,
  },
  {
    name: "AI Coach & Tools",
    href: "/assistant",
    icon: Bot,
    badge: "AI",
  },
  {
    name: "Profile & Settings",
    href: "/profile",
    icon: User,
    badge: null,
  },
];

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  className,
  onItemClick,
}: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-card/60 backdrop-blur-md transition-all duration-300 select-none h-full",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
          onClick={onItemClick}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
            <Dumbbell className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground truncate">
              Apex<span className="text-emerald-500">Fit</span>
            </span>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-muted text-muted-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Core Modules
          </p>
        )}
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={collapsed ? item.name : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-emerald-500"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}
              {!collapsed && item.badge && (
                <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Daily Guidance Tip widget (when expanded) */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-zinc-900/5 to-emerald-500/5 border border-emerald-500/20 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
            <Flame className="h-4 w-4" />
            <span>Daily Discipline</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Log your daily nutrition and training consistently to unlock accurate weekly analytics.
          </p>
        </div>
      )}

      {/* Footer / Account Profile */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50",
            collapsed && "justify-center p-1"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 font-bold text-xs text-foreground">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Athlete")}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email || "Not signed in"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut()}
              title="Sign Out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
