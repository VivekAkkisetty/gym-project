"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";

interface HeaderProps {
  onOpenQuickLog?: () => void;
}

export function Header({ onOpenQuickLog }: HeaderProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generate breadcrumb text
  const getPageTitle = () => {
    if (pathname.startsWith("/diet")) return "Diet & Nutrition";
    if (pathname.startsWith("/workout")) return "Workouts & Splits";
    if (pathname.startsWith("/exercises")) return "Exercise Library";
    if (pathname.startsWith("/calculators")) return "Fitness Calculators";
    if (pathname.startsWith("/tracking")) return "Daily Log & Habits";
    if (pathname.startsWith("/progress")) return "Progress & Body Metrics";
    if (pathname.startsWith("/profile")) return "Profile & Preferences";
    return "Dashboard Overview";
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
        {/* Left Section: Mobile Menu Trigger + Page Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden h-9 w-9 text-muted-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {getPageTitle()}
            </h1>
            <span className="hidden sm:inline text-[11px] text-muted-foreground">
              ApexFit Athletic Workspace
            </span>
          </div>
        </div>

        {/* Right Section: Quick Log + Notification + Theme Toggle + User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenQuickLog && (
            <Button
              onClick={onOpenQuickLog}
              size="sm"
              className="gap-1.5 font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Log</span>
            </Button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sync Active</span>
          </div>

          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted"
                aria-label="User account menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-xs text-white">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-xs font-semibold text-foreground">
                  {user?.user_metadata?.full_name || "Athlete"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || "athlete@apexfit.local"}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile Overview</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile#preferences" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Targets & Units</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              collapsed={false}
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
