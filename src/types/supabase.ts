/* eslint-disable no-unused-vars */
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
      taskAssignments: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          task_id: number | null
          team_id: number | null
          team_member_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_id?: number | null
          team_id?: number | null
          team_member_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_id?: number | null
          team_id?: number | null
          team_member_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "taskAssignments_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taskAssignments_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taskAssignments_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taskAssignments_team_member_id_fkey"
            columns: ["team_member_id"]
            referencedRelation: "teamMembers"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: number
          priority: string | null
          status: string | null
          team_id: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          priority?: string | null
          status?: string | null
          team_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          priority?: string | null
          status?: string | null
          team_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      taskUpdates: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: number
          task_id: number | null
          team_id: number | null
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_id?: number | null
          team_id?: number | null
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          task_id?: number | null
          team_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taskUpdates_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taskUpdates_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taskUpdates_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teamMembers: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          status: string | null
          team_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teamMembers_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          created_by: string | null
          description: string | null
          id: number
          owner: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          owner?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          owner?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      get_my_team_memberships: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_tasks_created_by_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_team_members_of_a_team: {
        Args: {
          team_id: number
        }
        Returns: {
          id: number
          user_id: string
        }[]
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
