'use client'

import { motion } from 'framer-motion'
import { Flower } from '@/lib/flowers'

interface FlowerCardProps {
  flower: Flower
  onClick: (flower: Flower) => void
}

export default function FlowerCard({ flower, onClick }: FlowerCardProps) {
  const moodColor: Record<string, string> = {
    Joy: '#F4C842',
    Love: '#E8547A',
    Gratitude: '#9B7BB0',
    Calm: '#7BA06A',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(flower)}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl w-full text-left transition-colors hover:bg-white/60"
      style={{ background: 'transparent' }}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={flower.svgPath}
          alt={flower.name}
          style={{ width: 60, height: 60, objectFit: 'contain' }}
          draggable={false}
        />
      </div>
      <span className="text-xs font-medium text-center leading-tight" style={{ color: '#2C2C2A' }}>
        {flower.name}
      </span>
      {flower.mood && (
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: (moodColor[flower.mood] ?? '#C7C2AB') + '30',
            color: moodColor[flower.mood] ?? '#C7C2AB',
          }}
        >
          {flower.mood}
        </span>
      )}
    </motion.button>
  )
}
