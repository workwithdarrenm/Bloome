'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FLOWERS, Flower } from '@/lib/flowers'

export interface PlacedFlower {
  id: string
  flowerId: string
  x: number
  y: number
  scale: number
  flipped: boolean
  rotation: number
}

interface CanvasProps {
  placedFlowers: PlacedFlower[]
  onUpdate: (flowers: PlacedFlower[]) => void
  history: PlacedFlower[][]
  historyIndex: number
  onHistoryChange: (history: PlacedFlower[][], index: number) => void
}

export default function Canvas({
  placedFlowers,
  onUpdate,
  history,
  historyIndex,
  onHistoryChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const pushHistory = useCallback(
    (flowers: PlacedFlower[]) => {
      const newHistory = [...history.slice(0, historyIndex + 1), flowers]
      onHistoryChange(newHistory, newHistory.length - 1)
      onUpdate(flowers)
    },
    [history, historyIndex, onHistoryChange, onUpdate]
  )

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-placed-flower]')) return
    setSelected(null)
  }

  const handleFlowerMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelected(id)
    setDragging(id)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    }
  }

  const handleFlowerTouchStart = (e: React.TouchEvent, id: string) => {
    e.stopPropagation()
    setSelected(id)
    setDragging(id)
    const touch = e.touches[0]
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffset.current = {
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !canvasRef.current) return
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - dragOffset.current.x - canvasRect.left) / canvasRect.width) * 100
      const y = ((e.clientY - dragOffset.current.y - canvasRect.top) / canvasRect.height) * 100
      const updated = placedFlowers.map(f =>
        f.id === dragging ? { ...f, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : f
      )
      onUpdate(updated)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging || !canvasRef.current) return
      const touch = e.touches[0]
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = ((touch.clientX - dragOffset.current.x - canvasRect.left) / canvasRect.width) * 100
      const y = ((touch.clientY - dragOffset.current.y - canvasRect.top) / canvasRect.height) * 100
      const updated = placedFlowers.map(f =>
        f.id === dragging ? { ...f, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : f
      )
      onUpdate(updated)
    }

    const handleMouseUp = () => {
      if (dragging) {
        pushHistory(placedFlowers)
        setDragging(null)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [dragging, placedFlowers, onUpdate, pushHistory])

  const deleteFlower = (id: string) => {
    const updated = placedFlowers.filter(f => f.id !== id)
    pushHistory(updated)
    setSelected(null)
  }

  const flipFlower = (id: string) => {
    const updated = placedFlowers.map(f => (f.id === id ? { ...f, flipped: !f.flipped } : f))
    pushHistory(updated)
  }

  const resizeFlower = (id: string, scale: number) => {
    const updated = placedFlowers.map(f => (f.id === id ? { ...f, scale } : f))
    onUpdate(updated)
  }

  const resizeFlowerCommit = (id: string, scale: number) => {
    const updated = placedFlowers.map(f => (f.id === id ? { ...f, scale } : f))
    pushHistory(updated)
  }

  const rotateFlower = (id: string, rotation: number) => {
    const updated = placedFlowers.map(f => (f.id === id ? { ...f, rotation } : f))
    onUpdate(updated)
  }

  const rotateFlowerCommit = (id: string, rotation: number) => {
    const updated = placedFlowers.map(f => (f.id === id ? { ...f, rotation } : f))
    pushHistory(updated)
  }

  const selectedFlower = placedFlowers.find(f => f.id === selected)

  return (
    <div className="relative w-full h-full select-none" ref={canvasRef} onClick={handleCanvasClick}>
      {/* Back wrapper layer - z-10 */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ zIndex: 10 }}>
        <img
          src="/flowers/bouquet_back.svg"
          alt=""
          style={{ width: 560, height: 560, position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Flower canvas - z-20 */}
      <div className="absolute inset-0" style={{ zIndex: 20 }}>
        <AnimatePresence>
          {placedFlowers.map(pf => {
            const flower = FLOWERS.find(f => f.id === pf.flowerId)
            if (!flower) return null
            const isSelected = selected === pf.id
            return (
              // Outer motion.div: position + entrance/exit animation
              // Inner div: user scale + flip applied via plain CSS (FM can't interfere)
              <motion.div
                key={pf.id}
                data-placed-flower
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  position: 'absolute',
                  left: `${pf.x}%`,
                  top: `${pf.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: dragging === pf.id ? 'grabbing' : 'grab',
                  filter: isSelected ? 'drop-shadow(0 0 8px rgba(44,44,42,0.4))' : 'none',
                }}
                onMouseDown={e => handleFlowerMouseDown(e, pf.id)}
                onTouchStart={e => handleFlowerTouchStart(e, pf.id)}
              >
                <div
                  style={{
                    transform: `rotate(${pf.rotation ?? 0}deg) scale(${pf.scale}) scaleX(${pf.flipped ? -1 : 1})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <img
                    src={flower.svgPath}
                    alt={flower.name}
                    style={{ width: 80, height: 80, display: 'block', pointerEvents: 'none' }}
                    draggable={false}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Front wrapper layer - z-30 */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ zIndex: 30 }}>
        <img
          src="/flowers/bouquet_front.svg"
          alt=""
          style={{ width: 560, height: 560, position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Selection toolbar - z-40 */}
      {selectedFlower && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-3 px-4 py-2 rounded-full shadow-lg"
          style={{ zIndex: 40, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => flipFlower(selectedFlower.id)}
            className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            style={{ color: '#2C2C2A' }}
            title="Flip"
          >
            ↔
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">Size</span>
            <input
              type="range"
              min={0.3}
              max={2.5}
              step={0.05}
              value={selectedFlower.scale}
              onChange={e => resizeFlower(selectedFlower.id, parseFloat(e.target.value))}
              onMouseUp={e => resizeFlowerCommit(selectedFlower.id, parseFloat((e.target as HTMLInputElement).value))}
              className="w-24 accent-stone-800"
            />
            <span className="text-xs opacity-50 w-8">{Math.round(selectedFlower.scale * 100)}%</span>
          </div>
          <div className="w-px h-5 bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">Rotate</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={selectedFlower.rotation ?? 0}
              onChange={e => rotateFlower(selectedFlower.id, parseFloat(e.target.value))}
              onMouseUp={e => rotateFlowerCommit(selectedFlower.id, parseFloat((e.target as HTMLInputElement).value))}
              className="w-24 accent-stone-800"
            />
            <span className="text-xs opacity-50 w-8">{Math.round(selectedFlower.rotation ?? 0)}°</span>
          </div>
          <button
            onClick={() => deleteFlower(selectedFlower.id)}
            className="px-3 py-1.5 rounded-full text-sm hover:bg-red-50 transition-colors"
            style={{ color: '#C0392B' }}
            title="Delete"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  )
}
