// Supabase Database Types
// These types match the application types defined in types/index.ts

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
          name: string;
          pin: string;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          name: string;
          pin: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string;
          pin?: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dependents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: Database["public"]["Enums"]["relationship"];
          date_of_birth: string;
          gender: Database["public"]["Enums"]["gender"];
          photo: string | null;
          birth_certificate_number: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: Database["public"]["Enums"]["relationship"];
          date_of_birth: string;
          gender: Database["public"]["Enums"]["gender"];
          photo?: string | null;
          birth_certificate_number?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship?: Database["public"]["Enums"]["relationship"];
          date_of_birth?: string;
          gender?: Database["public"]["Enums"]["gender"];
          photo?: string | null;
          birth_certificate_number?: string | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          visit_count: number;
          validity_days: number;
          copay: number;
          category: Database["public"]["Enums"]["package_category"];
          facilities: string[];
          features: string[];
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          visit_count: number;
          validity_days: number;
          copay: number;
          category: Database["public"]["Enums"]["package_category"];
          facilities?: string[];
          features?: string[];
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          visit_count?: number;
          validity_days?: number;
          copay?: number;
          category?: Database["public"]["Enums"]["package_category"];
          facilities?: string[];
          features?: string[];
          is_active?: boolean;
        };
      };
      user_packages: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          purchase_date: string;
          expiry_date: string;
          visits_remaining: number;
          visits_used: number;
          status: Database["public"]["Enums"]["package_status"];
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          purchase_date: string;
          expiry_date: string;
          visits_remaining: number;
          visits_used?: number;
          status?: Database["public"]["Enums"]["package_status"];
        };
        Update: {
          id?: string;
          user_id?: string;
          package_id?: string;
          purchase_date?: string;
          expiry_date?: string;
          visits_remaining?: number;
          visits_used?: number;
          status?: Database["public"]["Enums"]["package_status"];
        };
      };
      visits: {
        Row: {
          id: string;
          user_package_id: string;
          dependent_id: string | null;
          facility_id: string;
          visit_date: string;
          status: Database["public"]["Enums"]["visit_status"];
          copay_paid: boolean;
          qr_code: string;
          provider_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_package_id: string;
          dependent_id?: string | null;
          facility_id: string;
          visit_date: string;
          status?: Database["public"]["Enums"]["visit_status"];
          copay_paid?: boolean;
          qr_code: string;
          provider_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_package_id?: string;
          dependent_id?: string | null;
          facility_id?: string;
          visit_date?: string;
          status?: Database["public"]["Enums"]["visit_status"];
          copay_paid?: boolean;
          qr_code?: string;
          provider_notes?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          visit_id: string;
          requested_date: string;
          requested_time: string;
          confirmed_date: string | null;
          confirmed_time: string | null;
          status: Database["public"]["Enums"]["booking_status"];
        };
        Insert: {
          id?: string;
          visit_id: string;
          requested_date: string;
          requested_time: string;
          confirmed_date?: string | null;
          confirmed_time?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
        };
        Update: {
          id?: string;
          visit_id?: string;
          requested_date?: string;
          requested_time?: string;
          confirmed_date?: string | null;
          confirmed_time?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
        };
      };
      facilities: {
        Row: {
          id: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          phone: string;
          rating: number;
          rating_count: number;
          services: string[];
          operating_hours: Json;
          accepts_booking: boolean;
          is_partner: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          phone: string;
          rating?: number;
          rating_count?: number;
          services?: string[];
          operating_hours?: Json;
          accepts_booking?: boolean;
          is_partner?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          phone?: string;
          rating?: number;
          rating_count?: number;
          services?: string[];
          operating_hours?: Json;
          accepts_booking?: boolean;
          is_partner?: boolean;
        };
      };
      family_members: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: Database["public"]["Enums"]["relationship"];
          date_of_birth: string;
          gender: Database["public"]["Enums"]["gender"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: Database["public"]["Enums"]["relationship"];
          date_of_birth: string;
          gender: Database["public"]["Enums"]["gender"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship?: Database["public"]["Enums"]["relationship"];
          date_of_birth?: string;
          gender?: Database["public"]["Enums"]["gender"];
          created_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          wallet_id: string;
          type: Database["public"]["Enums"]["transaction_type"];
          amount: number;
          description: string;
          reference: string | null;
          status: Database["public"]["Enums"]["transaction_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_id: string;
          type: Database["public"]["Enums"]["transaction_type"];
          amount: number;
          description: string;
          reference?: string | null;
          status?: Database["public"]["Enums"]["transaction_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_id?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
          amount?: number;
          description?: string;
          reference?: string | null;
          status?: Database["public"]["Enums"]["transaction_status"];
          created_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: Database["public"]["Enums"]["payment_provider"];
          provider: string;
          account_number: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Database["public"]["Enums"]["payment_provider"];
          provider: string;
          account_number: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: Database["public"]["Enums"]["payment_provider"];
          provider?: string;
          account_number?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: Database["public"]["Enums"]["notification_type"];
          title: string;
          body: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Database["public"]["Enums"]["notification_type"];
          title: string;
          body: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: Database["public"]["Enums"]["notification_type"];
          title?: string;
          body?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      approval_requests: {
        Row: {
          id: string;
          user_package_id: string;
          dependent_id: string;
          facility_id: string;
          status: Database["public"]["Enums"]["approval_status"];
          requested_at: string;
          responded_at: string | null;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_package_id: string;
          dependent_id: string;
          facility_id: string;
          status?: Database["public"]["Enums"]["approval_status"];
          requested_at?: string;
          responded_at?: string | null;
          expires_at: string;
        };
        Update: {
          id?: string;
          user_package_id?: string;
          dependent_id?: string;
          facility_id?: string;
          status?: Database["public"]["Enums"]["approval_status"];
          requested_at?: string;
          responded_at?: string | null;
          expires_at?: string;
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
      relationship: "child" | "spouse" | "parent" | "sibling" | "other";
      gender: "male" | "female" | "other";
      package_status: "active" | "expired" | "exhausted";
      package_category: "consultations" | "childWellness" | "maternity" | "labTests" | "dental" | "optical";
      visit_status: "pending" | "confirmed" | "completed" | "cancelled" | "noShow";
      booking_status: "pending" | "confirmed" | "declined" | "cancelled";
      transaction_type: "topUp" | "purchase" | "refund";
      transaction_status: "pending" | "completed" | "failed";
      payment_provider: "mtnMomo" | "airtelMoney" | "card";
      notification_type: "approval" | "booking" | "reminder" | "package" | "wallet" | "system";
      approval_status: "pending" | "approved" | "declined" | "expired";
    };
  };
}
