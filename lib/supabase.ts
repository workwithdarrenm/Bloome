import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PlacedFlower {
  flowerId: string
  x: number
  y: number
  scale: number
  flipped: boolean
  rotation: number
}

export interface BouquetRecord {
  id: string
  bouquet_name: string
  flowers: PlacedFlower[]
  note: string
  recipient_name: string
  recipient_email: string
  sender_name?: string
  created_at: string
}
