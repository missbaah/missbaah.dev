import { useEffect, useMemo, useRef, useState } from "react"

// One set per round; the 🔄 button cycles through them. Keep words to 6
// letters or fewer so every set fits the same grid.
const WORD_SETS = [
  ["ADWOA", "CRAFT", "LEAN", "WEB", "DEXWIN"],
  ["BOOKS", "TEA", "OBSIDIAN", "WORDS", "IDEAS"],
  ["ACCRA", "KENTE", "JOLLOF", "TWI", "AKWABA"],
  ["REACT", "ASTRO", "CSS", "DEPLOY", "PIXEL"],
]
const STORAGE_KEY = "missbaah-word-search-found"
const SEED = 42
// Fits the longest word; the grid only places words right or down
const SIZE = Math.max(...WORD_SETS.flat().map((w) => w.length))

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

function cellsFor(
  row: number,
  col: number,
  dir: Direction,
  length: number
): Cell[] {
  return Array.from({ length }, (_, i) =>
    dir === "right" ? { row, col: col + i } : { row: row + i, col }
  )
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// How crowded a spot is: placed letters touching the word, with crossings
// weighted heavily so words spread out instead of stacking up
function crowding(cells: Cell[], letters: string[][]): number {
  const own = new Set(cells.map(cellKey))
  const touching = new Set<string>()
  let crossings = 0
  for (const c of cells) {
    if (letters[c.row][c.col]) crossings++
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const n = { row: c.row + dr, col: c.col + dc }
        const key = cellKey(n)
        if (own.has(key) || !letters[n.row]?.[n.col]) continue
        touching.add(key)
      }
    }
  }
  return crossings * 10 + touching.size
}

