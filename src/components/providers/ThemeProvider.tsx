"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// In React 19 / Next.js dev mode, next-themes renders an inline script tag to eliminate theme flash.
// Suppress the harmless dev warning: "Encountered a script tag while rendering React component"
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
