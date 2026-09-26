-- ==============================================================================
-- PART 4 MIGRATION: FITNESS TRACKING & PRIVATE STORAGE SYSTEM
-- Description: Extends progress and daily_tracking tables, sets up private photo bucket
-- ==============================================================================

-- 1. Extend progress table with neck measurement
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS neck_cm NUMERIC(5, 1);

-- 2. Extend daily_tracking table with workout completion status
ALTER TABLE public.daily_tracking ADD COLUMN IF NOT EXISTS workout_completed BOOLEAN DEFAULT false;

-- 3. Ensure RLS is active on tables
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

-- 4. Create Private Storage Bucket for Progress Photos if storage schema exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        -- Insert private bucket
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

        -- Ensure RLS on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

        -- RLS Policies for Progress Photos: Owner-Only Access
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
