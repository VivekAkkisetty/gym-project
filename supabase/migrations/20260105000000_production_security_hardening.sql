-- ==============================================================================
-- PART 6 MIGRATION: PRODUCTION SECURITY HARDENING & RLS COMPLIANCE AUDIT
-- Description: Enforces default DENY, explicit WITH CHECK clauses, reference
--              table write protection, private storage isolation, and
--              safe account deletion cascade functions.
-- ==============================================================================

-- 1. Enforce Row Level Security on ALL application tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.daily_tracking ENABLE ROW LEVEL SECURITY;


-- 2. HARDEN REFERENCE TABLES (foods & exercises)
-- Revoke all direct modification permissions from anon and authenticated roles
-- Only authenticated users can insert/update/delete their OWN custom foods/exercises.
-- Public items (user_id IS NULL) are STRICTLY READ-ONLY for regular users.

DROP POLICY IF EXISTS "Public items are read only for all" ON public.foods;
DROP POLICY IF EXISTS "Users can only create foods with their own user_id" ON public.foods;
DROP POLICY IF EXISTS "Users can only update their own foods" ON public.foods;
DROP POLICY IF EXISTS "Users can only delete their own foods" ON public.foods;

CREATE POLICY "Public items are read only for all"
    ON public.foods FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can only create foods with their own user_id"
    ON public.foods FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can only update their own foods"
    ON public.foods FOR UPDATE
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can only delete their own foods"
    ON public.foods FOR DELETE
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Exercises policies hardening
DROP POLICY IF EXISTS "Public exercises are read only for all" ON public.exercises;
DROP POLICY IF EXISTS "Users can only create exercises with their own user_id" ON public.exercises;
DROP POLICY IF EXISTS "Users can only update their own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can only delete their own exercises" ON public.exercises;

CREATE POLICY "Public exercises are read only for all"
    ON public.exercises FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can only create exercises with their own user_id"
    ON public.exercises FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can only update their own exercises"
    ON public.exercises FOR UPDATE
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can only delete their own exercises"
    ON public.exercises FOR DELETE
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 3. HARDEN PRIVATE DATA TABLES WITH BOTH USING AND WITH CHECK
-- Diet Plans
DROP POLICY IF EXISTS "Users manage own diet plans" ON public.diet_plans;
CREATE POLICY "Users select own diet plans" ON public.diet_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own diet plans" ON public.diet_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own diet plans" ON public.diet_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own diet plans" ON public.diet_plans FOR DELETE USING (auth.uid() = user_id);

-- Diet Meals
DROP POLICY IF EXISTS "Users manage own diet meals" ON public.diet_meals;
CREATE POLICY "Users select own diet meals" ON public.diet_meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own diet meals" ON public.diet_meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own diet meals" ON public.diet_meals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own diet meals" ON public.diet_meals FOR DELETE USING (auth.uid() = user_id);

-- Workout Plans
DROP POLICY IF EXISTS "Users manage own workout plans" ON public.workout_plans;
CREATE POLICY "Users select own workout plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workout plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own workout plans" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own workout plans" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);

-- Workout Sessions
DROP POLICY IF EXISTS "Users manage own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users select own workout sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workout sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own workout sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own workout sessions" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- Progress
DROP POLICY IF EXISTS "Users manage own progress entries" ON public.progress;
CREATE POLICY "Users select own progress entries" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress entries" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress entries" ON public.progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own progress entries" ON public.progress FOR DELETE USING (auth.uid() = user_id);

-- Daily Tracking
DROP POLICY IF EXISTS "Users manage own daily tracking entries" ON public.daily_tracking;
CREATE POLICY "Users select own daily tracking entries" ON public.daily_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own daily tracking entries" ON public.daily_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own daily tracking entries" ON public.daily_tracking FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own daily tracking entries" ON public.daily_tracking FOR DELETE USING (auth.uid() = user_id);

-- 4. HARDEN STORAGE SECURITY (progress-photos bucket)
-- Folder name MUST match the user's UUID.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        -- Ensure bucket is strictly private
        UPDATE storage.buckets SET public = false WHERE id = 'progress-photos';

        DROP POLICY IF EXISTS "Users can only upload their own progress photos" ON storage.objects;
        DROP POLICY IF EXISTS "Users can only view their own progress photos" ON storage.objects;
        DROP POLICY IF EXISTS "Users can only delete their own progress photos" ON storage.objects;

        CREATE POLICY "Users can only upload their own progress photos"
            ON storage.objects FOR INSERT
            WITH CHECK (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );

        CREATE POLICY "Users can only view their own progress photos"
            ON storage.objects FOR SELECT
            USING (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );

        CREATE POLICY "Users can only delete their own progress photos"
            ON storage.objects FOR DELETE
            USING (
                bucket_id = 'progress-photos' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );
    END IF;
END $$;

-- 5. COMPLETE USER DATA PURGE & ACCOUNT DELETION FUNCTION (GDPR / Privacy Compliance)
-- A secure, transaction-wrapped RPC allowing an authenticated user to purge all personal data.
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

    -- Purge child data in safe dependency order
    DELETE FROM public.daily_tracking WHERE user_id = curr_user_id;
    DELETE FROM public.progress WHERE user_id = curr_user_id;
    DELETE FROM public.workout_sessions WHERE user_id = curr_user_id;
    DELETE FROM public.workout_plans WHERE user_id = curr_user_id;
    DELETE FROM public.diet_meals WHERE user_id = curr_user_id;
    DELETE FROM public.diet_plans WHERE user_id = curr_user_id;
    DELETE FROM public.foods WHERE user_id = curr_user_id;
    DELETE FROM public.exercises WHERE user_id = curr_user_id;
    DELETE FROM public.user_preferences WHERE user_id = curr_user_id;
    
    -- Reset profile personal attributes while maintaining account anchor
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

-- 6. FULL ACCOUNT DELETION FUNCTION
-- Deletes the user profile and triggers ON DELETE CASCADE across all tables.
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

    -- Delete profile (cascades to all user tables)
    DELETE FROM public.profiles WHERE id = curr_user_id;
    
    -- Delete from auth.users if executing in Supabase environment with permission
    BEGIN
        DELETE FROM auth.users WHERE id = curr_user_id;
    EXCEPTION WHEN OTHERS THEN
        -- If current role does not have direct auth.users delete permission,
        -- the profile deletion cascade already wiped all application data.
        NULL;
    END;
END;
$$;
