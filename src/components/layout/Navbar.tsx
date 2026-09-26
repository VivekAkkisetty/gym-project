"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Dumbbell, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1">
              Apex<span className="text-emerald-500">Fit</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#modules"
            className="hover:text-foreground transition-colors"
          >
            Modules
          </Link>
          <Link
            href="#preview"
            className="hover:text-foreground transition-colors"
          >
            Platform Preview
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Live App
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="font-semibold shadow-sm">
              Get Started Free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
            >
              Features
            </Link>
            <Link
              href="#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
            >
              Modules
            </Link>
            <Link
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
            >
              Platform Preview
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-emerald-500 hover:bg-muted rounded-lg flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Open Live Dashboard
            </Link>
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
