'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import Canvas, { PlacedFlower } from '@/components/Canvas'
import FlowerCard from '@/components/FlowerCard'
import NoteCard from '@/components/NoteCard'
import { FLOWERS, FOCAL_FLOWERS, GREENERY, FILLERS, Flower } from '@/lib/flowers'

export default function StudioPage() {
  const router = useRouter()
  const [bouquetName, setBouquetName] = useState('')
  const [placedFlowers, setPlacedFlowers] = useState<PlacedFlower[]>([])
  const [history, setHistory] = useState<PlacedFlower[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showNoteCard, setShowNoteCard] = useState(false)
  const [note, setNote] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'focal' | 'greenery' | 'filler'>('focal')

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const undo = useCallback(() => {
    if (!canUndo) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setPlacedFlowers(history[newIndex])
  }, [canUndo, historyIndex, history])

  const redo = useCallback(() => {
    if (!canRedo) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setPlacedFlowers(history[newIndex])
  }, [canRedo, historyIndex, history])

  const clearAll = useCallback(() => {
    const newHistory = [...history.slice(0, historyIndex + 1), []]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setPlacedFlowers([])
  }, [history, historyIndex])

  // Restore draft from sessionStorage on mount (e.g. coming back from /send)
  useEffect(() => {
    const raw = sessionStorage.getItem('bloome_draft')
    if (!raw) return
    try {
      const draft = JSON.parse(raw)
      if (draft.bouquetName) setBouquetName(draft.bouquetName)
      if (draft.note) setNote(draft.note)
      if (Array.isArray(draft.placedFlowers) && draft.placedFlowers.length > 0) {
        setPlacedFlowers(draft.placedFlowers)
        setHistory([[], draft.placedFlowers])
        setHistoryIndex(1)
      }
    } catch {}
  }, [])

  // Auto-save draft to sessionStorage whenever canvas state changes
  useEffect(() => {
    sessionStorage.setItem(
      'bloome_draft',
      JSON.stringify({ bouquetName, placedFlowers, note })
    )
  }, [bouquetName, placedFlowers, note])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo()
        else undo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  const addFlower = (flower: Flower) => {
    const newFlower: PlacedFlower = {
      id: uuidv4(),
      flowerId: flower.id,
      x: 35 + Math.random() * 30,
      y: 20 + Math.random() * 40,
      scale: 1,
      flipped: false,
      rotation: 0,
    }
    const updated = [...placedFlowers, newFlower]
    const newHistory = [...history.slice(0, historyIndex + 1), updated]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setPlacedFlowers(updated)
  }

  const handleHistoryChange = (newHistory: PlacedFlower[][], newIndex: number) => {
    setHistory(newHistory)
    setHistoryIndex(newIndex)
  }

  const handleAddNote = () => {
    setShowNoteCard(true)
  }

  const handleNoteNext = () => {
    setShowNoteCard(false)
    // Save to sessionStorage and navigate
    sessionStorage.setItem(
      'bloome_draft',
      JSON.stringify({ bouquetName, placedFlowers, note })
    )
    router.push('/send')
  }

  const tabFlowers = activeTab === 'focal' ? FOCAL_FLOWERS : activeTab === 'greenery' ? GREENERY : FILLERS

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#DFE0DC' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0">
        <a href="/" className="text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: '#2C2C2A' }}>
          ← Bloome
        </a>
        <input
          type="text"
          value={bouquetName}
          onChange={e => setBouquetName(e.target.value)}
          placeholder="Name your bouquet..."
          className="flex-1 mx-4 text-center bg-transparent outline-none text-base font-medium placeholder-stone-400"
          style={{ fontFamily: "'DM Serif Display', serif", color: '#2C2C2A', maxWidth: 300 }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddNote}
          className="px-5 py-2.5 rounded-full text-sm font-medium shrink-0"
          style={{ background: '#2C2C2A', color: '#DFE0DC' }}
        >
          Add a Note →
        </motion.button>
      </div>

      {/* Toolbar ribbon */}
      <div className="flex justify-center px-4 shrink-0 mb-2">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)' }}
        >
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (⌘Z)"
            className="px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#2C2C2A' }}
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (⌘⇧Z)"
            className="px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#2C2C2A' }}
          >
            ↪
          </button>
          <div className="w-px h-5 bg-black/10" />
          <button
            onClick={clearAll}
            title="Clear all"
            className="px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-red-50 hover:text-red-600"
            style={{ color: '#2C2C2A' }}
          >
            🗑 Clear all
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden gap-4 px-4 pb-4 md:px-6 md:pb-6">
        {/* Flower panel — desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#E8E0D0' }}>
            {(['focal', 'greenery', 'filler'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors"
                style={{
                  color: activeTab === tab ? '#2C2C2A' : '#C7C2AB',
                  borderBottom: activeTab === tab ? '2px solid #2C2C2A' : '2px solid transparent',
                }}
              >
                {tab === 'focal' ? 'Flowers' : tab === 'greenery' ? 'Greens' : 'Fillers'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-1 content-start">
            {tabFlowers.map(flower => (
              <FlowerCard key={flower.id} flower={flower} onClick={addFlower} />
            ))}
          </div>
        </aside>

        {/* Canvas area */}
        <div className="flex-1 rounded-3xl overflow-hidden relative" style={{ background: '#DFE0DC', border: '1.5px solid rgba(44,44,42,0.08)' }}>
          <Canvas
            placedFlowers={placedFlowers}
            onUpdate={setPlacedFlowers}
            history={history}
            historyIndex={historyIndex}
            onHistoryChange={handleHistoryChange}
          />
        </div>
      </div>

      {/* Mobile flower panel toggle */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="w-full py-4 rounded-full font-medium text-sm shadow-lg"
          style={{ background: 'rgba(255,255,255,0.9)', color: '#2C2C2A', backdropFilter: 'blur(8px)' }}
        >
          {panelOpen ? '▼ Close Flowers' : '🌸 Add Flowers'}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="md:hidden fixed inset-x-0 bottom-0 z-40 rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.97)', maxHeight: '60vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="flex border-b mx-4" style={{ borderColor: '#E8E0D0' }}>
              {(['focal', 'greenery', 'filler'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-3 text-sm font-medium capitalize"
                  style={{
                    color: activeTab === tab ? '#2C2C2A' : '#C7C2AB',
                    borderBottom: activeTab === tab ? '2px solid #2C2C2A' : '2px solid transparent',
                  }}
                >
                  {tab === 'focal' ? 'Flowers' : tab === 'greenery' ? 'Greens' : 'Fillers'}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-4 gap-2" style={{ maxHeight: '45vh' }}>
              {tabFlowers.map(flower => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  onClick={f => { addFlower(f); setPanelOpen(false) }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NoteCard
        open={showNoteCard}
        note={note}
        onChange={setNote}
        onClose={() => setShowNoteCard(false)}
        onNext={handleNoteNext}
      />
    </div>
  )
}
