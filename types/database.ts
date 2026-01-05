export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      approval_requests: {
        Row: {
          dependent_id: string
          expires_at: string
          facility_id: string
          id: string
          requested_at: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          user_package_id: string
        }
        Insert: {
          dependent_id: string
          expires_at: string
          facility_id: string
          id?: string
          requested_at?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          user_package_id: string
        }
        Update: {
          dependent_id?: string
          expires_at?: string
          facility_id?: string
          id?: string
          requested_at?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          user_package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_dependent_id_fkey"
            columns: ["dependent_id"]
            isOneToOne: false
            referencedRelation: "dependents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_user_package_id_fkey"
            columns: ["user_package_id"]
            isOneToOne: false
            referencedRelation: "user_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          confirmed_date: string | null
          confirmed_time: string | null
          id: string
          requested_date: string
          requested_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          visit_id: string
        }
        Insert: {
          confirmed_date?: string | null
          confirmed_time?: string | null
          id?: string
          requested_date: string
          requested_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          visit_id: string
        }
        Update: {
          confirmed_date?: string | null
          confirmed_time?: string | null
          id?: string
          requested_date?: string
          requested_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      dependents: {
        Row: {
          birth_certificate_number: string | null
          created_at: string | null
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          photo: string | null
          relationship: Database["public"]["Enums"]["relationship"]
          user_id: string
        }
        Insert: {
          birth_certificate_number?: string | null
          created_at?: string | null
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          name: string
          photo?: string | null
          relationship: Database["public"]["Enums"]["relationship"]
          user_id: string
        }
        Update: {
          birth_certificate_number?: string | null
          created_at?: string | null
          date_of_birth?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          name?: string
          photo?: string | null
          relationship?: Database["public"]["Enums"]["relationship"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          accepts_booking: boolean | null
          address: string
          id: string
          is_partner: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours: Json | null
          phone: string
          rating: number | null
          rating_count: number | null
          services: string[] | null
        }
        Insert: {
          accepts_booking?: boolean | null
          address: string
          id?: string
          is_partner?: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours?: Json | null
          phone: string
          rating?: number | null
          rating_count?: number | null
          services?: string[] | null
        }
        Update: {
          accepts_booking?: boolean | null
          address?: string
          id?: string
          is_partner?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          operating_hours?: Json | null
          phone?: string
          rating?: number | null
          rating_count?: number | null
          services?: string[] | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string | null
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          relationship: Database["public"]["Enums"]["relationship"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          name: string
          relationship: Database["public"]["Enums"]["relationship"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          name?: string
          relationship?: Database["public"]["Enums"]["relationship"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          category: Database["public"]["Enums"]["package_category"]
          copay: number
          description: string
          facilities: string[] | null
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          validity_days: number
          visit_count: number
        }
        Insert: {
          category: Database["public"]["Enums"]["package_category"]
          copay?: number
          description: string
          facilities?: string[] | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          validity_days: number
          visit_count: number
        }
        Update: {
          category?: Database["public"]["Enums"]["package_category"]
          copay?: number
          description?: string
          facilities?: string[] | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          validity_days?: number
          visit_count?: number
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string
          created_at: string | null
          id: string
          is_default: boolean | null
          provider: string
          type: Database["public"]["Enums"]["payment_provider"]
          user_id: string
        }
        Insert: {
          account_number: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          provider: string
          type: Database["public"]["Enums"]["payment_provider"]
          user_id: string
        }
        Update: {
          account_number?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          provider?: string
          type?: Database["public"]["Enums"]["payment_provider"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_packages: {
        Row: {
          expiry_date: string
          id: string
          package_id: string
          purchase_date: string
          status: Database["public"]["Enums"]["package_status"] | null
          user_id: string
          visits_remaining: number
          visits_used: number | null
        }
        Insert: {
          expiry_date: string
          id?: string
          package_id: string
          purchase_date?: string
          status?: Database["public"]["Enums"]["package_status"] | null
          user_id: string
          visits_remaining: number
          visits_used?: number | null
        }
        Update: {
          expiry_date?: string
          id?: string
          package_id?: string
          purchase_date?: string
          status?: Database["public"]["Enums"]["package_status"] | null
          user_id?: string
          visits_remaining?: number
          visits_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_packages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          member_id: string | null
          name: string
          nin: string | null
          phone: string
          pin: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          name: string
          nin?: string | null
          phone: string
          pin: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          name?: string
          nin?: string | null
          phone?: string
          pin?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          copay_paid: boolean | null
          created_at: string | null
          dependent_id: string | null
          facility_id: string
          id: string
          provider_notes: string | null
          qr_code: string
          status: Database["public"]["Enums"]["visit_status"] | null
          user_package_id: string
          visit_date: string
        }
        Insert: {
          copay_paid?: boolean | null
          created_at?: string | null
          dependent_id?: string | null
          facility_id: string
          id?: string
          provider_notes?: string | null
          qr_code: string
          status?: Database["public"]["Enums"]["visit_status"] | null
          user_package_id: string
          visit_date: string
        }
        Update: {
          copay_paid?: boolean | null
          created_at?: string | null
          dependent_id?: string | null
          facility_id?: string
          id?: string
          provider_notes?: string | null
          qr_code?: string
          status?: Database["public"]["Enums"]["visit_status"] | null
          user_package_id?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_dependent_id_fkey"
            columns: ["dependent_id"]
            isOneToOne: false
            referencedRelation: "dependents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_user_package_id_fkey"
            columns: ["user_package_id"]
            isOneToOne: false
            referencedRelation: "user_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      approval_status: "pending" | "approved" | "declined" | "expired"
      booking_status: "pending" | "confirmed" | "declined" | "cancelled"
      gender: "male" | "female" | "other"
      notification_type:
        | "approval"
        | "booking"
        | "reminder"
        | "package"
        | "wallet"
        | "system"
      package_category:
        | "consultations"
        | "childWellness"
        | "maternity"
        | "labTests"
        | "dental"
        | "optical"
        | "lab_tests"
        | "pharmacy"
      package_status: "active" | "expired" | "exhausted"
      payment_provider: "mtnMomo" | "airtelMoney" | "card"
      relationship: "child" | "spouse" | "parent" | "sibling" | "other"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type: "topUp" | "purchase" | "refund"
      visit_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "noShow"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "declined", "expired"],
      booking_status: ["pending", "confirmed", "declined", "cancelled"],
      gender: ["male", "female", "other"],
      notification_type: [
        "approval",
        "booking",
        "reminder",
        "package",
        "wallet",
        "system",
      ],
      package_category: [
        "consultations",
        "childWellness",
        "maternity",
        "labTests",
        "dental",
        "optical",
        "lab_tests",
        "pharmacy",
      ],
      package_status: ["active", "expired", "exhausted"],
      payment_provider: ["mtnMomo", "airtelMoney", "card"],
      relationship: ["child", "spouse", "parent", "sibling", "other"],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: ["topUp", "purchase", "refund"],
      visit_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "noShow",
      ],
    },
  },
} as const
