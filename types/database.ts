// Supabase Database Types
// These types should match your Supabase database schema

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
      users: {
        Row: {
          id: string;
          phone: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          currency: string;
          features: Json;
          duration: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          currency?: string;
          features?: Json;
          duration: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          currency?: string;
          features?: Json;
          duration?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_packages: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          purchase_date: string;
          expiry_date: string;
          status: string;
          remaining_visits: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          purchase_date: string;
          expiry_date: string;
          status?: string;
          remaining_visits?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          package_id?: string;
          purchase_date?: string;
          expiry_date?: string;
          status?: string;
          remaining_visits?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
