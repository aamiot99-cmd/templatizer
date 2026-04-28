import type { ProjectState } from '../types'

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          name: string
          snapshot: ProjectState
          created_at: string
          updated_at: string
          locked_by: string | null
          locked_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          snapshot: ProjectState
          created_at?: string
          updated_at?: string
          locked_by?: string | null
          locked_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          snapshot?: ProjectState
          created_at?: string
          updated_at?: string
          locked_by?: string | null
          locked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_locked_by_fkey'
            columns: ['locked_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<never, never>
    Functions: {
      try_lock_project: {
        Args: { p_id: string }
        Returns: {
          acquired: boolean
          locked_by: string | null
          locked_by_email: string | null
          locked_at: string | null
        }[]
      }
      heartbeat_project: {
        Args: { p_id: string }
        Returns: boolean
      }
      release_project_lock: {
        Args: { p_id: string }
        Returns: undefined
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
