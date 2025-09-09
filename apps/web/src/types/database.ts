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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_claims: {
        Row: {
          business_id: string | null
          claimant_id: string | null
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["claim_status"] | null
          updated_at: string | null
          verification_expires_at: string | null
          verification_method: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          business_id?: string | null
          claimant_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          updated_at?: string | null
          verification_expires_at?: string | null
          verification_method?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          business_id?: string | null
          claimant_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          updated_at?: string | null
          verification_expires_at?: string | null
          verification_method?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_claims_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_view_stats"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_claims_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_views: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          referrer: string | null
          user_agent: string | null
          viewed_at: string | null
          viewer_ip: unknown | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_ip?: unknown | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_ip?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "business_views_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_view_stats"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_views_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          business_id: string | null
          code: string
          created_at: string | null
          description: string | null
          discount: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          business_id?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          discount: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          business_id?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_view_stats"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "promo_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["business_category"]
          city_id: string | null
          claimed: boolean | null
          created_at: string | null
          description: string | null
          google_place_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: Database["public"]["Enums"]["business_category"]
          city_id?: string | null
          claimed?: boolean | null
          created_at?: string | null
          description?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["business_category"]
          city_id?: string | null
          claimed?: boolean | null
          created_at?: string | null
          description?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          primary_contact: boolean | null
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string | null
          value: string
          verified: boolean | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          primary_contact?: boolean | null
          type: Database["public"]["Enums"]["contact_type"]
          updated_at?: string | null
          value: string
          verified?: boolean | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          primary_contact?: boolean | null
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string | null
          value?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_view_stats"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      validations: {
        Row: {
          business_id: string | null
          comment: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          status: Database["public"]["Enums"]["validation_status"] | null
          updated_at: string | null
          validator_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          updated_at?: string | null
          validator_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          updated_at?: string | null
          validator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_view_stats"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "validations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      business_view_stats: {
        Row: {
          business_id: string | null
          category: Database["public"]["Enums"]["business_category"] | null
          first_viewed_at: string | null
          last_viewed_at: string | null
          name: string | null
          total_views: number | null
          verified: boolean | null
          views_last_30_days: number | null
          views_last_7_days: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      get_most_viewed_businesses: {
        Args: { days_back?: number; limit_count?: number }
        Returns: {
          address: string
          business_id: string
          category: Database["public"]["Enums"]["business_category"]
          city_name: string
          description: string
          latest_view: string
          name: string
          verified: boolean
          view_count: number
        }[]
      }
      record_business_view: {
        Args: {
          p_business_id: string
          p_referrer?: string
          p_user_agent?: string
          p_viewer_ip: unknown
        }
        Returns: boolean
      }
      search_businesses: {
        Args: {
          category_filter?: Database["public"]["Enums"]["business_category"]
          city_filter?: string
          max_distance?: number
          search_term: string
          user_lat?: number
          user_lng?: number
        }
        Returns: {
          address: string
          category: Database["public"]["Enums"]["business_category"]
          description: string
          distance: number
          id: string
          latitude: number
          longitude: number
          name: string
          verified: boolean
        }[]
      }
    }
    Enums: {
      business_category:
        | "HOTEL"
        | "RESTAURANT"
        | "TOUR"
        | "TRANSPORT"
        | "ATTRACTION"
        | "OTHER"
      claim_status: "PENDING" | "VERIFIED" | "REJECTED"
      contact_type: "PHONE" | "EMAIL" | "WHATSAPP" | "WEBSITE"
      validation_status: "PENDING" | "APPROVED" | "REJECTED"
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

export const Constants = {
  public: {
    Enums: {
      business_category: [
        "HOTEL",
        "RESTAURANT",
        "TOUR",
        "TRANSPORT",
        "ATTRACTION",
        "OTHER",
      ],
      claim_status: ["PENDING", "VERIFIED", "REJECTED"],
      contact_type: ["PHONE", "EMAIL", "WHATSAPP", "WEBSITE"],
      validation_status: ["PENDING", "APPROVED", "REJECTED"],
    },
  },
} as const