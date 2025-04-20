export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          age?: number | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          age?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      stations: {
        Row: {
          station_code: string
          station_name: string | null
        }
        Insert: {
          station_code: string
          station_name?: string | null
        }
        Update: {
          station_code?: string
          station_name?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          aadhar_number: string
          age: number
          booked_at: string
          class: string
          id: number
          name: string
          price: number
          train_number: string | null
          user_id: string | null
        }
        Insert: {
          aadhar_number: string
          age: number
          booked_at?: string
          class: string
          id?: number
          name: string
          price: number
          train_number?: string | null
          user_id?: string | null
        }
        Update: {
          aadhar_number?: string
          age?: number
          booked_at?: string
          class?: string
          id?: number
          name?: string
          price?: number
          train_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_train_number_fkey"
            columns: ["train_number"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["train_number"]
          },
        ]
      }
      train_schedule: {
        Row: {
          arrival_time: string | null
          departure_time: string | null
          distance_km: number | null
          id: number
          route_number: string | null
          seats_1a: number | null
          seats_2a: number | null
          seats_3a: number | null
          seats_sl: number | null
          station_code: string | null
          station_name: string | null
          stop_number: number | null
          train_number: string | null
        }
        Insert: {
          arrival_time?: string | null
          departure_time?: string | null
          distance_km?: number | null
          id?: number
          route_number?: string | null
          seats_1a?: number | null
          seats_2a?: number | null
          seats_3a?: number | null
          seats_sl?: number | null
          station_code?: string | null
          station_name?: string | null
          stop_number?: number | null
          train_number?: string | null
        }
        Update: {
          arrival_time?: string | null
          departure_time?: string | null
          distance_km?: number | null
          id?: number
          route_number?: string | null
          seats_1a?: number | null
          seats_2a?: number | null
          seats_3a?: number | null
          seats_sl?: number | null
          station_code?: string | null
          station_name?: string | null
          stop_number?: number | null
          train_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "train_schedule_train_number_fkey"
            columns: ["train_number"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["train_number"]
          },
        ]
      }
      trains: {
        Row: {
          days: string | null
          destination_station_name: string | null
          source_station_name: string | null
          train_name: string | null
          train_number: string
        }
        Insert: {
          days?: string | null
          destination_station_name?: string | null
          source_station_name?: string | null
          train_name?: string | null
          train_number: string
        }
        Update: {
          days?: string | null
          destination_station_name?: string | null
          source_station_name?: string | null
          train_name?: string | null
          train_number?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_seat: {
        Args: { p_train_number: string; p_seat_column: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
