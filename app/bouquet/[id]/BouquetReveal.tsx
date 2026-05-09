'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FLOWERS } from '@/lib/flowers'
import { BouquetRecord } from '@/lib/supabase'

interface Props {
  bouquet: BouquetRecord
}

export default function BouquetReveal({ bouquet }: Props) {
  const [showNote, setShowNote] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowNote(true), bouquet.flowers.length * 150 + 800)
    return () => clearTimeout(timer)
  }, [bouquet.flowers.length])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4" style={{ background: '#DFE0DC' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-widest uppercase opacity-40 mb-3" style={{ color: '#2C2C2A', letterSpacing: '0.3em' }}>
          Bloome
        </p>
        <h1
          className="text-4xl md:text-5xl"
          style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
        >
          {bouquet.bouquet_name || 'A bouquet for you'}
        </h1>
        {bouquet.recipient_name && (
          <p className="mt-2 opacity-50 text-sm" style={{ color: '#2C2C2A' }}>
            For {bouquet.recipient_name}
          </p>
        )}
      </motion.div>

      {/* Bouquet canvas */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl mb-10"
        style={{ width: '100%', maxWidth: 500, height: 540, background: '#DFE0DC' }}
      >
        {/* Back wrapper */}
        <img
          src="/flowers/bouquet_back.svg"
          alt=""
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 460, height: 460, zIndex: 10, pointerEvents: 'none' }}
        />

        {/* Animated flowers */}
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          {bouquet.flowers.map((pf, i) => {
            const flower = FLOWERS.find(f => f.id === pf.flowerId)
            if (!flower) return null
            return (
              // Position layer — places the anchor point on the canvas
              <div
                key={pf.flowerId + i}
                style={{
                  position: 'absolute',
                  left: `${pf.x}%`,
                  top: `${pf.y}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                {/* Entrance animation — FM only controls opacity + bloom-in, never scale */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: i * 0.15,
                    type: 'spring',
                    stiffness: 350,
                    damping: 18,
                  }}
                >
                  {/* User transforms — plain CSS, FM cannot interfere */}
                  <div
                    style={{
                      transform: `scale(${pf.scale}) rotate(${pf.rotation ?? 0}deg) scaleX(${pf.flipped ? -1 : 1})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <img
                      src={flower.svgPath}
                      alt={flower.name}
                      style={{ width: 80, height: 80, display: 'block' }}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Front wrapper */}
        <img
          src="/flowers/bouquet_front.svg"
          alt=""
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 460, height: 460, zIndex: 30, pointerEvents: 'none' }}
        />
      </div>

      {/* Note card */}
      {bouquet.note && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showNote ? 1 : 0, y: showNote ? 0 : 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md rounded-3xl p-8 shadow-md mb-10"
          style={{ background: '#FFFDF7', border: '1px solid #E8E0D0' }}
        >
          <p className="text-xs uppercase tracking-widest opacity-30 mb-4" style={{ color: '#2C2C2A', letterSpacing: '0.2em' }}>
            A note
          </p>
          <p
            className="text-3xl leading-relaxed"
            style={{ fontFamily: "'Reenie Beanie', cursive", color: '#2C2C2A' }}
          >
            {bouquet.note}
          </p>
          {bouquet.sender_name && (
            <p className="mt-6 text-sm opacity-40 text-right" style={{ color: '#2C2C2A' }}>
              — {bouquet.sender_name}
            </p>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showNote ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <a
          href="/studio"
          className="flex-1 py-4 rounded-full font-medium text-center text-sm"
          style={{ background: '#2C2C2A', color: '#DFE0DC' }}
        >
          Send one back →
        </a>
        <button
          onClick={copyLink}
          className="flex-1 py-4 rounded-full font-medium text-sm border transition-colors"
          style={{ borderColor: '#C7C2AB', color: '#2C2C2A' }}
        >
          {copied ? 'Copied! ✓' : 'Copy link'}
        </button>
      </motion.div>
    </main>
  )
}
