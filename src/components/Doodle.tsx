// Hand-drawn icons: loose pen strokes in the current text colour, sized to
// the surrounding text. Lines are deliberately a little off-straight
const PATHS = {
  // A wobbly arrow up and to the right, for links that leave the page
  arrow: [
    "M5 19.2c3.8-3.9 8.1-8.6 13.4-13.6",
    "M10.8 5.4c2.6-.2 5.2-.1 7.9 0 .1 2.4 0 4.9-.3 7.5",
  ],
  // Loop that comes back round, for "again" and "another set"
  again: [
    "M19.2 12.6c-.1 4-3.4 7.1-7.4 7-4-.1-7.2-3.4-7.1-7.5.1-4.1 3.5-7.3 7.5-7.1 2.4.1 4.3 1.2 5.6 3",
    "M18.4 3.6c.1 1.6 0 3.2-.3 4.9-1.5 0-3-.2-4.6-.5",
  ],
  speaker: [
    "M3.6 9.4 7.2 9.2l4.9-4.1-.3 13.9-4.8-4-3.4-.2c-.2-1.8-.2-3.6 0-5.4Z",
    "M15 9c1.5 1.6 1.6 4.4 0 6",
    "M17.8 6.4c3 3.1 3 8.1 0 11.2",
  ],
  mute: [
    "M3.6 9.4 7.2 9.2l4.9-4.1-.3 13.9-4.8-4-3.4-.2c-.2-1.8-.2-3.6 0-5.4Z",
    "M15.4 9.4c1.8 1.6 3.4 3.4 5 5.2",
    "M20.3 9.2c-1.6 1.9-3.2 3.7-4.9 5.5",
  ],
  // Three toy blocks, two down and one balanced on top
  blocks: [
    "M3.4 20.6 3.7 13.3l7-.2.2 7.3-7.5.2Z",
    "M12.1 20.5l.2-7.3 7.3.2-.2 7.2-7.3-.1Z",
    "M7.4 12.7 8.5 6l6.8 1-1.1 6.7",
    "M10.6 8.6l2.6.4",
  ],
  check: ["M4 12.6c1.9 1.6 3.5 3.6 5 6 2.6-6.4 6.3-11 11.5-14.2"],
  close: ["M6.2 6.1c4 3.8 7.9 7.8 11.7 11.9", "M17.7 6c-3.9 3.9-7.7 7.9-11.5 12"],
  party: [
    "M4 20.2 8.6 8.4l7 7.1L4 20.2Z",
    "M6.3 14.3l3.4 3.3",
    "M12.6 3.8l.8 2.1",
    "M17.6 6.2c.8-.5 1.6-.8 2.5-.9",
    "M18.4 11.6l2.3.6",
    "M14.6 9.2c.4-1.4 1.4-2.4 2.8-2.9",
    "M15.4 2.8h.01M21 8.8h.01M11 4.6h.01",
  ],
  sun: [
    "M12 8.2c2.2-.1 3.9 1.6 3.9 3.8 0 2.2-1.7 3.9-3.9 3.9-2.2 0-3.9-1.8-3.8-3.9 0-2.1 1.7-3.8 3.8-3.8Z",
    "M12 2.8v2.4M12 18.9v2.3M2.9 12h2.3M18.8 12h2.4M5.6 5.5l1.6 1.7M16.9 16.8l1.6 1.6M5.5 18.4l1.7-1.6M16.8 7.1l1.7-1.6",
  ],
  cloud: [
    "M6.8 18.4c-2.7 0-3.6-3.6-1-4.6-.2-2.9 3.5-3.9 4.8-1.9.9-3.2 6-3 6.3.6 2.9-.3 3.9 3.8 1.3 5.4-3.8.7-7.6.7-11.4.5Z",
    "M14.4 6.2c.6-1.6 2.2-2.6 3.9-2.3 1.9.3 3.2 2.1 2.9 4-.1.8-.5 1.5-1 2",
  ],
  moon: [
    "M15.8 4.2c-4.4.3-7.6 4-7.3 8.4.3 4.3 4 7.5 8.3 7.2 1.5-.1 2.9-.6 4-1.4-4.1-.4-7.1-4-6.8-8.1.2-2.6 1.6-4.8 3.8-6.1h-2Z",
    "M5.2 5.6l.6 1.8M4.6 7.3l1.8-.6",
  ],
} as const

export type DoodleName = keyof typeof PATHS

export default function Doodle({
  name,
  className = "",
}: {
  name: DoodleName
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block size-[1.1em] align-[-0.18em] shrink-0 ${className}`}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