// Deterministic placement: same seed + size always produces the same puzzle.
function buildGrid(size: number, words: string[], seed: number): Grid {
  const letters: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  )
  const placements: Placement[] = []
  const rand = mulberry32(seed)
  const sorted = [...words].sort((a, b) => b.length - a.length)
  // Nudges each word toward the less-used direction so the grid mixes
  // across and down instead of striping
  const dirCount: Record<Direction, number> = { right: 0, down: 0 }

  for (const word of sorted) {
    const candidates: { cells: Cell[]; dir: Direction }[] = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        for (const dir of ["right", "down"] as Direction[]) {
          const cells = cellsFor(row, col, dir, word.length)
          if (!cells.every((c) => c.row < size && c.col < size)) continue
          const fits = cells.every((c, i) => {
            const existing = letters[c.row][c.col]
            return !existing || existing === word[i]
          })
          if (fits) candidates.push({ cells, dir })
        }
      }
    }
    // Shuffle first so ties between equally roomy spots break randomly
    let best: (typeof candidates)[number] | undefined
    let bestScore = Infinity
    for (const candidate of shuffle(candidates, rand)) {
      const score =
        crowding(candidate.cells, letters) + dirCount[candidate.dir] * 2
      if (score < bestScore) {
        best = candidate
        bestScore = score
      }
    }
    if (!best) continue
    best.cells.forEach((c, i) => {
      letters[c.row][c.col] = word[i]
    })
    dirCount[best.dir]++
    placements.push({ word, cells: best.cells })
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
    const [from, to] =
      start.col <= end.col ? [start.col, end.col] : [end.col, start.col]
    return Array.from({ length: to - from + 1 }, (_, i) => ({
      row: start.row,
      col: from + i,
    }))
  }
  const [from, to] =
    start.row <= end.row ? [start.row, end.row] : [end.row, start.row]
  return Array.from({ length: to - from + 1 }, (_, i) => ({
    row: from + i,
    col: start.col,
  }))
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
  words,
  seed,
  found,
  onFound,
  onStart,
}: {
  size: number
  words: string[]
  seed: number
  found: Set<string>
  onFound: (word: string) => void
  onStart: () => void
}) {
  const grid = useMemo(() => buildGrid(size, words, seed), [size, words, seed])
  const [dragStart, setDragStart] = useState<Cell | null>(null)
  const [dragEnd, setDragEnd] = useState<Cell | null>(null)
  // Refs mirror the drag so pointerup sees the latest cell even if a fast
  // swipe ends before React re-renders
  const startRef = useRef<Cell | null>(null)
  const endRef = useRef<Cell | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // iOS Safari can still scroll the page mid-drag despite touch-action: none
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const block = (e: TouchEvent) => {
      if (startRef.current) e.preventDefault()
    }
    el.addEventListener("touchmove", block, { passive: false })
    return () => el.removeEventListener("touchmove", block)
  }, [])

  const selectionOf = (start: Cell | null, end: Cell | null) =>
    start && end && sameLine(start, end)
      ? cellsBetween(start, end)
      : start
        ? [start]
        : []

  const selected = selectionOf(dragStart, dragEnd)

  const foundCells = new Set(
    grid.placements
      .filter((p) => found.has(p.word))
      .flatMap((p) => p.cells.map(cellKey))
  )

  const cellAt = (x: number, y: number): Cell | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const target = el?.closest("[data-row]") as HTMLElement | null
    if (!target || !gridRef.current?.contains(target)) return null
    return { row: Number(target.dataset.row), col: Number(target.dataset.col) }
  }

  const finishSelection = (check: boolean) => {
    const final = selectionOf(startRef.current, endRef.current)
    if (check && final.length > 1) {
      const match = grid.placements.find(
        (p) => !found.has(p.word) && matchesWord(final, p)
      )
      if (match) onFound(match.word)
    }
    startRef.current = null
    endRef.current = null
    setDragStart(null)
    setDragEnd(null)
  }

  return (
    <div
      ref={gridRef}
      className="grid gap-1 mx-auto w-full max-w-sm touch-none select-none [-webkit-touch-callout:none]"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      onPointerDown={(e) => {
        const cell = cellAt(e.clientX, e.clientY)
        if (!cell) return
        // Keep receiving moves and the final pointerup even if the finger
        // slides off the grid
        e.currentTarget.setPointerCapture(e.pointerId)
        onStart()
        startRef.current = cell
        endRef.current = cell
        setDragStart(cell)
        setDragEnd(cell)
      }}
      onPointerMove={(e) => {
        if (!startRef.current) return
        const cell = cellAt(e.clientX, e.clientY)
        if (!cell) return
        endRef.current = cell
        setDragEnd(cell)
      }}
      onPointerUp={() => startRef.current && finishSelection(true)}
      onPointerCancel={() => finishSelection(false)}
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
              className={`aspect-square flex items-center justify-center text-sm font-aeonik rounded-md transition-colors ${
                isFound
                  ? "bg-pink text-pink-ink"
                  : isSelected
                    ? "bg-pink text-pink-ink"
                    : "bg-ink text-[#F7F4EE]"
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

function formatTime(ms: number) {
  const seconds = Math.round(ms / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

// ?puzzle=N in the URL is 1-based, so shared links read naturally
function puzzleFromUrl(): number | null {
  const n = Number(new URLSearchParams(window.location.search).get("puzzle"))
  return Number.isInteger(n) && WORD_SETS[n - 1] ? n - 1 : null
}

function save(setIndex: number, found: Set<string>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ set: setIndex, found: [...found] })
    )
  } catch {}
}

export default function WordSearch() {
  const [setIndex, setSetIndex] = useState(0)
  const [found, setFound] = useState<Set<string>>(new Set())
  // The clock starts on the first drag and isn't saved, so a reload restarts
  // it; a round finished without a start (restored from a save) has no time
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const words = WORD_SETS[setIndex]

  useEffect(() => {
    let stored: { set: number; found: string[] } | string[] | null = null
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    } catch {}
    // Older saves were a bare array of found words from the first set
    const savedSet = Array.isArray(stored) ? 0 : stored?.set
    const savedFound = Array.isArray(stored) ? stored : (stored?.found ?? [])
    // A shared link wins over the save, keeping progress only if it's the
    // same puzzle
    const shared = puzzleFromUrl()
    const target = shared ?? savedSet
    if (target === undefined || !WORD_SETS[target]) return
    setSetIndex(target)
    setFound(new Set(target === savedSet ? savedFound : []))
  }, [])

  const allFound = words.every((w) => found.has(w))

  const handleStart = () => {
    if (startedAt === null && !allFound) setStartedAt(Date.now())
  }

  const handleFound = (word: string) => {
    const next = new Set(found)
    next.add(word)
    setFound(next)
    save(setIndex, next)
    if (startedAt !== null && words.every((w) => next.has(w))) {
      setElapsed(Date.now() - startedAt)
    }
  }

  const nextSet = () => {
    const next = (setIndex + 1) % WORD_SETS.length
    setSetIndex(next)
    setFound(new Set())
    setStartedAt(null)
    setElapsed(null)
    setCopied(false)
    save(next, new Set())
  }

  const share = async () => {
    const url = `${window.location.origin}/about/?puzzle=${setIndex + 1}#word-search`
    const text =
      elapsed !== null
        ? `I found all ${words.length} words in ${formatTime(elapsed)} 🔎 Can you beat me?`
        : `I found all ${words.length} words 🔎 Can you find them?`
    if (navigator.share) {
      try {
        await navigator.share({ text, url })
      } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
    } catch {}
  }

  return (
    <div
      id="word-search"
      className="flex flex-col lg:flex-row gap-8 lg:justify-between w-full scroll-mt-6"
    >
      <div className="flex flex-col gap-4 lg:w-1/3 flex-1">
        <p className="font-hand text-lg text-ink-soft">
          The one waiting for you
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl">{words.length} words are hiding in here.</p>
          <button
            type="button"
            onClick={nextSet}
            aria-label="Try a different set of words"
            title="Try a different set of words"
            className="shrink-0 size-9 rounded-full border border-line-strong flex items-center justify-center text-base cursor-pointer transition-transform hover:rotate-180 duration-300"
          >
            🔄
          </button>
        </div>
        <p className="text-sm leading-6 text-ink-muted">
          Press on the first letter of a word and drag across to the last, then
          let go. Words run left to right or top to bottom, and you can drag
          them backwards too. Found words turn pink.
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-4 justify-start text-xs font-aeonik">
          {words.map((word) => (
            <span
              key={word}
              className={
                found.has(word)
                  ? "bg-pink text-pink-ink text-center py-2 px-3.5 rounded-full font-semibold"
                  : "text-ink-soft py-2 px-3.5 border border-line-strong rounded-full"
              }
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:self-start">
        <Puzzle
          key={setIndex}
          size={SIZE}
          words={words}
          seed={SEED + setIndex}
          found={found}
          onFound={handleFound}
          onStart={handleStart}
        />
        {allFound && (
          <div
            role="status"
            className="absolute inset-0 flex items-center justify-center p-4 bg-cream-page/70 backdrop-blur-[2px] rounded-md animate-[fade-in_250ms_ease-out]"
          >
            <div className="bg-pink text-pink-ink rounded-card px-6 py-5 text-center shadow-lg flex flex-col items-center gap-3 animate-[dialog-in_300ms_ease-out]">
              <p className="text-3xl">🎉</p>
              <p className="font-aeonik font-bold text-lg">
                You found them all!
              </p>
              {elapsed !== null && (
                <p className="font-aeonik text-sm -mt-2">
                  in {formatTime(elapsed)}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="rounded-pill bg-ink text-white px-5 py-2 text-sm cursor-pointer transition-colors hover:bg-ink/80"
                >
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  type="button"
                  onClick={nextSet}
                  className="rounded-pill border border-ink px-5 py-2 text-sm cursor-pointer transition-colors hover:bg-ink/10"
                >
                  🔄 Play again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
