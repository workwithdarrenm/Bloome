import { Metadata } from 'next'
import BouquetReveal from './BouquetReveal'
import { supabase } from '@/lib/supabase'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase.from('bouquets').select('bouquet_name, recipient_name').eq('id', id).single()
  return {
    title: data ? `${data.bouquet_name} — Bloome` : 'A bouquet for you — Bloome',
    description: data ? `${data.recipient_name} received a bouquet on Bloome` : 'Open your digital bouquet',
  }
}

export default async function BouquetPage({ params }: Props) {
  const { id } = await params
  const { data, error } = await supabase
    .from('bouquets')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#DFE0DC' }}>
        <div className="text-center">
          <p className="text-5xl mb-4">🥀</p>
          <h1 className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}>
            Bouquet not found
          </h1>
          <p className="mt-2 opacity-50 text-sm" style={{ color: '#2C2C2A' }}>
            This link may have expired or been removed.
          </p>
          <a href="/studio" className="mt-6 inline-block px-6 py-3 rounded-full text-sm font-medium" style={{ background: '#2C2C2A', color: '#DFE0DC' }}>
            Create your own →
          </a>
        </div>
      </main>
    )
  }

  return <BouquetReveal bouquet={data} />
}
