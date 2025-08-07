export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agency_advertisers: {
        Row: {
          advertiser_id: string
          agency_id: string
          created_at: string
          id: string
          is_active: boolean
        }
        Insert: {
          advertiser_id: string
          agency_id: string
          created_at?: string
          id?: string
          is_active?: boolean
        }
        Update: {
          advertiser_id?: string
          agency_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          agency_id: string | null
          budget: number
          created_at: string
          daily_budget: number | null
          description: string | null
          domain_lists: Json | null
          end_date: string | null
          frequency_caps: Json | null
          id: string
          name: string
          start_date: string
          status: string
          targeting_config: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          agency_id?: string | null
          budget: number
          created_at?: string
          daily_budget?: number | null
          description?: string | null
          domain_lists?: Json | null
          end_date?: string | null
          frequency_caps?: Json | null
          id?: string
          name: string
          start_date: string
          status?: string
          targeting_config?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          agency_id?: string | null
          budget?: number
          created_at?: string
          daily_budget?: number | null
          description?: string | null
          domain_lists?: Json | null
          end_date?: string | null
          frequency_caps?: Json | null
          id?: string
          name?: string
          start_date?: string
          status?: string
          targeting_config?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          applies_to_user_id: string | null
          commission_type: string
          created_at: string
          id: string
          is_active: boolean
          percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          applies_to_user_id?: string | null
          commission_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage: number
          updated_at?: string
          user_id: string
        }
        Update: {
          applies_to_user_id?: string | null
          commission_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_lists: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          description: string | null
          entry_type: string
          id: string
          is_active: boolean | null
          is_global: boolean | null
          list_type: string
          updated_at: string | null
          user_id: string
          value: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          entry_type: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          list_type: string
          updated_at?: string | null
          user_id: string
          value: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          entry_type?: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          list_type?: string
          updated_at?: string | null
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_lists_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      frequency_caps: {
        Row: {
          campaign_id: string
          cap_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          max_impressions: number
          time_window_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          cap_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_impressions: number
          time_window_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          cap_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_impressions?: number
          time_window_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_campaigns: {
        Row: {
          bid_strategy: string | null
          campaign_name: string
          campaign_type: string
          created_at: string
          creative_config: Json | null
          daily_budget: number | null
          end_date: string | null
          google_campaign_id: string | null
          id: string
          margin_percentage: number | null
          start_date: string | null
          status: string
          targeting_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_strategy?: string | null
          campaign_name: string
          campaign_type: string
          created_at?: string
          creative_config?: Json | null
          daily_budget?: number | null
          end_date?: string | null
          google_campaign_id?: string | null
          id?: string
          margin_percentage?: number | null
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_strategy?: string | null
          campaign_name?: string
          campaign_type?: string
          created_at?: string
          creative_config?: Json | null
          daily_budget?: number | null
          end_date?: string | null
          google_campaign_id?: string | null
          id?: string
          margin_percentage?: number | null
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      impression_tracking: {
        Row: {
          campaign_id: string
          created_at: string | null
          first_impression: string | null
          id: string
          impression_count: number | null
          last_impression: string | null
          user_identifier: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          first_impression?: string | null
          id?: string
          impression_count?: number | null
          last_impression?: string | null
          user_identifier: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          first_impression?: string | null
          id?: string
          impression_count?: number | null
          last_impression?: string | null
          user_identifier?: string
        }
        Relationships: []
      }
      meta_campaigns: {
        Row: {
          bid_strategy: string | null
          campaign_name: string
          created_at: string
          creative_config: Json | null
          daily_budget: number | null
          end_date: string | null
          id: string
          lifetime_budget: number | null
          margin_percentage: number | null
          meta_campaign_id: string | null
          objective: string
          start_date: string | null
          status: string
          targeting_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_strategy?: string | null
          campaign_name: string
          created_at?: string
          creative_config?: Json | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          lifetime_budget?: number | null
          margin_percentage?: number | null
          meta_campaign_id?: string | null
          objective: string
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_strategy?: string | null
          campaign_name?: string
          created_at?: string
          creative_config?: Json | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          lifetime_budget?: number | null
          margin_percentage?: number | null
          meta_campaign_id?: string | null
          objective?: string
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pmp_deals: {
        Row: {
          created_at: string
          currency: string | null
          deal_id: string
          deal_name: string
          deal_type: string
          description: string | null
          dsp_name: string
          end_date: string | null
          floor_price: number | null
          id: string
          priority: number | null
          start_date: string | null
          status: string
          targeting_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          deal_id: string
          deal_name: string
          deal_type?: string
          description?: string | null
          dsp_name: string
          end_date?: string | null
          floor_price?: number | null
          id?: string
          priority?: number | null
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          deal_id?: string
          deal_name?: string
          deal_type?: string
          description?: string | null
          dsp_name?: string
          end_date?: string | null
          floor_price?: number | null
          id?: string
          priority?: number | null
          start_date?: string | null
          status?: string
          targeting_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string | null
          created_at: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { check_user_id: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "agency" | "advertiser" | "admin"
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
      user_role: ["agency", "advertiser", "admin"],
    },
  },
} as const
