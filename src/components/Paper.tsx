// Shared bits of the paper-and-pen look: tape, stickers, handwritten notes
import type { ProjectCardProps } from "../data/project"
import Doodle from "./Doodle"
import ProjectMark from "./ProjectMark"

// Translucent strip of washi tape; `className` places and angles it
export function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-6 bg-pink/60 shadow-[0_1px_1px_rgb(0_0_0/0.04)] ${className}`}
    />
  )
}

// A round sticker with its bottom-right edge peeling up. The mark is cut
// along the fold line x + y = 160%; the flap is the cut-off cap folded back,
// i.e. the same circle mirrored across that line, clipped to the near side.
// The folded cap always lands on the sticker's face, so the flap's oversized
// box is cropped to the sticker; clip-path alone would still widen the page
export function Sticker({
  title,
  imgsrc,
  className = "absolute -top-5 -right-2 md:-right-4",
}: {
  title: string
  imgsrc?: string
  className?: string
}) {
  return (
    <span
      className={`${className} block size-14 rotate-12 drop-shadow-[0_2px_2px_rgb(0_0_0/0.15)]`}
    >
      <ProjectMark
        title={title}
        imgsrc={imgsrc}
        className="size-full text-xl rounded-full! ring-3 ring-cream-card [clip-path:polygon(0_0,100%_0,100%_60%,60%_100%,0_100%)]"
      />
      <span aria-hidden className="absolute inset-0 overflow-hidden">
        <span className="absolute left-[60%] top-[60%] size-full rounded-full bg-[linear-gradient(315deg,#ffffff_35%,#e6e0d4)] [clip-path:polygon(0_0,40%_0,0_40%)]" />
      </span>
    </span>
  )
}

// A project's status, scribbled in the corner rather than shown as a badge
export function StatusNote({ status }: { status: ProjectCardProps["status"] }) {
  return (
    <p className="font-hand text-lg text-ink-soft -rotate-2 ml-auto">
      {status === "done" ? (
        <>
          shipped <Doodle name="check" />
        </>
      ) : (
        <>
          still building <Doodle name="blocks" />
        </>
      )}
    </p>
  )
}

// Plain text links that get the nav's marker stroke on hover
export function ProjectLinks({
  siteLink,
  githubLink,
}: Pick<ProjectCardProps, "siteLink" | "githubLink">) {
  if (!siteLink && !githubLink) return null
  return (
    <div className="flex gap-5 font-aeonik">
      {siteLink && (
        <a
          href={siteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="marker-sweep whitespace-nowrap"
        >
          Visit <Doodle name="arrow" />
        </a>
      )}
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="marker-sweep whitespace-nowrap"
        >
          Code <Doodle name="arrow" />
        </a>
      )}
    </div>
  )
}

// Cards pinned by hand never sit quite straight. Each gets a small tilt picked
// from its name, so the same card always lands the same way
const TILTS = [
  "rotate-[-0.8deg]",
  "rotate-[0.6deg]",
  "rotate-[-0.4deg]",
  "rotate-[0.9deg]",
]
export function tiltFor(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return TILTS[Math.abs(hash) % TILTS.length]
}

// Base look of a pinned index card; straightens and lifts on hover or focus
export const CARD =
  "relative paper border border-line rounded-sm shadow-sm motion-safe:transition-[rotate,translate,box-shadow] motion-safe:duration-300 motion-safe:hover:rotate-0 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-strong motion-safe:focus-visible:rotate-0"
