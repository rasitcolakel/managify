/* eslint-disable no-unused-vars */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teamMembers: {
        Row: {
          created_at: string | null
          id: number
          status: string | null
          team_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teamMembers_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teamMembers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          owner: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          owner?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          owner?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_fkey"
            columns: ["owner"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_authenticated_user_teams: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_teams_owned_by_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: number[]
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
