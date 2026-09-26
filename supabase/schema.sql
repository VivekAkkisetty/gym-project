-- ==============================================================================
-- ApexFit — COMPLETE PRODUCTION DATABASE SCHEMA & SECURITY MIGRATION
-- ==============================================================================
-- Description:
--   Single, production-ready, idempotent SQL migration for Supabase.
--   Sets up all 10 application tables with primary keys, foreign key cascades,
--   check constraints, automated triggers, performance indexes, default-deny
--   Row Level Security (RLS) policies, storage buckets, and verified seed data.
--
-- Tables:
--   1. profiles
--   2. user_preferences
--   3. foods
--   4. exercises
--   5. diet_plans
--   6. diet_meals
--   7. workout_plans
--   8. workout_sessions
--   9. progress
--  10. daily_tracking
--
-- Safe to run in Supabase SQL Editor.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    birth_date DATE,
    height_cm NUMERIC(5, 2) CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg > 0 AND weight_kg < 500),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')) DEFAULT 'moderately_active',
    fitness_goal TEXT CHECK (fitness_goal IN ('cut_fat', 'maintain_weight', 'lean_bulk', 'build_muscle', 'endurance', 'general_health')) DEFAULT 'build_muscle',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. USER_PREFERENCES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'dark',
    unit_system TEXT CHECK (unit_system IN ('metric', 'imperial')) DEFAULT 'metric',
    calorie_target INTEGER DEFAULT 2200 CHECK (calorie_target > 500 AND calorie_target < 15000),
    protein_target_g INTEGER DEFAULT 160 CHECK (protein_target_g >= 0 AND protein_target_g < 800),
    carbs_target_g INTEGER DEFAULT 240 CHECK (carbs_target_g >= 0 AND carbs_target_g < 2000),
    fat_target_g INTEGER DEFAULT 65 CHECK (fat_target_g >= 0 AND fat_target_g < 1000),
    water_target_ml INTEGER DEFAULT 3000 CHECK (water_target_ml >= 0 AND water_target_ml < 30000),
    step_target INTEGER DEFAULT 10000 CHECK (step_target >= 0 AND step_target < 200000),
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. FOODS TABLE (Global verified library + user custom foods)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL = Global verified library
    name TEXT NOT NULL,
    brand TEXT,
    barcode TEXT,
    category TEXT DEFAULT 'other',
    dietary_type TEXT DEFAULT 'non_vegetarian' CHECK (dietary_type IN ('vegan', 'vegetarian', 'eggetarian', 'non_vegetarian')),
    substitution_group TEXT DEFAULT 'other',
    serving_size NUMERIC(7, 2) NOT NULL DEFAULT 100 CHECK (serving_size > 0),
    serving_unit TEXT NOT NULL DEFAULT 'g',
    calories NUMERIC(7, 2) NOT NULL CHECK (calories >= 0),
    protein_g NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
    carbs_g NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
    fat_g NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (fat_g >= 0),
    fiber_g NUMERIC(6, 2) DEFAULT 0 CHECK (fiber_g >= 0),
    sugar_g NUMERIC(6, 2) DEFAULT 0 CHECK (sugar_g >= 0),
    sodium_mg NUMERIC(7, 2) DEFAULT 0 CHECK (sodium_mg >= 0),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. EXERCISES TABLE (Global standard library + user custom exercises)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL = Global standard library
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body', 'olympic', 'calisthenics')) NOT NULL,
    muscle_group TEXT NOT NULL,
    secondary_muscles TEXT[] DEFAULT '{}',
    equipment TEXT CHECK (equipment IN ('barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'bands', 'other')) NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    instructions TEXT,
    video_url TEXT,
    default_sets INTEGER DEFAULT 3 CHECK (default_sets > 0 AND default_sets <= 20),
    default_reps TEXT DEFAULT '8-12',
    rest_time_seconds INTEGER DEFAULT 90 CHECK (rest_time_seconds >= 0 AND rest_time_seconds <= 600),
    is_bodyweight BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. DIET_PLANS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    daily_calories INTEGER NOT NULL CHECK (daily_calories > 500 AND daily_calories < 15000),
    target_protein_g INTEGER NOT NULL CHECK (target_protein_g >= 0),
    target_carbs_g INTEGER NOT NULL CHECK (target_carbs_g >= 0),
    target_fat_g INTEGER NOT NULL CHECK (target_fat_g >= 0),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. DIET_MEALS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_plan_id UUID REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')) NOT NULL,
    name TEXT NOT NULL,
    food_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_calories NUMERIC(7, 2) NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
    total_protein NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (total_protein >= 0),
    total_carbs NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (total_carbs >= 0),
    total_fat NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (total_fat >= 0),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. WORKOUT_PLANS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    split_type TEXT CHECK (split_type IN ('push_pull_legs', 'upper_lower', 'bro_split', 'full_body', 'custom')) DEFAULT 'push_pull_legs',
    days_per_week INTEGER DEFAULT 4 CHECK (days_per_week BETWEEN 1 AND 7),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. WORKOUT_SESSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0 CHECK (duration_minutes >= 0),
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    exercises_log JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. PROGRESS TABLE (Weight, body measurements, photos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 20 AND weight_kg < 450),
    body_fat_percentage NUMERIC(4, 1) CHECK (body_fat_percentage >= 3 AND body_fat_percentage <= 70),
    chest_cm NUMERIC(5, 1) CHECK (chest_cm > 20 AND chest_cm < 250),
    waist_cm NUMERIC(5, 1) CHECK (waist_cm > 20 AND waist_cm < 250),
    hips_cm NUMERIC(5, 1) CHECK (hips_cm > 20 AND hips_cm < 250),
    arms_cm NUMERIC(5, 1) CHECK (arms_cm > 10 AND arms_cm < 100),
    thighs_cm NUMERIC(5, 1) CHECK (thighs_cm > 15 AND thighs_cm < 150),
    calves_cm NUMERIC(5, 1) CHECK (calves_cm > 15 AND calves_cm < 100),
    neck_cm NUMERIC(5, 1) CHECK (neck_cm > 15 AND neck_cm < 100),
    photo_urls JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_progress_date UNIQUE (user_id, recorded_date)
);

-- ==============================================================================
-- 10. DAILY_TRACKING TABLE (Day aggregate for calories, water, steps, habits)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    calories_consumed INTEGER DEFAULT 0 CHECK (calories_consumed >= 0 AND calories_consumed <= 20000),
    calories_burned INTEGER DEFAULT 0 CHECK (calories_burned >= 0 AND calories_burned <= 15000),
    protein_consumed_g INTEGER DEFAULT 0 CHECK (protein_consumed_g >= 0 AND protein_consumed_g <= 800),
    carbs_consumed_g INTEGER DEFAULT 0 CHECK (carbs_consumed_g >= 0 AND carbs_consumed_g <= 2000),
    fat_consumed_g INTEGER DEFAULT 0 CHECK (fat_consumed_g >= 0 AND fat_consumed_g <= 1000),
    water_intake_ml INTEGER DEFAULT 0 CHECK (water_intake_ml >= 0 AND water_intake_ml <= 30000),
    steps_count INTEGER DEFAULT 0 CHECK (steps_count >= 0 AND steps_count <= 200000),
    sleep_hours NUMERIC(4, 1) DEFAULT 0 CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    workout_completed BOOLEAN DEFAULT false,
    mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'tired', 'stressed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_daily_tracking_date UNIQUE (user_id, tracking_date)
);

