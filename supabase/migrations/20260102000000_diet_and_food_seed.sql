-- ==============================================================================
-- ApexFit - Part 2: Diet & Nutrition System Database Migration
-- Updates: foods table columns, verified food library seed, diet plan enhancements
-- ==============================================================================

-- 1. Ensure foods table has category, dietary_type, and substitution_group columns
ALTER TABLE public.foods 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other',
ADD COLUMN IF NOT EXISTS dietary_type TEXT DEFAULT 'non_vegetarian',
ADD COLUMN IF NOT EXISTS substitution_group TEXT DEFAULT 'other';

-- Create index on category and substitution_group for fast search & substitution
CREATE INDEX IF NOT EXISTS idx_foods_category ON public.foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_substitution ON public.foods(substitution_group);
CREATE INDEX IF NOT EXISTS idx_foods_dietary_type ON public.foods(dietary_type);

-- 2. Seed verified food library (user_id is NULL so available to all users)
INSERT INTO public.foods (name, brand, category, serving_size, serving_unit, calories, protein_g, carbs_g, fat_g, fiber_g, is_verified, dietary_type, substitution_group)
VALUES
  -- Rice & Grains
  ('Basmati White Rice (Cooked)', 'Standard', 'Rice', 100, 'g', 130, 2.7, 28.2, 0.3, 0.4, true, 'vegan', 'complex_carb'),
  ('Brown Rice (Cooked)', 'Whole Grain', 'Rice', 100, 'g', 111, 2.6, 23.0, 0.9, 1.8, true, 'vegan', 'complex_carb'),
  ('Rolled Oats (Raw)', 'Standard', 'Oats', 50, 'g', 190, 6.5, 34.0, 3.5, 5.0, true, 'vegan', 'complex_carb'),
  ('Whole Wheat Roti / Chapati', 'Traditional', 'Common Indian Foods', 1, 'piece (40g)', 104, 3.2, 20.4, 0.8, 2.8, true, 'vegan', 'complex_carb'),
  ('Cooked Quinoa', 'Organic', 'Grains', 100, 'g', 120, 4.4, 21.3, 1.9, 2.8, true, 'vegan', 'complex_carb'),
  ('Steamed Idli', 'South Indian', 'Common Indian Foods', 2, 'pieces (100g)', 132, 4.0, 26.0, 0.8, 1.5, true, 'vegan', 'complex_carb'),
  ('Plain Dosa', 'South Indian', 'Common Indian Foods', 1, 'medium (80g)', 168, 3.9, 29.0, 3.8, 1.2, true, 'vegan', 'complex_carb'),

  -- Chicken & Poultry
  ('Chicken Breast (Raw / Boneless)', 'Fresh Farm', 'Chicken', 100, 'g', 120, 22.5, 0.0, 2.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Grilled Chicken Breast', 'Cooked', 'Chicken', 100, 'g', 165, 31.0, 0.0, 3.6, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Chicken Thigh (Skinless, Cooked)', 'Fresh Farm', 'Chicken', 100, 'g', 209, 26.0, 0.0, 10.9, 0.0, true, 'non_vegetarian', 'fatty_protein'),

  -- Eggs
  ('Whole Large Egg', 'Farm Fresh', 'Eggs', 1, 'large (50g)', 72, 6.3, 0.4, 4.8, 0.0, true, 'eggetarian', 'fatty_protein'),
  ('Egg Whites', 'Farm Fresh', 'Eggs', 100, 'ml', 52, 11.0, 0.7, 0.2, 0.0, true, 'eggetarian', 'lean_protein'),
  ('Boiled Egg (Whole)', 'Farm Fresh', 'Eggs', 1, 'egg (50g)', 78, 6.3, 0.6, 5.3, 0.0, true, 'eggetarian', 'fatty_protein'),

  -- Fish & Seafood
  ('Atlantic Salmon (Raw)', 'Fresh Wild', 'Fish', 100, 'g', 208, 20.4, 0.0, 13.4, 0.0, true, 'non_vegetarian', 'fatty_protein'),
  ('White Fish Fillet (Tilapia / Cod)', 'Ocean Catch', 'Fish', 100, 'g', 96, 20.1, 0.0, 1.7, 0.0, true, 'non_vegetarian', 'lean_protein'),
  ('Canned Tuna in Water (Drained)', 'Wild Seas', 'Fish', 100, 'g', 116, 25.5, 0.0, 0.8, 0.0, true, 'non_vegetarian', 'lean_protein'),

  -- Dairy & Curd
  ('Fresh Paneer (Cottage Cheese)', 'Dairy Pure', 'Common Indian Foods', 100, 'g', 265, 18.3, 3.2, 20.8, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Low-Fat Paneer', 'Dairy Pure', 'Common Indian Foods', 100, 'g', 180, 24.0, 4.0, 7.0, 0.0, true, 'vegetarian', 'lean_protein'),
  ('Plain Greek Yogurt / Curd (Low Fat)', 'Dairy Pure', 'Curd', 100, 'g', 59, 10.0, 3.6, 0.4, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Traditional Indian Dahi (Curd)', 'Home Set', 'Curd', 100, 'g', 61, 3.5, 4.7, 3.3, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Skimmed Milk', 'Dairy Pure', 'Milk', 250, 'ml (1 cup)', 88, 8.5, 12.5, 0.5, 0.0, true, 'vegetarian', 'dairy_protein'),
  ('Whey Protein Isolate (Unflavored/Choc)', 'Optimum Grade', 'Milk', 30, 'g (1 scoop)', 120, 25.0, 1.5, 1.0, 0.0, true, 'vegetarian', 'lean_protein'),

  -- Legumes & Plant Proteins
  ('Soya Chunks (Raw)', 'High Protein', 'Common Indian Foods', 50, 'g', 172, 26.0, 16.5, 0.5, 6.5, true, 'vegan', 'lean_protein'),
  ('Firm Tofu', 'Organic Soy', 'Legumes', 100, 'g', 83, 10.0, 1.9, 5.3, 0.9, true, 'vegan', 'lean_protein'),
  ('Cooked Yellow Moong Dal', 'Traditional', 'Legumes', 150, 'g (1 bowl)', 147, 9.8, 24.5, 0.8, 5.6, true, 'vegan', 'plant_protein'),
  ('Cooked Chana Masala (Chickpeas)', 'Traditional', 'Common Indian Foods', 150, 'g (1 bowl)', 198, 10.2, 32.4, 3.1, 7.4, true, 'vegan', 'plant_protein'),
  ('Cooked Rajma (Kidney Beans)', 'Traditional', 'Common Indian Foods', 150, 'g (1 bowl)', 180, 11.5, 30.5, 1.0, 8.2, true, 'vegan', 'plant_protein'),
  ('Cooked Brown Lentils', 'Whole Grain', 'Legumes', 150, 'g (1 bowl)', 165, 12.0, 27.0, 0.6, 7.8, true, 'vegan', 'plant_protein'),

  -- Fruits
  ('Ripe Banana', 'Fresh', 'Fruits', 1, 'medium (118g)', 105, 1.3, 27.0, 0.3, 3.1, true, 'vegan', 'simple_carb'),
  ('Fresh Red Apple', 'Fresh', 'Fruits', 1, 'medium (150g)', 78, 0.4, 20.8, 0.3, 3.6, true, 'vegan', 'simple_carb'),
  ('Fresh Blueberries', 'Fresh', 'Fruits', 100, 'g', 57, 0.7, 14.5, 0.3, 2.4, true, 'vegan', 'simple_carb'),
  ('Sweet Papaya Cubes', 'Fresh', 'Fruits', 150, 'g (1 cup)', 62, 0.7, 15.0, 0.4, 2.7, true, 'vegan', 'simple_carb'),

  -- Vegetables
  ('Raw Baby Spinach', 'Farm Fresh', 'Vegetables', 100, 'g', 23, 2.9, 3.6, 0.4, 2.2, true, 'vegan', 'vegetable'),
  ('Steamed Broccoli Florets', 'Farm Fresh', 'Vegetables', 100, 'g', 35, 2.4, 7.2, 0.4, 2.6, true, 'vegan', 'vegetable'),
  ('Boiled Sweet Potato', 'Farm Fresh', 'Vegetables', 100, 'g', 86, 1.6, 20.1, 0.1, 3.0, true, 'vegan', 'complex_carb'),
  ('Mixed Green Cucumber & Tomato Salad', 'Fresh', 'Vegetables', 150, 'g', 28, 1.2, 5.4, 0.3, 1.8, true, 'vegan', 'vegetable'),

  -- Nuts, Seeds & Fats
  ('Raw Almonds', 'California', 'Nuts', 28, 'g (approx 23 nuts)', 164, 6.0, 6.1, 14.2, 3.5, true, 'vegan', 'healthy_fat'),
  ('Raw Walnuts', 'Halves', 'Nuts', 28, 'g (approx 14 halves)', 185, 4.3, 3.9, 18.5, 1.9, true, 'vegan', 'healthy_fat'),
  ('Chia Seeds', 'Organic', 'Seeds', 15, 'g (1 tbsp)', 73, 2.5, 6.3, 4.6, 5.1, true, 'vegan', 'healthy_fat'),
  ('Flax Seeds (Ground)', 'Organic', 'Seeds', 15, 'g (1 tbsp)', 80, 2.8, 4.3, 6.3, 4.1, true, 'vegan', 'healthy_fat'),
  ('Natural Peanut Butter (No Added Sugar)', 'Pure Roasted', 'Nuts', 32, 'g (2 tbsp)', 188, 8.0, 7.0, 16.0, 2.0, true, 'vegan', 'healthy_fat'),
  ('Extra Virgin Olive Oil', 'Cold Pressed', 'Nuts', 10, 'ml (1 tbsp)', 88, 0.0, 0.0, 10.0, 0.0, true, 'vegan', 'healthy_fat')
ON CONFLICT DO NOTHING;
