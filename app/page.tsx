'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: '#DFE0DC' }}
    >
      {/* Floating decorations */}
      <motion.div
        className="absolute top-16 left-12 text-5xl opacity-60 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute top-24 right-16 text-4xl opacity-50 hidden md:block"
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🌿
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-20 text-3xl opacity-40 hidden md:block"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        🌷
      </motion.div>
      <motion.div
        className="absolute bottom-24 right-24 text-4xl opacity-50 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🌼
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-xl"
      >
        <motion.p
          className="text-sm tracking-widest uppercase mb-8"
          style={{ color: '#2C2C2A', letterSpacing: '0.3em', opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          Bloome
        </motion.p>

        <h1
          className="text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight"
          style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
        >
          Arrange.<br />Send.<br />
          <em>Mean it.</em>
        </h1>

        <p
          className="text-lg md:text-xl mb-12 leading-relaxed"
          style={{ color: '#2C2C2A', opacity: 0.65 }}
        >
          Build your own bouquet.<br />Send it to someone you love.
        </p>

        <Link href="/studio">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-5 text-lg font-medium rounded-full shadow-lg"
            style={{ background: '#2C2C2A', color: '#DFE0DC' }}
          >
            Start Arranging
          </motion.button>
        </Link>
      </motion.div>
    </main>
  )
}
