// app/lib/types.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
        }
      }
      columns: {
        Row: {
          id: string
          board_id: string
          title: string
          position: number
          created_at: string
        }
      }
      tasks: {
        Row: {
          id: string
          column_id: string
          title: string
          description: string | null
          position: number
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          created_at: string
        }
      }
    }
  }
}