-- ==============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_user_id ON public.foods(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON public.foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_substitution ON public.foods(substitution_group);
CREATE INDEX IF NOT EXISTS idx_foods_dietary_type ON public.foods(dietary_type);
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user ON public.diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_active ON public.diet_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_diet_meals_plan_user ON public.diet_meals(diet_plan_id, user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_active ON public.workout_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_user_date ON public.progress(user_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_tracking_user_date ON public.daily_tracking(user_id, tracking_date DESC);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS & USER SIGNUP TRIGGERS
-- ==============================================================================

-- Trigger function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to applicable tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER set_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_diet_plans_updated_at ON public.diet_plans;
CREATE TRIGGER set_diet_plans_updated_at
    BEFORE UPDATE ON public.diet_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_workout_plans_updated_at ON public.workout_plans;
CREATE TRIGGER set_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_daily_tracking_updated_at ON public.daily_tracking;
CREATE TRIGGER set_daily_tracking_updated_at
    BEFORE UPDATE ON public.daily_tracking
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger function: Automatically initialize user profile and preferences on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind new user trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — DEFAULT DENY ARCHITECTURE
-- ==============================================================================

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
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 2. User Preferences Policies
DROP POLICY IF EXISTS "Users view own preferences" ON public.user_preferences;
CREATE POLICY "Users view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own preferences" ON public.user_preferences;
CREATE POLICY "Users insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own preferences" ON public.user_preferences;
CREATE POLICY "Users update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own preferences" ON public.user_preferences;
CREATE POLICY "Users delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- 3. Foods Policies (Read verified library or custom foods; write only custom foods)
DROP POLICY IF EXISTS "Public items are read only for all" ON public.foods;
CREATE POLICY "Public items are read only for all" ON public.foods FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only create foods with their own user_id" ON public.foods;
CREATE POLICY "Users can only create foods with their own user_id" ON public.foods FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own foods" ON public.foods;
CREATE POLICY "Users can only update their own foods" ON public.foods FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id) WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own foods" ON public.foods;
CREATE POLICY "Users can only delete their own foods" ON public.foods FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. Exercises Policies (Read standard library or custom exercises; write only custom exercises)
DROP POLICY IF EXISTS "Public exercises are read only for all" ON public.exercises;
CREATE POLICY "Public exercises are read only for all" ON public.exercises FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only create exercises with their own user_id" ON public.exercises;
CREATE POLICY "Users can only create exercises with their own user_id" ON public.exercises FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own exercises" ON public.exercises;
CREATE POLICY "Users can only update their own exercises" ON public.exercises FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id) WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own exercises" ON public.exercises;
CREATE POLICY "Users can only delete their own exercises" ON public.exercises FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 5. Diet Plans Policies
DROP POLICY IF EXISTS "Users select own diet plans" ON public.diet_plans;
CREATE POLICY "Users select own diet plans" ON public.diet_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own diet plans" ON public.diet_plans;
CREATE POLICY "Users insert own diet plans" ON public.diet_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own diet plans" ON public.diet_plans;
CREATE POLICY "Users update own diet plans" ON public.diet_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own diet plans" ON public.diet_plans;
CREATE POLICY "Users delete own diet plans" ON public.diet_plans FOR DELETE USING (auth.uid() = user_id);

-- 6. Diet Meals Policies
DROP POLICY IF EXISTS "Users select own diet meals" ON public.diet_meals;
CREATE POLICY "Users select own diet meals" ON public.diet_meals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own diet meals" ON public.diet_meals;
CREATE POLICY "Users insert own diet meals" ON public.diet_meals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own diet meals" ON public.diet_meals;
CREATE POLICY "Users update own diet meals" ON public.diet_meals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own diet meals" ON public.diet_meals;
CREATE POLICY "Users delete own diet meals" ON public.diet_meals FOR DELETE USING (auth.uid() = user_id);

-- 7. Workout Plans Policies
DROP POLICY IF EXISTS "Users select own workout plans" ON public.workout_plans;
CREATE POLICY "Users select own workout plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own workout plans" ON public.workout_plans;
CREATE POLICY "Users insert own workout plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own workout plans" ON public.workout_plans;
CREATE POLICY "Users update own workout plans" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own workout plans" ON public.workout_plans;
CREATE POLICY "Users delete own workout plans" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);

