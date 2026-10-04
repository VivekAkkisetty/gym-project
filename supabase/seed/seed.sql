-- ==============================================================================
-- ApexFit Supabase Local Development Seed Data
-- Populates reference food items and verified exercises for local development
-- ==============================================================================

-- 1. Reference Foods (if not already seeded)
INSERT INTO public.foods (name, brand, category, serving_size, serving_unit, calories, protein_g, carbs_g, fat_g, fiber_g, is_verified, dietary_type, substitution_group)
VALUES
  ('Basmati White Rice (Cooked)', 'Standard', 'Rice', 100, 'g', 130, 2.7, 28.2, 0.3, 0.4, true, 'vegan', 'complex_carb'),
  ('Brown Rice (Cooked)', 'Whole Grain', 'Rice', 100, 'g', 111, 2.6, 23.0, 0.9, 1.8, true, 'vegan', 'complex_carb'),
  ('Rolled Oats (Raw)', 'Standard', 'Oats', 50, 'g', 190, 6.5, 34.0, 3.5, 5.0, true, 'vegan', 'complex_carb'),
  ('Whole Wheat Roti / Chapati', 'Traditional', 'Common Indian Foods', 1, 'piece (40g)', 104, 3.2, 20.4, 0.8, 2.8, true, 'vegan', 'complex_carb'),
  ('Cooked Quinoa', 'Organic', 'Grains', 100, 'g', 120, 4.4, 21.3, 1.9, 2.8, true, 'vegan', 'complex_carb'),
  ('Chicken Breast (Raw / Boneless)', 'Fresh Farm', 'Chicken', 100, 'g', 120, 22.5, 0.0, 2.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Grilled Chicken Breast', 'Cooked', 'Chicken', 100, 'g', 165, 31.0, 0.0, 3.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Whole Large Egg', 'Farm Fresh', 'Eggs', 1, 'large (50g)', 72, 6.3, 0.4, 4.8, 0.0, true, 'eggetarian', 'fatty_protein'),
  ('Egg Whites', 'Farm Fresh', 'Eggs', 100, 'ml', 52, 11.0, 0.7, 0.2, 0.0, true, 'eggetarian', 'lean_protein'),
  ('Atlantic Salmon (Raw)', 'Fresh Wild', 'Fish', 100, 'g', 208, 20.4, 0.0, 13.4, 0.0, true, 'non_vegetarian', 'fatty_protein'),
  ('Fresh Paneer (Cottage Cheese)', 'Dairy Pure', 'Common Indian Foods', 100, 'g', 265, 18.3, 3.2, 20.8, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Plain Greek Yogurt / Curd (Low Fat)', 'Dairy Pure', 'Curd', 100, 'g', 59, 10.0, 3.6, 0.4, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Whey Protein Isolate', 'Optimum Grade', 'Milk', 30, 'g (1 scoop)', 120, 25.0, 1.5, 1.0, 0.0, true, 'vegetarian', 'lean_protein')
ON CONFLICT DO NOTHING;

-- 2. Reference Exercises (if not already seeded)
INSERT INTO public.exercises (name, target_muscle_group, secondary_muscles, equipment, difficulty, movement_pattern, instructions, is_verified)
VALUES
  ('Barbell Bench Press', 'Chest', ARRAY['Triceps', 'Anterior Deltoids'], 'Barbell', 'intermediate', 'push', 'Lie on flat bench with eyes under barbell. Retract scapulae and press bar vertically over lower sternum.', true),
  ('Incline Dumbbell Press', 'Chest', ARRAY['Anterior Deltoids', 'Triceps'], 'Dumbbell', 'intermediate', 'push', 'Set bench to 30 degrees incline. Lower dumbbells with control until chest stretch is achieved.', true),
  ('Barbell Back Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings', 'Lower Back'], 'Barbell', 'intermediate', 'squat', 'Place bar across upper trapezius. Descend under control until femur breaks parallel with hip crease.', true),
  ('Romanian Deadlift (RDL)', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'Barbell', 'intermediate', 'hinge', 'Hinge backward at hips with slight soft knee flexion. Lower bar along shins until hamstring tension peaks.', true),
  ('Pull-Up', 'Lats', ARRAY['Biceps', 'Rhomboids', 'Brachialis'], 'Bodyweight', 'intermediate', 'pull', 'Hang with overhand grip wider than shoulders. Drive elbows down to ribcage until chin clears bar.', true),
  ('Barbell Overhead Press (OHP)', 'Shoulders', ARRAY['Triceps', 'Upper Chest'], 'Barbell', 'intermediate', 'push', 'Stand upright with core braced. Press barbell overhead until arms are fully locked out overhead.', true)
ON CONFLICT DO NOTHING;
