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
      translations: {
        Row: {
          count: number
          created_at: string
          created_by: string
          id: number
          language: Database["public"]["Enums"]["languages"]
          original: string
          translation: string
        }
        Insert: {
          count?: number
          created_at?: string
          created_by: string
          id?: number
          language?: Database["public"]["Enums"]["languages"]
          original: string
          translation: string
        }
        Update: {
          count?: number
          created_at?: string
          created_by?: string
          id?: number
          language?: Database["public"]["Enums"]["languages"]
          original?: string
          translation?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      languages: "de" | "en" | "pl" | "ru" | "it" | "es" | "fr"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
