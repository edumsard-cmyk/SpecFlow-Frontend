export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'admin' | 'company' | 'user'
export type ProjectStatus = 'briefing' | 'refinement' | 'specification' | 'documentation' | 'manual' | 'done'
export type DocumentType = 'spec' | 'manual' | 'doc'

type Relationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: Relationship[]
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: UserRole
          company_id: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: UserRole
          company_id?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: UserRole
          company_id?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: Relationship[]
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          company_id: string
          created_by: string
          status: ProjectStatus
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_id: string
          created_by: string
          status?: ProjectStatus
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_id?: string
          created_by?: string
          status?: ProjectStatus
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: Relationship[]
      }
      user_stories: {
        Row: {
          id: string
          project_id: string
          code: string
          title: string
          description: string
          acceptance_criteria: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          code: string
          title: string
          description: string
          acceptance_criteria?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          code?: string
          title?: string
          description?: string
          acceptance_criteria?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: Relationship[]
      }
      documents: {
        Row: {
          id: string
          project_id: string
          type: DocumentType
          content: string
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: DocumentType
          content: string
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: DocumentType
          content?: string
          version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: Relationship[]
      }
      briefings: {
        Row: {
          id: string
          project_id: string
          input_type: 'text' | 'audio' | 'document' | 'form' | 'video'
          content: string
          audio_url: string | null
          document_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          input_type: 'text' | 'audio' | 'document' | 'form' | 'video'
          content: string
          audio_url?: string | null
          document_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          input_type?: 'text' | 'audio' | 'document' | 'form'
          content?: string
          audio_url?: string | null
          document_url?: string | null
          created_at?: string
        }
        Relationships: Relationship[]
      }
      refinement_messages: {
        Row: {
          id: string
          project_id: string
          role: 'ai' | 'user'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          role: 'ai' | 'user'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          role?: 'ai' | 'user'
          content?: string
          created_at?: string
        }
        Relationships: Relationship[]
      }
      audit_logs: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: Relationship[]
      }
      story_comments: {
        Row: {
          id: string
          project_id: string
          story_code: string
          user_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          story_code: string
          user_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          story_code?: string
          user_id?: string
          body?: string
          created_at?: string
        }
        Relationships: Relationship[]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      project_status: ProjectStatus
      document_type: DocumentType
    }
  }
}