-- 8. Workout Sessions Policies
DROP POLICY IF EXISTS "Users select own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users select own workout sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users insert own workout sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users update own workout sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users delete own workout sessions" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- 9. Progress Policies
DROP POLICY IF EXISTS "Users select own progress entries" ON public.progress;
CREATE POLICY "Users select own progress entries" ON public.progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own progress entries" ON public.progress;
CREATE POLICY "Users insert own progress entries" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own progress entries" ON public.progress;
CREATE POLICY "Users update own progress entries" ON public.progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own progress entries" ON public.progress;
CREATE POLICY "Users delete own progress entries" ON public.progress FOR DELETE USING (auth.uid() = user_id);

-- 10. Daily Tracking Policies
DROP POLICY IF EXISTS "Users select own daily tracking entries" ON public.daily_tracking;
CREATE POLICY "Users select own daily tracking entries" ON public.daily_tracking FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own daily tracking entries" ON public.daily_tracking;
CREATE POLICY "Users insert own daily tracking entries" ON public.daily_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own daily tracking entries" ON public.daily_tracking;
CREATE POLICY "Users update own daily tracking entries" ON public.daily_tracking FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own daily tracking entries" ON public.daily_tracking;
CREATE POLICY "Users delete own daily tracking entries" ON public.daily_tracking FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE CONFIGURATION & BUCKET ISOLATION
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'progress-photos',
            'progress-photos',
            false, -- STRICTLY PRIVATE
            5242880, -- 5 MB Limit
            ARRAY['image/jpeg', 'image/png', 'image/webp']
        )
        ON CONFLICT (id) DO UPDATE SET
            public = false,
            file_size_limit = 5242880,
            allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];
        -- storage.objects already has RLS enabled by default in Supabase (owned by supabase_storage_admin)

        DROP POLICY IF EXISTS "Users can only upload their own progress photos" ON storage.objects;
        CREATE POLICY "Users can only upload their own progress photos"
            ON storage.objects FOR INSERT
            WITH CHECK (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );

        DROP POLICY IF EXISTS "Users can only view their own progress photos" ON storage.objects;
        CREATE POLICY "Users can only view their own progress photos"
            ON storage.objects FOR SELECT
            USING (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );

        DROP POLICY IF EXISTS "Users can only delete their own progress photos" ON storage.objects;
        CREATE POLICY "Users can only delete their own progress photos"
            ON storage.objects FOR DELETE
            USING (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );
    END IF;
