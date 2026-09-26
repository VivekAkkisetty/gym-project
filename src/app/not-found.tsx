import React from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6">
        <Dumbbell className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        404
      </h1>
      <h2 className="mt-2 text-xl font-bold text-foreground">
        Workout Routine Not Found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The fitness route or resource you are looking for has been moved or does not exist in the platform.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
