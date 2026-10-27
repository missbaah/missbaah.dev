import { useEffect, useMemo, useRef, useState } from "react"
import Doodle from "./Doodle"
import { Tape } from "./Paper"

// One set per round; the "again" button cycles through them. Three rounds hide
// my stack, the last my hobbies. The longest word sets the grid size, so keep
// words to 9 letters or fewer.
const WORD_SETS = [
  ["REACT", "NEXTJS", "ASTRO", "ZUSTAND", "THREEJS"],
  ["NODE", "EXPRESS", "HONO", "POSTGRES", "MONGODB"],
  ["TAILWIND", "STORYBOOK", "GIT", "CSS", "DEPLOY"],
  ["PUZZLES", "BOOKS", "MUSIC", "TEA", "GYM", "WALKS"],
]
const STORAGE_KEY = "missbaah-word-search-found"
const SOUND_KEY = "missbaah-word-search-sound"
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

// Created on the first find, which always follows a pointerup, so browsers
// that need a user gesture before playing audio allow it
let audio: AudioContext | null = null

// A short rising blip, synthesised so there's no sound file to load
function playPop() {
  try {
    audio ??= new AudioContext()
    const now = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    osc.connect(gain).connect(audio.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch {}
}

// A marker loop drawn around a straight run of cells, sized as a share of
// the grid so it needs no measuring. `tilt` keeps loops from looking stamped
function Loop({
  cells,
  size,
  className,
}: {
  cells: Cell[]
  size: number
  className: string
}) {
  const rows = cells.map((c) => c.row)
  const cols = cells.map((c) => c.col)
  const top = Math.min(...rows)
  const left = Math.min(...cols)
  const height = Math.max(...rows) - top + 1
  const width = Math.max(...cols) - left + 1
  const tilt = (top * 7 + left * 3) % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"
  const at = (n: number) => `calc(${(n / size) * 100}% + 3px)`
  const span = (n: number) => `calc(${(n / size) * 100}% - 6px)`
  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none rounded-full ${height > 1 ? "" : tilt} ${className}`}
      style={{
        top: at(top),
        left: at(left),
        width: span(width),
        height: span(height),
      }}
    />
  )
}

function Puzzle({
  size,
  words,
  seed,
  found,
  justFound,
  onFound,
  onStart,
}: {
  size: number
  words: string[]
  seed: number
  found: Set<string>
  justFound: string | null
  onFound: (word: string) => void
  onStart: () => void
}) {
  const grid = useMemo(() => buildGrid(size, words, seed), [size, words, seed])
  const [dragStart, setDragStart] = useState<Cell | null>(null)
  const [dragEnd, setDragEnd] = useState<Cell | null>(null)
  // A swipe that matched no word stays lit just long enough to shake
  const [missed, setMissed] = useState<Cell[]>([])
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

  const foundPlacements = grid.placements.filter((p) => found.has(p.word))
  const foundCells = new Set(
    foundPlacements.flatMap((p) => p.cells.map(cellKey))
  )
  // Position of each cell within the word just found, to stagger its bounce
  const popOrder = new Map(
    grid.placements
      .find((p) => p.word === justFound)
      ?.cells.map((c, i) => [cellKey(c), i])
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
      // Re-swiping a word already found is neither a find nor a miss
      const match = grid.placements.find((p) => matchesWord(final, p))
      if (!match) {
        setMissed(final)
        setTimeout(() => setMissed([]), 250)
      } else if (!found.has(match.word)) {
        onFound(match.word)
      }
    }
    startRef.current = null
    endRef.current = null
    setDragStart(null)
    setDragEnd(null)
  }

  return (
    // Printed puzzle on a paper card: plain letters on faint rules, and words
    // get circled in marker as they're found
    <div className="paper border border-line rounded-sm shadow-sm p-3 mx-auto w-full max-w-sm">
      <div
        ref={gridRef}
        className="relative grid border-r border-b border-line-soft touch-none select-none [-webkit-touch-callout:none]"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          // Rules live in the background so the loops sit on top of them
          backgroundImage:
            "linear-gradient(to right, var(--line-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--line-soft) 1px, transparent 1px)",
          backgroundSize: `${100 / size}% ${100 / size}%`,
        }}
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
        {foundPlacements.map((p) => (
          <Loop
            key={p.word}
            cells={p.cells}
            size={size}
            className={`border-2 border-pink-strong bg-pink/30 ${
              p.word === justFound
                ? "motion-safe:animate-[loop-in_300ms_ease-out]"
                : ""
            }`}
          />
        ))}
        {selected.length > 0 && (
          <Loop cells={selected} size={size} className="bg-pink/60" />
        )}
        {missed.length > 0 && (
          <Loop
            cells={missed}
            size={size}
            className="bg-pink/60 motion-safe:animate-[shake_200ms_ease-in-out]"
          />
        )}
        {grid.letters.map((row, r) =>
          row.map((letter, c) => {
            const key = cellKey({ row: r, col: c })
            const isSelected = selected.some((s) => cellKey(s) === key)
            const isFound = foundCells.has(key)
            const pop = popOrder.get(key)
            return (
              <div
                key={key}
                data-row={r}
                data-col={c}
                style={
                  pop !== undefined
                    ? { animationDelay: `${pop * 45}ms` }
                    : undefined
                }
                className={`relative aspect-square flex items-center justify-center font-aeonik text-base ${
                  isSelected || isFound ? "text-pink-ink" : "text-ink"
                } ${pop !== undefined ? "motion-safe:animate-[cell-pop_350ms_ease-out_both]" : ""}`}
              >
                <span
                  className={`transition-[scale] duration-150 ${
                    isSelected ? "font-bold motion-safe:scale-125" : ""
                  }`}
                >
                  {letter}
                </span>
              </div>
            )
          })
        )}
      </div>
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
  // The latest find, so its chip and cells can pop once
  const [justFound, setJustFound] = useState<string | null>(null)
  const [soundOn, setSoundOn] = useState(true)
  const words = WORD_SETS[setIndex]

  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === "off") setSoundOn(false)
    } catch {}
  }, [])

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off")
    } catch {}
  }

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
    // Saves from before the word sets changed can hold words no longer in play
    const inPlay = (w: string) => WORD_SETS[target].includes(w)
    setFound(new Set(target === savedSet ? savedFound.filter(inPlay) : []))
  }, [])

  const allFound = words.every((w) => found.has(w))

  const handleStart = () => {
    if (startedAt === null && !allFound) setStartedAt(Date.now())
  }

  const handleFound = (word: string) => {
    const next = new Set(found)
    next.add(word)
    setFound(next)
    setJustFound(word)
    save(setIndex, next)
    if (soundOn) playPop()
    navigator.vibrate?.(15)
    if (startedAt !== null && words.every((w) => next.has(w))) {
      setElapsed(Date.now() - startedAt)
    }
  }

  const nextSet = () => {
    const next = (setIndex + 1) % WORD_SETS.length
    setSetIndex(next)
    setFound(new Set())
    setJustFound(null)
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
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundOn ? "Mute sound" : "Turn sound on"}
              aria-pressed={!soundOn}
              title={soundOn ? "Mute sound" : "Turn sound on"}
              className="size-9 rounded-full flex items-center justify-center text-lg cursor-pointer hover:bg-cream-sunken"
            >
              <Doodle name={soundOn ? "speaker" : "mute"} />
            </button>
            <button
              type="button"
              onClick={nextSet}
              aria-label="Try a different set of words"
              title="Try a different set of words"
              className="size-9 rounded-full flex items-center justify-center text-lg cursor-pointer hover:bg-cream-sunken transition-transform hover:rotate-180 duration-300"
            >
              <Doodle name="again" />
            </button>
          </div>
        </div>
        <p className="text-sm leading-6 text-ink-muted">
          Press on the first letter of a word and drag across to the last, then
          let go. Words run left to right or top to bottom, and you can drag
          them backwards too. Found words get circled and crossed off.
        </p>
        {/* Found words get crossed off in pink pen, like a paper puzzle */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-aeonik tracking-wide">
          {words.map((word) => (
            <span
              key={word}
              className={`${
                found.has(word)
                  ? "text-ink-soft line-through decoration-pink-strong decoration-2"
                  : "text-ink"
              } ${word === justFound ? "motion-safe:animate-[chip-pop_300ms_ease-out]" : ""}`}
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
          justFound={justFound}
          onFound={handleFound}
          onStart={handleStart}
        />
        {allFound && (
          <div
            role="status"
            className="absolute inset-0 flex items-center justify-center p-4 bg-cream-page/70 backdrop-blur-[2px] rounded-sm animate-[fade-in_250ms_ease-out]"
          >
            <div className="relative paper border border-line rounded-sm px-7 py-6 text-center shadow-md rotate-[-1.5deg] flex flex-col items-center gap-3 animate-[dialog-in_300ms_ease-out]">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3 w-20" />
              <Doodle name="party" className="text-4xl text-pink-strong" />
              <p className="font-aeonik font-bold text-lg">
                You found them all!
              </p>
              {elapsed !== null && (
                <p className="font-aeonik text-sm -mt-2">
                  in {formatTime(elapsed)}
                </p>
              )}
              <div className="flex gap-6 font-hand text-xl">
                <button
                  type="button"
                  onClick={share}
                  className="marker-sweep cursor-pointer"
                >
                  {copied ? (
                    "copied!"
                  ) : (
                    <>
                      share it <Doodle name="arrow" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={nextSet}
                  className="marker-sweep cursor-pointer"
                >
                  play again <Doodle name="again" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
