-- ==============================================================================
-- PART 3 MIGRATION: WORKOUT PLATFORM & EXERCISES SEED
-- Description: Enhances exercises table and seeds standard exercise library
-- ==============================================================================

-- 1. Add extended columns to exercises table if not already present
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS default_sets INTEGER DEFAULT 3;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS default_reps TEXT DEFAULT '8-12';
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS rest_time_seconds INTEGER DEFAULT 90;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS is_bodyweight BOOLEAN DEFAULT false;

-- 2. Ensure RLS policies exist and are enabled
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Seed Comprehensive Exercise Database (Standard library, user_id IS NULL)
-- Covering: Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Abs, Forearms
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

    -- BICEPS
    ('Barbell Bicep Curl', 'arms', 'Biceps', ARRAY['Forearms'], 'barbell', 'beginner', 'Stand tall, grip bar shoulder-width with underhand grip, curl bar towards shoulders keeping elbows pinned at sides.', 3, '8-12', 75, false),
    ('Incline Dumbbell Curl', 'arms', 'Biceps', ARRAY['Forearms'], 'dumbbell', 'intermediate', 'Set bench to 45-60 degrees, stretch bicep long head fully at bottom, curl without swinging elbows forward.', 3, '10-12', 60, false),
    ('Hammer Curl', 'arms', 'Biceps', ARRAY['Forearms', 'Brachialis'], 'dumbbell', 'beginner', 'Hold dumbbells with neutral thumbs-up grip, curl alternately or together to target brachialis and forearm thickness.', 3, '10-12', 60, false),

    -- TRICEPS
    ('Close-Grip Barbell Bench Press', 'arms', 'Triceps', ARRAY['Chest', 'Front Delts'], 'barbell', 'intermediate', 'Grip barbell shoulder-width apart, keep elbows tucked to sides, lower to sternum and lockout with triceps.', 3, '8-10', 90, false),
    ('Overhead Cable Rope Extension', 'arms', 'Triceps', ARRAY['Shoulders'], 'cable', 'beginner', 'Face away from high cable, extend arms forward and split rope outwards at peak contraction.', 3, '12-15', 60, false),
    ('Tricep Dips on Parallel Bars', 'arms', 'Triceps', ARRAY['Chest', 'Shoulders'], 'bodyweight', 'intermediate', 'Keep torso upright to bias triceps, lower until upper arms parallel to floor, press up to strong lockout.', 3, '8-12', 90, true),
    ('Skull Crushers (EZ Bar)', 'arms', 'Triceps', ARRAY['Forearms'], 'barbell', 'intermediate', 'Lie on bench, lower bar towards forehead/crown of head bending only at elbows, extend smoothly back.', 3, '10-12', 75, false),

    -- QUADS
    ('Barbell High-Bar Back Squat', 'legs', 'Quads', ARRAY['Glutes', 'Hamstrings', 'Core'], 'barbell', 'intermediate', 'Place bar across upper traps, brace core, break at hips and knees simultaneously, squat below parallel, stand up driving through midfoot.', 4, '6-8', 150, false),
    ('Leg Press 45°', 'legs', 'Quads', ARRAY['Glutes'], 'machine', 'beginner', 'Place feet shoulder-width on platform, lower sled smoothly to 90 degree knee flexion, press without locking knees hyper-extended.', 3, '10-12', 90, false),
    ('Bulgarian Split Squat', 'legs', 'Quads', ARRAY['Glutes', 'Hamstrings'], 'dumbbell', 'intermediate', 'Rest rear foot on bench, descend front knee to 90 degrees keeping chest proud, press through front heel.', 3, '10-12', 90, false),
    ('Leg Extension', 'legs', 'Quads', ARRAY[], 'machine', 'beginner', 'Sit with pad against lower shins, extend legs to full contraction with 1-second pause at top.', 3, '12-15', 60, false),

    -- HAMSTRINGS
    ('Romanian Deadlift (RDL)', 'legs', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'barbell', 'intermediate', 'Slight bend in knees, push hips backward maintaining flat back until deep hamstring stretch, thrust hips forward to return.', 4, '8-10', 90, false),
    ('Lying Leg Curl', 'legs', 'Hamstrings', ARRAY['Calves'], 'machine', 'beginner', 'Lie face down, curl roller pad towards glutes, control the eccentric lowering for 3 seconds.', 3, '10-12', 60, false),
    ('Nordic Hamstring Curl', 'legs', 'Hamstrings', ARRAY['Glutes', 'Calves'], 'bodyweight', 'advanced', 'Anchor ankles, lower body slowly towards floor fighting gravity with hamstring eccentrics, catch with hands and push back up.', 3, '5-8', 120, true),

    -- GLUTES
    ('Barbell Hip Thrust', 'legs', 'Glutes', ARRAY['Hamstrings'], 'barbell', 'intermediate', 'Upper back on bench, barbell over hip crease with pad, drive through heels to full hip extension, hold glute squeeze at top.', 4, '8-12', 90, false),
    ('Cable Glute Kickback', 'legs', 'Glutes', ARRAY['Hamstrings'], 'cable', 'beginner', 'Attach ankle strap to low pulley, kick leg backwards and slightly outwards, squeeze glute at peak.', 3, '12-15', 60, false),
    ('Dumbbell Walking Lunges', 'legs', 'Glutes', ARRAY['Quads', 'Hamstrings'], 'dumbbell', 'beginner', 'Step forward into long stride, drop back knee towards ground, drive up through front heel to step next leg.', 3, '12 steps/leg', 75, false),

    -- CALVES
    ('Standing Barbell Calf Raise', 'legs', 'Calves', ARRAY[], 'barbell', 'beginner', 'Stand on calf block with balls of feet, drop heels below block for full stretch, explode onto big toes and hold 2 seconds.', 4, '12-15', 60, false),
    ('Seated Machine Calf Raise', 'legs', 'Calves', ARRAY['Soleus'], 'machine', 'beginner', 'Knees bent at 90 degrees to isolate soleus, perform slow controlled reps with pause at bottom and top.', 3, '15-20', 60, false),

    -- ABS & CORE
    ('Hanging Leg Raise', 'core', 'Abs', ARRAY['Hip Flexors', 'Forearms'], 'bodyweight', 'intermediate', 'Hang from pull-up bar, curl pelvis upward bringing toes or knees towards bar without swinging.', 3, '10-15', 60, true),
    ('Cable Woodchoppers', 'core', 'Abs', ARRAY['Obliques'], 'cable', 'beginner', 'Hold cable with both hands across body, rotate torso diagonally down or across with rigid arms, engaging core.', 3, '12/side', 60, false),
    ('Ab Wheel Rollout', 'core', 'Abs', ARRAY['Lats', 'Shoulders'], 'bodyweight', 'intermediate', 'Kneel on mat, roll wheel forward extending body as low as possible without hyperextending lower back, pull back using abs.', 3, '8-12', 75, true),
    ('Plank with Shoulder Taps', 'core', 'Abs', ARRAY['Shoulders', 'Glutes'], 'bodyweight', 'beginner', 'Hold rigid high plank, alternate tapping opposite shoulder while minimizing hip rotation.', 3, '45-60 sec', 60, true),

    -- FOREARMS
    ('Barbell Wrist Curl', 'arms', 'Forearms', ARRAY[], 'barbell', 'beginner', 'Forearms resting on bench with wrists hanging off edge, curl wrists upward contracting forearm flexors.', 3, '15-20', 60, false),
    ('Farmer Walk', 'arms', 'Forearms', ARRAY['Traps', 'Core'], 'dumbbell', 'intermediate', 'Pick up heavy dumbbells or kettlebells, walk with upright posture and braced core for distance or time.', 3, '40 meters', 90, false)
ON CONFLICT DO NOTHING;
