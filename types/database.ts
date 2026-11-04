export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
        };
        Insert: {
          created_at?: string;
          email: string;
        };
        Update: {
          created_at?: string;
          email?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          age_bracket: string;
          brochure_url: string | null;
          capstone: Json | null;
          created_at: string;
          description: Json;
          duration_weeks: number;
          featured: boolean;
          highlights: Json;
          id: string;
          lede: Json;
          level: string;
          mentor: Json | null;
          modules: Json;
          next_cohort: Json | null;
          outcomes: Json;
          schedule: Json | null;
          seats_left: number;
          sessions_per_week: number;
          title: Json;
          tools: Json;
          track: string;
          updated_at: string;
        };
        Insert: {
          age_bracket: string;
          brochure_url?: string | null;
          capstone?: Json | null;
          created_at?: string;
          description: Json;
          duration_weeks?: number;
          featured?: boolean;
          highlights?: Json;
          id: string;
          lede: Json;
          level: string;
          mentor?: Json | null;
          modules?: Json;
          next_cohort?: Json | null;
          outcomes?: Json;
          schedule?: Json | null;
          seats_left?: number;
          sessions_per_week?: number;
          title: Json;
          tools?: Json;
          track: string;
          updated_at?: string;
        };
        Update: {
          age_bracket?: string;
          brochure_url?: string | null;
          capstone?: Json | null;
          created_at?: string;
          description?: Json;
          duration_weeks?: number;
          featured?: boolean;
          highlights?: Json;
          id?: string;
          lede?: Json;
          level?: string;
          mentor?: Json | null;
          modules?: Json;
          next_cohort?: Json | null;
          outcomes?: Json;
          schedule?: Json | null;
          seats_left?: number;
          sessions_per_week?: number;
          title?: Json;
          tools?: Json;
          track?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      waitlist_leads: {
        Row: {
          age_group: string;
          contact: string;
          course_id: string | null;
          created_at: string;
          id: string;
          locale: string;
          name: string;
          notes: string | null;
          status: string;
        };
        Insert: {
          age_group: string;
          contact: string;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          locale?: string;
          name: string;
          notes?: string | null;
          status?: string;
        };
        Update: {
          age_group?: string;
          contact?: string;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          locale?: string;
          name?: string;
          notes?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'waitlist_leads_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export const Constants = {
  public: {
    Enums: {}
  }
} as const;