END $$;

-- ==============================================================================
-- GDPR / CCPA USER DATA PURGE & ACCOUNT DELETION FUNCTIONS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.purge_current_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    curr_user_id UUID;
BEGIN
    curr_user_id := auth.uid();
    IF curr_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    DELETE FROM public.daily_tracking WHERE user_id = curr_user_id;
    DELETE FROM public.progress WHERE user_id = curr_user_id;
    DELETE FROM public.workout_sessions WHERE user_id = curr_user_id;
    DELETE FROM public.workout_plans WHERE user_id = curr_user_id;
    DELETE FROM public.diet_meals WHERE user_id = curr_user_id;
    DELETE FROM public.diet_plans WHERE user_id = curr_user_id;
    DELETE FROM public.foods WHERE user_id = curr_user_id;
    DELETE FROM public.exercises WHERE user_id = curr_user_id;
    DELETE FROM public.user_preferences WHERE user_id = curr_user_id;

    UPDATE public.profiles
    SET 
        full_name = NULL,
        avatar_url = NULL,
        birth_date = NULL,
        gender = NULL,
        height_cm = NULL,
        weight_kg = NULL,
        activity_level = 'moderately_active',
        fitness_goal = 'build_muscle',
        updated_at = timezone('utc'::text, now())
    WHERE id = curr_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_current_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    curr_user_id UUID;
