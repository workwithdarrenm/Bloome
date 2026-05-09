'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FLOWERS } from '@/lib/flowers'
import { PlacedFlower } from '@/components/Canvas'

interface Draft {
  bouquetName: string
  placedFlowers: PlacedFlower[]
  note: string
}

export default function SendPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [bouquetId, setBouquetId] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('bloome_draft')
    if (raw) setDraft(JSON.parse(raw))
    else router.push('/studio')
  }, [router])

  const handleSend = async () => {
    if (!recipientName.trim() || !recipientEmail.trim()) {
      setError('Please fill in recipient name and email.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bouquetName: draft?.bouquetName || 'A bouquet for you',
          placedFlowers: draft?.placedFlowers || [],
          note: draft?.note || '',
          recipientName,
          recipientEmail,
          senderName: senderName || 'Someone',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setBouquetId(data.id)
      setSent(true)
      sessionStorage.removeItem('bloome_draft')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: '#DFE0DC' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl mb-6"
          >
            🌸
          </motion.div>
          <h1
            className="text-4xl mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
          >
            Bouquet sent!
          </h1>
          <p className="text-base mb-8 opacity-60" style={{ color: '#2C2C2A' }}>
            {recipientName} will receive an email with your bouquet shortly.
          </p>
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/bouquet/${bouquetId}`)}
              className="px-8 py-4 rounded-full font-medium"
              style={{ background: '#2C2C2A', color: '#DFE0DC' }}
            >
              Preview reveal page
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/studio')}
              className="px-8 py-4 rounded-full font-medium border"
              style={{ borderColor: '#C7C2AB', color: '#2C2C2A' }}
            >
              Make another bouquet
            </motion.button>
          </div>
        </motion.div>
      </main>
    )
  }

  if (!draft) return null

  return (
    <main className="min-h-screen py-12 px-4" style={{ background: '#DFE0DC' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <button
            onClick={() => router.push('/studio')}
            className="mb-8 text-sm opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: '#2C2C2A' }}
          >
            ← Back to studio
          </button>

          <h1
            className="text-4xl mb-2"
            style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
          >
            Preview &amp; Send
          </h1>
          <p className="text-sm mb-10 opacity-50" style={{ color: '#2C2C2A' }}>
            Review your bouquet, add recipient details, then send.
          </p>

          {/* Two-column preview */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Bouquet preview card */}
            <div
              className="rounded-3xl overflow-hidden shadow-md"
              style={{ background: '#FFFFFF' }}
            >
              {/* Render at the same canonical size as the reveal page (500×540 / 460×460 wrappers)
                  then scale down to fit the 280px preview height — flowers stay in exact positions */}
              <div style={{ background: '#DFE0DC', height: 280, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  width: 500,
                  height: 540,
                  top: 0,
                  left: '50%',
                  marginLeft: -250,
                  transform: `scale(${280 / 540})`,
                  transformOrigin: 'top center',
                }}>
                  <img src="/flowers/bouquet_back.svg" alt="" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 460, height: 460, zIndex: 10, pointerEvents: 'none' }} />
                  <div className="absolute inset-0" style={{ zIndex: 20 }}>
                    {draft.placedFlowers.map((pf, i) => {
                      const flower = FLOWERS.find(f => f.id === pf.flowerId)
                      if (!flower) return null
                      return (
                        <div key={pf.id + i} style={{ position: 'absolute', left: `${pf.x}%`, top: `${pf.y}%`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                          <div style={{ transform: `scale(${pf.scale}) rotate(${pf.rotation ?? 0}deg) scaleX(${pf.flipped ? -1 : 1})`, transformOrigin: 'center center' }}>
                            <img src={flower.svgPath} alt={flower.name} style={{ width: 80, height: 80, display: 'block' }} draggable={false} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <img src="/flowers/bouquet_front.svg" alt="" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 460, height: 460, zIndex: 30, pointerEvents: 'none' }} />
                </div>
              </div>
              <div className="p-4">
                <p
                  className="text-lg font-medium"
                  style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
                >
                  {draft.bouquetName || 'Untitled Bouquet'}
                </p>
                <p className="text-xs opacity-40 mt-0.5" style={{ color: '#2C2C2A' }}>
                  {draft.placedFlowers.length} flower{draft.placedFlowers.length !== 1 ? 's' : ''} arranged
                </p>
              </div>
            </div>

            {/* Note card preview */}
            <div
              className="rounded-3xl p-6 flex flex-col justify-between shadow-md"
              style={{ background: '#FFFDF7', minHeight: 280, border: '1px solid #E8E0D0' }}
            >
              <div>
                <p className="text-xs uppercase tracking-widest opacity-30 mb-4" style={{ color: '#2C2C2A', letterSpacing: '0.2em' }}>
                  Note
                </p>
                {draft.note ? (
                  <p
                    className="text-2xl leading-relaxed"
                    style={{ fontFamily: "'Reenie Beanie', cursive", color: '#2C2C2A' }}
                  >
                    {draft.note}
                  </p>
                ) : (
                  <p className="text-sm opacity-30 italic" style={{ color: '#2C2C2A' }}>
                    No note added
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recipient form */}
          <div
            className="rounded-3xl p-6 md:p-8 shadow-md"
            style={{ background: '#FFFFFF' }}
          >
            <h2
              className="text-xl mb-6"
              style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
            >
              Who&apos;s it for?
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium opacity-50 block mb-1.5" style={{ color: '#2C2C2A' }}>
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-3 rounded-xl outline-none text-base transition-colors"
                  style={{ background: '#F5F3EF', color: '#2C2C2A' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium opacity-50 block mb-1.5" style={{ color: '#2C2C2A' }}>
                  Recipient name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. Jamie"
                  className="w-full px-4 py-3 rounded-xl outline-none text-base"
                  style={{ background: '#F5F3EF', color: '#2C2C2A' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium opacity-50 block mb-1.5" style={{ color: '#2C2C2A' }}>
                  Recipient email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="jamie@email.com"
                  className="w-full px-4 py-3 rounded-xl outline-none text-base"
                  style={{ background: '#F5F3EF', color: '#2C2C2A' }}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={sending}
              className="mt-6 w-full py-4 rounded-full font-medium text-base disabled:opacity-60"
              style={{ background: '#2C2C2A', color: '#DFE0DC' }}
            >
              {sending ? 'Sending...' : 'Send Bouquet 🌸'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
