export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
          birth_date: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level:
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active"
            | "extra_active";
          fitness_goal:
            | "cut_fat"
            | "maintain_weight"
            | "lean_bulk"
            | "build_muscle"
            | "endurance"
            | "general_health";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          birth_date?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?:
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active"
            | "extra_active";
          fitness_goal?:
            | "cut_fat"
            | "maintain_weight"
            | "lean_bulk"
            | "build_muscle"
            | "endurance"
            | "general_health";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          birth_date?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?:
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active"
            | "extra_active";
          fitness_goal?:
            | "cut_fat"
            | "maintain_weight"
            | "lean_bulk"
            | "build_muscle"
            | "endurance"
            | "general_health";
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: "light" | "dark" | "system";
          unit_system: "metric" | "imperial";
          calorie_target: number;
          protein_target_g: number;
          carbs_target_g: number;
          fat_target_g: number;
          water_target_ml: number;
          step_target: number;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: "light" | "dark" | "system";
          unit_system?: "metric" | "imperial";
          calorie_target?: number;
          protein_target_g?: number;
          carbs_target_g?: number;
          fat_target_g?: number;
          water_target_ml?: number;
          step_target?: number;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: "light" | "dark" | "system";
          unit_system?: "metric" | "imperial";
          calorie_target?: number;
          protein_target_g?: number;
          carbs_target_g?: number;
          fat_target_g?: number;
          water_target_ml?: number;
          step_target?: number;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          brand: string | null;
          barcode: string | null;
          serving_size: number;
          serving_unit: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          fiber_g: number | null;
          sugar_g: number | null;
          sodium_mg: number | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size?: number;
          serving_unit?: string;
          calories: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size?: number;
          serving_unit?: string;
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          is_verified?: boolean;
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          category:
            | "chest"
            | "back"
            | "legs"
            | "shoulders"
            | "arms"
            | "core"
            | "cardio"
            | "full_body"
            | "olympic"
            | "calisthenics";
          muscle_group: string;
          secondary_muscles: string[];
          equipment:
            | "barbell"
            | "dumbbell"
            | "cable"
            | "machine"
            | "bodyweight"
            | "kettlebell"
            | "bands"
            | "other";
          difficulty: "beginner" | "intermediate" | "advanced";
          instructions: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          category:
            | "chest"
            | "back"
            | "legs"
            | "shoulders"
            | "arms"
            | "core"
            | "cardio"
            | "full_body"
            | "olympic"
            | "calisthenics";
          muscle_group: string;
          secondary_muscles?: string[];
          equipment:
            | "barbell"
            | "dumbbell"
            | "cable"
            | "machine"
            | "bodyweight"
            | "kettlebell"
            | "bands"
            | "other";
          difficulty?: "beginner" | "intermediate" | "advanced";
          instructions?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          category?:
            | "chest"
            | "back"
            | "legs"
            | "shoulders"
            | "arms"
            | "core"
            | "cardio"
            | "full_body"
            | "olympic"
            | "calisthenics";
          muscle_group?: string;
          secondary_muscles?: string[];
          equipment?:
            | "barbell"
            | "dumbbell"
            | "cable"
            | "machine"
            | "bodyweight"
            | "kettlebell"
            | "bands"
            | "other";
          difficulty?: "beginner" | "intermediate" | "advanced";
          instructions?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
      };
      daily_tracking: {
        Row: {
          id: string;
          user_id: string;
          tracking_date: string;
          calories_consumed: number;
          calories_burned: number;
          protein_consumed_g: number;
          carbs_consumed_g: number;
          fat_consumed_g: number;
          water_intake_ml: number;
          steps_count: number;
          sleep_hours: number;
          mood: "great" | "good" | "neutral" | "tired" | "stressed" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tracking_date?: string;
          calories_consumed?: number;
          calories_burned?: number;
          protein_consumed_g?: number;
          carbs_consumed_g?: number;
          fat_consumed_g?: number;
          water_intake_ml?: number;
          steps_count?: number;
          sleep_hours?: number;
          mood?: "great" | "good" | "neutral" | "tired" | "stressed" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tracking_date?: string;
          calories_consumed?: number;
          calories_burned?: number;
          protein_consumed_g?: number;
          carbs_consumed_g?: number;
          fat_consumed_g?: number;
          water_intake_ml?: number;
          steps_count?: number;
          sleep_hours?: number;
          mood?: "great" | "good" | "neutral" | "tired" | "stressed" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          recorded_date: string;
          weight_kg: number;
          body_fat_percentage: number | null;
          chest_cm: number | null;
          waist_cm: number | null;
          hips_cm: number | null;
          arms_cm: number | null;
          thighs_cm: number | null;
          calves_cm: number | null;
          photo_urls: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recorded_date?: string;
          weight_kg: number;
          body_fat_percentage?: number | null;
          chest_cm?: number | null;
          waist_cm?: number | null;
          hips_cm?: number | null;
          arms_cm?: number | null;
          thighs_cm?: number | null;
          calves_cm?: number | null;
          photo_urls?: Json;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recorded_date?: string;
          weight_kg?: number;
          body_fat_percentage?: number | null;
          chest_cm?: number | null;
          waist_cm?: number | null;
          hips_cm?: number | null;
          arms_cm?: number | null;
          thighs_cm?: number | null;
          calves_cm?: number | null;
          photo_urls?: Json;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