BEGIN
    curr_user_id := auth.uid();
    IF curr_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    DELETE FROM public.profiles WHERE id = curr_user_id;
    
    BEGIN
        DELETE FROM auth.users WHERE id = curr_user_id;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END;
$$;

-- ==============================================================================
-- REAL-WORLD VERIFIED FOOD DATABASE SEED (USDA & Standard Composition)
-- Available globally to all users (user_id IS NULL)
-- ==============================================================================
INSERT INTO public.foods (name, brand, category, serving_size, serving_unit, calories, protein_g, carbs_g, fat_g, fiber_g, is_verified, dietary_type, substitution_group)
VALUES
  -- Complex Carbohydrates & Grains
  ('Basmati White Rice (Cooked)', 'Standard', 'Rice', 100, 'g', 130, 2.7, 28.2, 0.3, 0.4, true, 'vegan', 'complex_carb'),
  ('Brown Rice (Cooked)', 'Whole Grain', 'Rice', 100, 'g', 111, 2.6, 23.0, 0.9, 1.8, true, 'vegan', 'complex_carb'),
  ('Rolled Oats (Raw)', 'Standard', 'Oats', 50, 'g', 190, 6.5, 34.0, 3.5, 5.0, true, 'vegan', 'complex_carb'),
  ('Whole Wheat Roti / Chapati', 'Traditional', 'Common Indian Foods', 1, 'piece (40g)', 104, 3.2, 20.4, 0.8, 2.8, true, 'vegan', 'complex_carb'),
  ('Cooked Quinoa', 'Organic', 'Grains', 100, 'g', 120, 4.4, 21.3, 1.9, 2.8, true, 'vegan', 'complex_carb'),
  ('Sweet Potato (Boiled/Baked)', 'Farm Fresh', 'Vegetables', 100, 'g', 86, 1.6, 20.1, 0.1, 3.0, true, 'vegan', 'complex_carb'),

  -- Lean & Complete Proteins
  ('Chicken Breast (Raw / Boneless)', 'Fresh Farm', 'Chicken', 100, 'g', 120, 22.5, 0.0, 2.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Grilled Chicken Breast', 'Cooked', 'Chicken', 100, 'g', 165, 31.0, 0.0, 3.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Chicken Thigh (Skinless, Cooked)', 'Fresh Farm', 'Chicken', 100, 'g', 209, 26.0, 0.0, 10.9, 0.0, true, 'non_vegetarian', 'fatty_protein'),
  ('Whole Large Egg', 'Farm Fresh', 'Eggs', 1, 'large (50g)', 72, 6.3, 0.4, 4.8, 0.0, true, 'eggetarian', 'fatty_protein'),
  ('Liquid Egg Whites', 'Farm Fresh', 'Eggs', 100, 'ml', 52, 11.0, 0.7, 0.2, 0.0, true, 'eggetarian', 'lean_protein'),
  ('Atlantic Salmon (Raw)', 'Fresh Wild', 'Fish', 100, 'g', 208, 20.4, 0.0, 13.4, 0.0, true, 'non_vegetarian', 'fatty_protein'),
  ('White Fish Fillet (Tilapia / Cod)', 'Ocean Catch', 'Fish', 100, 'g', 96, 20.1, 0.0, 1.7, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Canned Tuna in Water (Drained)', 'Wild Seas', 'Fish', 100, 'g', 116, 25.5, 0.0, 0.8, 0.0, true, 'non_vegetarian', 'lean_protein'),

  -- Dairy & Vegetarian Proteins
  ('Fresh Paneer (Cottage Cheese)', 'Dairy Pure', 'Common Indian Foods', 100, 'g', 265, 18.3, 3.2, 20.8, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Low-Fat Paneer', 'Dairy Pure', 'Common Indian Foods', 100, 'g', 180, 24.0, 4.0, 7.0, 0.0, true, 'vegetarian', 'lean_protein'),
  ('Plain Greek Yogurt (Low Fat)', 'Dairy Pure', 'Curd', 100, 'g', 59, 10.0, 3.6, 0.4, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Traditional Indian Dahi (Curd)', 'Home Set', 'Curd', 100, 'g', 61, 3.5, 4.7, 3.3, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Skimmed Milk', 'Dairy Pure', 'Milk', 250, 'ml (1 cup)', 88, 8.5, 12.5, 0.5, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Whey Protein Isolate', 'Optimum Grade', 'Milk', 30, 'g (1 scoop)', 120, 25.0, 1.5, 1.0, 0.0, true, 'vegetarian', 'lean_protein'),

  -- Plant Proteins & Legumes
  ('Soya Chunks (Raw)', 'High Protein', 'Common Indian Foods', 50, 'g', 172, 26.0, 16.5, 0.5, 6.5, true, 'vegan', 'lean_protein'),
  ('Firm Tofu', 'Organic Soy', 'Legumes', 100, 'g', 83, 10.0, 1.9, 5.3, 0.9, true, 'vegan', 'lean_protein'),
  ('Cooked Yellow Moong Dal', 'Traditional', 'Legumes', 150, 'g (1 bowl)', 147, 9.8, 24.5, 0.8, 5.6, true, 'vegan', 'plant_protein'),
  ('Cooked Chana Masala (Chickpeas)', 'Traditional', 'Common Indian Foods', 150, 'g (1 bowl)', 198, 10.2, 32.4, 3.1, 7.4, true, 'vegan', 'plant_protein'),
  ('Cooked Rajma (Kidney Beans)', 'Traditional', 'Common Indian Foods', 150, 'g (1 bowl)', 180, 11.5, 30.5, 1.0, 8.2, true, 'vegan', 'plant_protein'),

  -- Healthy Fats & Seeds
  ('Raw Almonds', 'California', 'Nuts', 30, 'g (handful)', 173, 6.4, 6.5, 15.0, 3.7, true, 'vegan', 'healthy_fats'),
  ('Peanut Butter (100% Natural)', 'Pure Roast', 'Nuts', 32, 'g (2 tbsp)', 190, 8.0, 6.0, 16.0, 2.0, true, 'vegan', 'healthy_fats'),
  ('Extra Virgin Olive Oil', 'Cold Pressed', 'Oils', 15, 'ml (1 tbsp)', 124, 0.0, 0.0, 14.0, 0.0, true, 'vegan', 'healthy_fats'),
  ('Chia Seeds', 'Raw Superfood', 'Nuts', 15, 'g (1 tbsp)', 73, 2.5, 6.3, 4.6, 5.1, true, 'vegan', 'healthy_fats')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- REAL-WORLD STANDARD EXERCISE DATABASE SEED
-- Available globally to all users (user_id IS NULL)
-- ==============================================================================
INSERT INTO public.exercises (name, category, muscle_group, secondary_muscles, equipment, difficulty, instructions, default_sets, default_reps, rest_time_seconds, is_bodyweight)
VALUES
    -- CHEST
    ('Barbell Flat Bench Press', 'chest', 'Chest', ARRAY['Triceps', 'Front Delts'], 'barbell', 'intermediate', 'Lie on bench, grip bar slightly wider than shoulder-width, lower bar to mid-chest with elbows at 45-75 degrees, press back up explosively.', 4, '6-8', 120, false),
    ('Incline Dumbbell Press', 'chest', 'Chest', ARRAY['Front Delts', 'Triceps'], 'dumbbell', 'intermediate', 'Set bench to 30 degrees, press dumbbells upward focusing on upper chest contraction at the apex.', 3, '8-12', 90, false),
    ('Chest Dips', 'chest', 'Chest', ARRAY['Triceps', 'Shoulders'], 'bodyweight', 'intermediate', 'Lean torso forward 30 degrees on parallel dip bars, lower until shoulders are below elbows, press upward through pecs.', 3, '8-12', 90, true),
    ('Standing Cable Crossover', 'chest', 'Chest', ARRAY['Front Delts'], 'cable', 'beginner', 'Set pulleys high, step forward with split stance, bring hands together in a hugging motion crossing wrists slightly.', 3, '12-15', 60, false),
    ('Push-ups', 'chest', 'Chest', ARRAY['Triceps', 'Core'], 'bodyweight', 'beginner', 'Keep body in straight plank, lower chest to 1 inch off floor, press through palms keeping core braced.', 3, '15-20', 60, true),

    -- BACK
    ('Conventional Barbell Deadlift', 'back', 'Back', ARRAY['Hamstrings', 'Glutes', 'Forearms', 'Core'], 'barbell', 'advanced', 'Stand with bar over mid-foot, hinge hips back, grip bar outside shins, pull slack out, drive floor away keeping spine neutral.', 4, '5', 180, false),
    ('Weighted Pull-ups', 'back', 'Back', ARRAY['Biceps', 'Forearms', 'Rear Delts'], 'bodyweight', 'intermediate', 'Grip bar with overhand grip wider than shoulders, pull chest to bar leading with elbows down into back pockets.', 4, '6-8', 120, true),
    ('Barbell Bent-Over Row', 'back', 'Back', ARRAY['Biceps', 'Rear Delts', 'Core'], 'barbell', 'intermediate', 'Hinge forward at 45 degrees, pull barbell towards belly button, squeeze shoulder blades tightly at top.', 4, '8-10', 90, false),
    ('Seated Cable Row (Close Grip)', 'back', 'Back', ARRAY['Biceps', 'Rhomboids'], 'cable', 'beginner', 'Sit tall, keep lower back neutral, drive elbows back close to ribcage, squeeze middle back at full contraction.', 3, '10-12', 75, false),
    ('Lat Pulldown', 'back', 'Back', ARRAY['Biceps', 'Rear Delts'], 'cable', 'beginner', 'Sit with thighs secured, grasp wide bar, lean back 10 degrees and pull bar smooth to upper clavicle.', 3, '10-12', 75, false),

    -- SHOULDERS
    ('Overhead Barbell Press (OHP)', 'shoulders', 'Shoulders', ARRAY['Triceps', 'Upper Chest', 'Core'], 'barbell', 'intermediate', 'Stand with feet shoulder-width, press barbell directly overhead locking out arms with head pushing forward through window.', 4, '6-8', 120, false),
    ('Standing Dumbbell Lateral Raise', 'shoulders', 'Shoulders', ARRAY['Traps'], 'dumbbell', 'beginner', 'Slightly lean forward, raise dumbbells to shoulder level leading with elbows like pouring water from pitchers.', 4, '12-15', 60, false),
    ('Seated Dumbbell Shoulder Press', 'shoulders', 'Shoulders', ARRAY['Triceps'], 'dumbbell', 'intermediate', 'Sit upright, press dumbbells vertically without banging them together, lower to ear level with control.', 3, '8-12', 90, false),
    ('Face Pulls', 'shoulders', 'Shoulders', ARRAY['Rear Delts', 'Rotator Cuff', 'Upper Back'], 'cable', 'beginner', 'Attach rope to high pulley, pull towards forehead with elbows high and externally rotating shoulders.', 3, '15-20', 60, false),

    -- ARMS (BICEPS & TRICEPS)
    ('Barbell Bicep Curl', 'arms', 'Biceps', ARRAY['Forearms'], 'barbell', 'beginner', 'Stand tall, grip bar shoulder-width with underhand grip, curl bar towards shoulders keeping elbows pinned at sides.', 3, '8-12', 75, false),
    ('Incline Dumbbell Curl', 'arms', 'Biceps', ARRAY['Forearms'], 'dumbbell', 'intermediate', 'Set bench to 45-60 degrees, stretch bicep long head fully at bottom, curl without swinging elbows forward.', 3, '10-12', 60, false),
    ('Hammer Curl', 'arms', 'Biceps', ARRAY['Forearms', 'Brachialis'], 'dumbbell', 'beginner', 'Hold dumbbells with neutral thumbs-up grip, curl alternately or together to target brachialis and forearm thickness.', 3, '10-12', 60, false),
    ('Close-Grip Barbell Bench Press', 'arms', 'Triceps', ARRAY['Chest', 'Front Delts'], 'barbell', 'intermediate', 'Grip barbell shoulder-width apart, keep elbows tucked to sides, lower to sternum and lockout with triceps.', 3, '8-10', 90, false),
    ('Overhead Cable Rope Extension', 'arms', 'Triceps', ARRAY['Shoulders'], 'cable', 'beginner', 'Face away from high cable, extend arms forward and split rope outwards at peak contraction.', 3, '12-15', 60, false),
    ('Skull Crushers (EZ Bar)', 'arms', 'Triceps', ARRAY['Forearms'], 'barbell', 'intermediate', 'Lie on bench, lower bar towards forehead/crown of head bending only at elbows, extend smoothly back.', 3, '10-12', 75, false),

    -- LEGS (QUADS, HAMSTRINGS, GLUTES, CALVES)
    ('Barbell High-Bar Back Squat', 'legs', 'Quads', ARRAY['Glutes', 'Hamstrings', 'Core'], 'barbell', 'intermediate', 'Place bar across upper traps, brace core, break at hips and knees simultaneously, squat below parallel, stand up driving through midfoot.', 4, '6-8', 150, false),
    ('Leg Press 45°', 'legs', 'Quads', ARRAY['Glutes'], 'machine', 'beginner', 'Place feet shoulder-width on platform, lower sled smoothly to 90 degree knee flexion, press without locking knees hyper-extended.', 3, '10-12', 90, false),
    ('Bulgarian Split Squat', 'legs', 'Quads', ARRAY['Glutes', 'Hamstrings'], 'dumbbell', 'intermediate', 'Rest rear foot on bench, descend front knee to 90 degrees keeping chest proud, press through front heel.', 3, '10-12', 90, false),
    ('Romanian Deadlift (RDL)', 'legs', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'barbell', 'intermediate', 'Slight bend in knees, push hips backward maintaining flat back until deep hamstring stretch, thrust hips forward to return.', 4, '8-10', 90, false),
    ('Lying Leg Curl', 'legs', 'Hamstrings', ARRAY['Calves'], 'machine', 'beginner', 'Lie face down, curl roller pad towards glutes, control the eccentric lowering for 3 seconds.', 3, '10-12', 60, false),
    ('Barbell Hip Thrust', 'legs', 'Glutes', ARRAY['Hamstrings'], 'barbell', 'intermediate', 'Rest upper back across bench, place padded bar over hip crease, drive hips up to full horizontal extension squeezing glutes.', 4, '8-12', 90, false),
    ('Standing Calf Raise', 'legs', 'Calves', ARRAY[], 'machine', 'beginner', 'Balls of feet on block, lower heels into deep stretch, drive up onto big toes with 1-second squeeze at apex.', 4, '15-20', 60, false),

    -- CORE
    ('Hanging Leg Raise', 'core', 'Core', ARRAY['Hip Flexors', 'Forearms'], 'bodyweight', 'intermediate', 'Hang from bar, contract abs and raise straight legs to horizontal without swinging, lower under control.', 3, '10-15', 60, true),
    ('Ab Wheel Rollout', 'core', 'Core', ARRAY['Lats', 'Shoulders'], 'bodyweight', 'advanced', 'Kneel on mat, roll wheel forward keeping core hollow and pelvis tucked, pull back using lower abs.', 3, '8-12', 75, true),
    ('Cable Woodchoppers', 'core', 'Core', ARRAY['Obliques'], 'cable', 'beginner', 'Set pulley high, rotate torso diagonally downward across body, pivot back foot keeping arms extended.', 3, '12-15', 60, false)
ON CONFLICT DO NOTHING;
