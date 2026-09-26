-- ==============================================================================
-- ApexFit - Production Database Schema & Security Migration
-- Tables: profiles, user_preferences, foods, exercises, diet_plans,
--         diet_meals, workout_plans, workout_sessions, progress, daily_tracking
-- ==============================================================================

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    birth_date DATE,
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')) DEFAULT 'moderately_active',
    fitness_goal TEXT CHECK (fitness_goal IN ('cut_fat', 'maintain_weight', 'lean_bulk', 'build_muscle', 'endurance', 'general_health')) DEFAULT 'build_muscle',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. USER_PREFERENCES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'dark',
    unit_system TEXT CHECK (unit_system IN ('metric', 'imperial')) DEFAULT 'metric',
    calorie_target INTEGER DEFAULT 2200,
    protein_target_g INTEGER DEFAULT 160,
    carbs_target_g INTEGER DEFAULT 240,
    fat_target_g INTEGER DEFAULT 65,
    water_target_ml INTEGER DEFAULT 3000,
    step_target INTEGER DEFAULT 10000,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. FOODS TABLE (Global verified library + user custom foods)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means global verified food
    name TEXT NOT NULL,
    brand TEXT,
    barcode TEXT,
    serving_size NUMERIC(7, 2) NOT NULL DEFAULT 100,
    serving_unit TEXT NOT NULL DEFAULT 'g', -- g, ml, scoop, piece, etc.
    calories NUMERIC(7, 2) NOT NULL,
    protein_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    carbs_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fat_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fiber_g NUMERIC(6, 2) DEFAULT 0,
    sugar_g NUMERIC(6, 2) DEFAULT 0,
    sodium_mg NUMERIC(7, 2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. EXERCISES TABLE (Standard library + custom user exercises)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means standard exercise
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body', 'olympic', 'calisthenics')) NOT NULL,
    muscle_group TEXT NOT NULL,
    secondary_muscles TEXT[] DEFAULT '{}',
    equipment TEXT CHECK (equipment IN ('barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'bands', 'other')) NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    instructions TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. DIET_PLANS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    daily_calories INTEGER NOT NULL,
    target_protein_g INTEGER NOT NULL,
    target_carbs_g INTEGER NOT NULL,
    target_fat_g INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 6. DIET_MEALS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_plan_id UUID REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')) NOT NULL,
    name TEXT NOT NULL,
    food_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {food_id, name, amount, unit, calories, protein, carbs, fat}
    total_calories NUMERIC(7, 2) NOT NULL DEFAULT 0,
    total_protein NUMERIC(6, 2) NOT NULL DEFAULT 0,
    total_carbs NUMERIC(6, 2) NOT NULL DEFAULT 0,
    total_fat NUMERIC(6, 2) NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. WORKOUT_PLANS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    split_type TEXT CHECK (split_type IN ('push_pull_legs', 'upper_lower', 'bro_split', 'full_body', 'custom')) DEFAULT 'push_pull_legs',
    days_per_week INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. WORKOUT_SESSIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    exercises_log JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {exercise_id, name, sets: [{set_num, reps, weight_kg, rpe, completed}]}
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. PROGRESS TABLE (Weight, body fat, measurements, photos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    body_fat_percentage NUMERIC(4, 1),
    chest_cm NUMERIC(5, 1),
    waist_cm NUMERIC(5, 1),
    hips_cm NUMERIC(5, 1),
    arms_cm NUMERIC(5, 1),
    thighs_cm NUMERIC(5, 1),
    calves_cm NUMERIC(5, 1),
    photo_urls JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_progress_date UNIQUE (user_id, recorded_date)
);

-- -----------------------------------------------------------------------------
-- 10. DAILY_TRACKING TABLE (Day aggregate for calories, water, steps, habits)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    calories_consumed INTEGER DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    protein_consumed_g INTEGER DEFAULT 0,
    carbs_consumed_g INTEGER DEFAULT 0,
    fat_consumed_g INTEGER DEFAULT 0,
    water_intake_ml INTEGER DEFAULT 0,
    steps_count INTEGER DEFAULT 0,
    sleep_hours NUMERIC(4, 1) DEFAULT 0,
    mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'tired', 'stressed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_daily_tracking_date UNIQUE (user_id, tracking_date)
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_foods_user_id ON public.foods(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user ON public.diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_meals_user ON public.diet_meals(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_date ON public.progress(user_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_tracking_user_date ON public.daily_tracking(user_id, tracking_date DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. User Preferences Policies
CREATE POLICY "Users can view their own preferences" 
    ON public.user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
    ON public.user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
    ON public.user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

-- 3. Foods Policies (Read verified public items or personal custom items; write only personal)
CREATE POLICY "Users can view verified foods or their own foods" 
    ON public.foods FOR SELECT 
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create custom foods" 
    ON public.foods FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom foods" 
    ON public.foods FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom foods" 
    ON public.foods FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. Exercises Policies (Read standard public exercises or personal; write only personal)
CREATE POLICY "Users can view standard exercises or their own" 
    ON public.exercises FOR SELECT 
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create custom exercises" 
    ON public.exercises FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises" 
    ON public.exercises FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises" 
    ON public.exercises FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. Diet Plans Policies
CREATE POLICY "Users manage own diet plans" 
    ON public.diet_plans FOR ALL 
    USING (auth.uid() = user_id);

-- 6. Diet Meals Policies
CREATE POLICY "Users manage own diet meals" 
    ON public.diet_meals FOR ALL 
    USING (auth.uid() = user_id);

-- 7. Workout Plans Policies
CREATE POLICY "Users manage own workout plans" 
    ON public.workout_plans FOR ALL 
    USING (auth.uid() = user_id);

-- 8. Workout Sessions Policies
CREATE POLICY "Users manage own workout sessions" 
    ON public.workout_sessions FOR ALL 
    USING (auth.uid() = user_id);

-- 9. Progress Policies
CREATE POLICY "Users manage own progress entries" 
    ON public.progress FOR ALL 
    USING (auth.uid() = user_id);

-- 10. Daily Tracking Policies
CREATE POLICY "Users manage own daily tracking entries" 
    ON public.daily_tracking FOR ALL 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
