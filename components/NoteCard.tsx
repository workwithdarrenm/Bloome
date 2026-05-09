'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface NoteCardProps {
  open: boolean
  note: string
  onChange: (note: string) => void
  onClose: () => void
  onNext: () => void
}

const MAX_CHARS = 200

export default function NoteCard({ open, note, onChange, onClose, onNext }: NoteCardProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ zIndex: 100 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(44,44,42,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col gap-5"
            style={{ background: '#FEFAF6' }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            >
              ✕
            </button>

            <div>
              <h2
                className="text-2xl mb-1"
                style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A' }}
              >
                Write a note
              </h2>
              <p className="text-sm opacity-50" style={{ color: '#2C2C2A' }}>
                It&apos;ll arrive with your bouquet.
              </p>
            </div>

            {/* Lined notecard area */}
            <div
              className="relative rounded-2xl p-5"
              style={{
                background: '#FFFDF7',
                border: '1px solid #E8E0D0',
                minHeight: 180,
              }}
            >
              {/* Ruled lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-5 right-5 border-b"
                  style={{
                    top: `${44 + i * 30}px`,
                    borderColor: '#EDE8DF',
                  }}
                />
              ))}
              <textarea
                className="relative w-full resize-none outline-none bg-transparent text-xl leading-[30px] placeholder-stone-300"
                style={{
                  fontFamily: "'Reenie Beanie', cursive",
                  color: '#2C2C2A',
                  minHeight: 150,
                  zIndex: 1,
                }}
                placeholder="Write something kind..."
                value={note}
                onChange={e => {
                  if (e.target.value.length <= MAX_CHARS) onChange(e.target.value)
                }}
                maxLength={MAX_CHARS}
              />
            </div>

            {/* Character counter */}
            <div className="flex justify-end">
              <span
                className="text-xs"
                style={{ color: note.length >= MAX_CHARS * 0.9 ? '#C0392B' : '#C7C2AB' }}
              >
                {note.length}/{MAX_CHARS}
              </span>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="w-full py-4 rounded-full font-medium text-base"
              style={{ background: '#2C2C2A', color: '#DFE0DC' }}
            >
              Preview &amp; Send →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
