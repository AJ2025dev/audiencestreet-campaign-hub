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
      campaign_analytics: {
        Row: {
          campaign_id: string
          event_type: string
          id: string
          metadata: Json | null
          timestamp: string
        }
        Insert: {
          campaign_id: string
          event_type: string
          id?: string
          metadata?: Json | null
          timestamp?: string
        }
        Update: {
          campaign_id?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_products: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_products_campaign_id"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "retail_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_products_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_creative_url: string | null
          budget: number
          created_at: string
          id: string
          impressions: number | null
          name: string
          qr_code_url: string | null
          scans: number | null
          status: string
          target_audience: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_creative_url?: string | null
          budget: number
          created_at?: string
          id?: string
          impressions?: number | null
          name: string
          qr_code_url?: string | null
          scans?: number | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_creative_url?: string | null
          budget?: number
          created_at?: string
          id?: string
          impressions?: number | null
          name?: string
          qr_code_url?: string | null
          scans?: number | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          inventory_count: number | null
          is_active: boolean | null
          name: string
          price: number
          product_url: string
          sku: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          is_active?: boolean | null
          name: string
          price: number
          product_url: string
          sku: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          is_active?: boolean | null
          name?: string
          price?: number
          product_url?: string
          sku?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      retail_campaigns: {
        Row: {
          ad_creative_url: string | null
          budget: number
          created_at: string
          id: string
          impressions: number | null
          name: string
          purchases: number | null
          qr_code_url: string | null
          revenue: number | null
          scans: number | null
          status: string
          target_audience: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_creative_url?: string | null
          budget: number
          created_at?: string
          id?: string
          impressions?: number | null
          name: string
          purchases?: number | null
          qr_code_url?: string | null
          revenue?: number | null
          scans?: number | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_creative_url?: string | null
          budget?: number
          created_at?: string
          id?: string
          impressions?: number | null
          name?: string
          purchases?: number | null
          qr_code_url?: string | null
          revenue?: number | null
          scans?: number | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopify_oauth_states: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          shop: string
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          shop: string
          state: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          shop?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      shopify_products: {
        Row: {
          created_at: string
          handle: string | null
          id: string
          product_id: string
          product_type: string | null
          published_at: string | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id: string | null
          tags: string[] | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          created_at?: string
          handle?: string | null
          id?: string
          product_id: string
          product_type?: string | null
          published_at?: string | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id?: string | null
          tags?: string[] | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          created_at?: string
          handle?: string | null
          id?: string
          product_id?: string
          product_type?: string | null
          published_at?: string | null
          shopify_product_id?: string
          shopify_store_id?: string
          shopify_variant_id?: string | null
          tags?: string[] | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_shopify_products_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_shopify_products_shopify_store_id"
            columns: ["shopify_store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_stores: {
        Row: {
          access_token: string
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          plan_name: string | null
          shop_domain: string
          shop_email: string | null
          shop_name: string | null
          shop_owner: string | null
          updated_at: string
          user_id: string
          webhook_endpoints: Json | null
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          plan_name?: string | null
          shop_domain: string
          shop_email?: string | null
          shop_name?: string | null
          shop_owner?: string | null
          updated_at?: string
          user_id: string
          webhook_endpoints?: Json | null
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          plan_name?: string | null
          shop_domain?: string
          shop_email?: string | null
          shop_name?: string | null
          shop_owner?: string | null
          updated_at?: string
          user_id?: string
          webhook_endpoints?: Json | null
        }
        Relationships: []
      }
      shopify_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          errors: Json | null
          id: string
          products_created: number | null
          products_processed: number | null
          products_updated: number | null
          shopify_store_id: string
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          errors?: Json | null
          id?: string
          products_created?: number | null
          products_processed?: number | null
          products_updated?: number | null
          shopify_store_id: string
          started_at?: string
          status?: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          errors?: Json | null
          id?: string
          products_created?: number | null
          products_processed?: number | null
          products_updated?: number | null
          shopify_store_id?: string
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_shopify_sync_logs_shopify_store_id"
            columns: ["shopify_store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
