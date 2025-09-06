// TypeScript types for Supabase database schema
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
      // Auth tables are managed by Supabase
      [_ in never]: never
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

// User type from Supabase Auth
export interface User {
  id: string
  aud: string
  role?: string
  email?: string
  email_confirmed_at?: string
  phone?: string
  phone_confirmed_at?: string
  confirmed_at?: string
  last_sign_in_at?: string
  app_metadata: {
    provider?: string
    providers?: string[]
  }
  user_metadata: {
    [key: string]: any
  }
  identities?: Array<{
    id: string
    user_id: string
    identity_data?: {
      [key: string]: any
    }
    provider: string
    last_sign_in_at?: string
    created_at?: string
    updated_at?: string
  }>
  created_at?: string
  updated_at?: string
}