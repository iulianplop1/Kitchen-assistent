export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          current_weight: number | null
          target_weight: number | null
          daily_calorie_goal: number | null
          daily_protein_goal: number | null
          daily_carb_goal: number | null
          daily_fat_goal: number | null
          owned_appliances: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_weight?: number | null
          target_weight?: number | null
          daily_calorie_goal?: number | null
          daily_protein_goal?: number | null
          daily_carb_goal?: number | null
          daily_fat_goal?: number | null
          owned_appliances?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_weight?: number | null
          target_weight?: number | null
          daily_calorie_goal?: number | null
          daily_protein_goal?: number | null
          daily_carb_goal?: number | null
          daily_fat_goal?: number | null
          owned_appliances?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          item_name: string
          category: string
          quantity: number
          unit: string
          expiry_date: string | null
          price: number | null
          calories_per_unit: number | null
          protein_per_unit: number | null
          carbs_per_unit: number | null
          fats_per_unit: number | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_name: string
          category: string
          quantity: number
          unit: string
          expiry_date?: string | null
          price?: number | null
          calories_per_unit?: number | null
          protein_per_unit?: number | null
          carbs_per_unit?: number | null
          fats_per_unit?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_name?: string
          category?: string
          quantity?: number
          unit?: string
          expiry_date?: string | null
          price?: number | null
          calories_per_unit?: number | null
          protein_per_unit?: number | null
          carbs_per_unit?: number | null
          fats_per_unit?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          calories_consumed: number | null
          protein_consumed: number | null
          carbs_consumed: number | null
          fats_consumed: number | null
          water_intake: number | null
          weight: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          calories_consumed?: number | null
          protein_consumed?: number | null
          carbs_consumed?: number | null
          fats_consumed?: number | null
          water_intake?: number | null
          weight?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          calories_consumed?: number | null
          protein_consumed?: number | null
          carbs_consumed?: number | null
          fats_consumed?: number | null
          water_intake?: number | null
          weight?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes_saved: {
        Row: {
          id: string
          user_id: string
          recipe_name: string
          ingredients: Json
          instructions: string[]
          calories_per_serving: number | null
          protein_per_serving: number | null
          carbs_per_serving: number | null
          fats_per_serving: number | null
          servings: number
          appliances_required: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_name: string
          ingredients: Json
          instructions: string[]
          calories_per_serving?: number | null
          protein_per_serving?: number | null
          carbs_per_serving?: number | null
          fats_per_serving?: number | null
          servings: number
          appliances_required?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_name?: string
          ingredients?: Json
          instructions?: string[]
          calories_per_serving?: number | null
          protein_per_serving?: number | null
          carbs_per_serving?: number | null
          fats_per_serving?: number | null
          servings?: number
          appliances_required?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

