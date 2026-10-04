/**
 * Navigation routes and links for header, sidebar, and breadcrumbs.
 */

export interface NavRoute {
  name: string;
  href: string;
  badge?: string | null;
  description?: string;
}

export const MAIN_NAV_ROUTES: NavRoute[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    description: "Daily overview and athletic KPI dashboard",
  },
  {
    name: "Diet & Nutrition",
    href: "/diet",
    badge: "Macros",
    description: "Meal plans, macro targets, and nutrition analytics",
  },
  {
    name: "Workouts",
    href: "/workout",
    description: "Hypertrophy splits and live training session logging",
  },
  {
    name: "Exercise Library",
    href: "/exercises",
    description: "Comprehensive multi-muscle exercise repository",
  },
  {
    name: "Calculators",
    href: "/calculators",
    badge: "TDEE",
    description: "BMR, TDEE, and 1-Rep Max estimation formulas",
  },
  {
    name: "Daily Tracking",
    href: "/tracking",
    description: "Step counts, hydration, sleep, and macro habit logging",
  },
  {
    name: "Progress & Analytics",
    href: "/progress",
    description: "Weight trends, measurement logs, and progress photos",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    badge: "Sports AI",
    description: "Conversational fitness science intelligence",
  },
  {
    name: "Profile & Settings",
    href: "/profile",
    description: "Account credentials, target preferences, and biometrics",
  },
];
