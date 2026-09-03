import { useEffect, useMemo, useRef, useState } from "react"

// Placeholder word list — final words TBD.
const WORDS = ["ADWOA", "CRAFT", "LEAN", "WEB", "DEXWIN", "SEARCH"]
const STORAGE_KEY = "missbaah-word-search-found"
const SEED = 42

type Direction = "right" | "down"
type Cell = { row: number; col: number }
type Placement = { word: string; cells: Cell[] }
type Grid = { size: number; letters: string[][]; placements: Placement[] }

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function cellsFor(row: number, col: number, dir: Direction, length: number): Cell[] {
  return Array.from({ length }, (_, i) =>
    dir === "right" ? { row, col: col + i } : { row: row + i, col }
  )
}

// Deterministic placement: same seed + size always produces the same puzzle.
function buildGrid(size: number, words: string[], seed: number): Grid {
  const letters: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  )
  const placements: Placement[] = []
  const rand = mulberry32(seed)
  const sorted = [...words].sort((a, b) => b.length - a.length)

  for (const word of sorted) {
    let placed = false
    for (let row = 0; row < size && !placed; row++) {
      for (let col = 0; col < size && !placed; col++) {
        for (const dir of ["right", "down"] as Direction[]) {
          const cells = cellsFor(row, col, dir, word.length)
          if (!cells.every((c) => c.row < size && c.col < size)) continue
          const fits = cells.every((c, i) => {
            const existing = letters[c.row][c.col]
            return !existing || existing === word[i]
          })
          if (fits) {
            cells.forEach((c, i) => {
              letters[c.row][c.col] = word[i]
            })
            placements.push({ word, cells })
            placed = true
            break
          }
        }
      }
    }
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!letters[row][col]) {
        letters[row][col] = String.fromCharCode(65 + Math.floor(rand() * 26))
      }
    }
  }

  return { size, letters, placements }
}

function cellKey(c: Cell) {
  return `${c.row}-${c.col}`
}

function sameLine(a: Cell, b: Cell) {
  return a.row === b.row || a.col === b.col
}

function cellsBetween(start: Cell, end: Cell): Cell[] {
  if (start.row === end.row) {
    const [from, to] = start.col <= end.col ? [start.col, end.col] : [end.col, start.col]
    return Array.from({ length: to - from + 1 }, (_, i) => ({ row: start.row, col: from + i }))
  }
  const [from, to] = start.row <= end.row ? [start.row, end.row] : [end.row, start.row]
  return Array.from({ length: to - from + 1 }, (_, i) => ({ row: from + i, col: start.col }))
}

function matchesWord(selected: Cell[], placement: Placement) {
  if (selected.length !== placement.cells.length) return false
  const forward = placement.cells.every(
    (c, i) => c.row === selected[i].row && c.col === selected[i].col
  )
  const backward = placement.cells.every(
    (c, i) =>
      c.row === selected[selected.length - 1 - i].row &&
      c.col === selected[selected.length - 1 - i].col
  )
  return forward || backward
}

function Puzzle({
  size,
  found,
  onFound,
}: {
  size: number
  found: Set<string>
  onFound: (word: string) => void
}) {
  const grid = useMemo(() => buildGrid(size, WORDS, SEED), [size])
  const [dragStart, setDragStart] = useState<Cell | null>(null)
  const [dragEnd, setDragEnd] = useState<Cell | null>(null)
  const draggingRef = useRef(false)

  const selected =
    dragStart && dragEnd && sameLine(dragStart, dragEnd)
      ? cellsBetween(dragStart, dragEnd)
      : dragStart
        ? [dragStart]
        : []

  const foundCells = new Set(
    grid.placements
      .filter((p) => found.has(p.word))
      .flatMap((p) => p.cells.map(cellKey))
  )

  const finishSelection = () => {
    if (draggingRef.current && selected.length > 1) {
      const match = grid.placements.find(
        (p) => !found.has(p.word) && matchesWord(selected, p)
      )
      if (match) onFound(match.word)
    }
    draggingRef.current = false
    setDragStart(null)
    setDragEnd(null)
  }

  return (
    <div
      className="grid gap-1 mx-auto w-full max-w-xs md:max-w-sm touch-none select-none"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      onPointerDown={(e) => {
        const target = (e.target as HTMLElement).closest("[data-row]") as HTMLElement | null
        if (!target) return
        const row = Number(target.dataset.row)
        const col = Number(target.dataset.col)
        draggingRef.current = true
        setDragStart({ row, col })
        setDragEnd({ row, col })
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
        const target = el?.closest("[data-row]") as HTMLElement | null
        if (!target) return
        setDragEnd({ row: Number(target.dataset.row), col: Number(target.dataset.col) })
      }}
      onPointerUp={finishSelection}
      onPointerLeave={() => draggingRef.current && finishSelection()}
    >
      {grid.letters.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey({ row: r, col: c })
          const isSelected = selected.some((s) => cellKey(s) === key)
          const isFound = foundCells.has(key)
          return (
            <div
              key={key}
              data-row={r}
              data-col={c}
              className={`aspect-square flex items-center justify-center text-xs md:text-sm font-aeonik rounded-md transition-colors ${
                isFound
                  ? "bg-primary text-white"
                  : isSelected
                    ? "bg-secondary/20"
                    : "bg-[#F7F7F6]"
              }`}
            >
              {letter}
            </div>
          )
        })
      )}
    </div>
  )
}

export default function WordSearch() {
  const [found, setFound] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFound(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  const handleFound = (word: string) => {
    setFound((prev) => {
      const next = new Set(prev)
      next.add(word)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const allFound = found.size === WORDS.length

  return (
    <div className="flex flex-col gap-4">
      <div className="md:hidden">
        <Puzzle size={8} found={found} onFound={handleFound} />
      </div>
      <div className="hidden md:block">
        <Puzzle size={10} found={found} onFound={handleFound} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-sm font-aeonik">
        {WORDS.map((word) => (
          <span key={word} className={found.has(word) ? "line-through text-gray-light" : "text-dark"}>
            {word}
          </span>
        ))}
      </div>
      {allFound && (
        <p className="text-center text-sm text-gray-light font-aeonik">found them all ✨</p>
      )}
    </div>
  )
}
