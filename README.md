# ApexFit — Production Full-Stack Fitness Platform (Part 1 Foundation)

ApexFit is an athletic web platform built for tracking nutrition, macros, progressive overload workout splits, and daily biometrics with database-level security.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Radix UI Primitives (shadcn/ui compatible)
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) & Supabase SSR
- **Visualizations**: Recharts
- **Theme**: Light & Dark mode support via `next-themes`
- **Feedback**: Accessible toast notifications via `sonner`

---

## 🚀 Getting Started

### 1. Environment Variables Setup
Copy the environment template and provide your Supabase instance credentials:
```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional server-only secret for webhooks/admin tasks:
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run Database Migrations
In your Supabase project's SQL Editor, execute the migration located at:
```
supabase/migrations/20260101000000_init_fitness_schema.sql
```
This initializes all 10 core tables with Row-Level Security (RLS), performance indexes, and the automated user profile creation trigger (`handle_new_user`).

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Architecture

```
GYM-PROJECT/
├── supabase/
│   └── migrations/
│       └── 20260101000000_init_fitness_schema.sql   # Complete RLS schemas & triggers
├── src/
│   ├── app/
│   │   ├── (auth)/                                  # Authentication suite
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/                             # Protected dashboard shell
│   │   │   ├── dashboard/page.tsx                   # Main overview & charts
│   │   │   ├── diet/page.tsx                        # Macro tracking & meal plans
│   │   │   ├── workout/page.tsx                     # Hypertrophy routines & splits
│   │   │   ├── exercises/page.tsx                   # Biomechanical exercise library
│   │   │   ├── calculators/page.tsx                 # TDEE & 1RM estimators
│   │   │   ├── tracking/page.tsx                    # Water, steps & sleep logs
│   │   │   ├── progress/page.tsx                    # Weight & tape measurements
│   │   │   └── profile/page.tsx                     # Biometrics, targets & security
│   │   ├── api/auth/callback/route.ts               # Supabase OAuth/magic link exchange
│   │   ├── layout.tsx                               # Global theme & auth providers
│   │   └── page.tsx                                 # Public landing page
│   ├── components/
│   │   ├── ui/                                      # Primitives (Button, Dialog, etc.)
│   │   ├── layout/                                  # Navbar, Sidebar, Header, ThemeToggle
│   │   ├── dashboard/                               # MetricCard, Recharts, QuickLogModal
│   │   └── providers/                               # ThemeProvider, AuthProvider
│   ├── lib/
│   │   ├── supabase/                                # Client, Server, and Middleware SSR
│   │   ├── validations/                             # Zod form validation schemas
│   │   └── utils.ts                                 # Metric formatting & cn helpers
│   └── types/
│       ├── database.ts                              # Typed Supabase schema definition
│       └── fitness.ts                               # Fitness domain models
```

---

## 🛡 Security Architecture

- **Row Level Security (RLS)**: Enforced across all tables. Lifters can exclusively query and modify their own records (`auth.uid() = user_id`).
- **Zero Client Key Exposure**: Server-role keys are never bundled client-side.
- **Server-Side Validation**: All auth inputs are validated using Zod.
- **Middleware Protected Routes**: Authentication session refresh and redirection for unauthenticated paths.
