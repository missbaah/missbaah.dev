import { useState } from "react"
import Dialog from "./Dialog"
import { CARD, StatusNote, Sticker, tiltFor } from "./Paper"
import type { ProjectCardProps } from "../data/project"

export default function ProjectCard(project: ProjectCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={project.title}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true)
        }}
        className={`${CARD} ${tiltFor(project.title)} mt-3 w-full p-5 flex flex-col gap-3 cursor-pointer`}
      >
        <Sticker title={project.title} imgsrc={project.imgsrc} />

        <p className="font-aeonik font-bold text-xl pr-10">{project.title}</p>
        <p className="font-aeonik text-sm text-ink-muted leading-6">
          {project.desc}
        </p>
        <StatusNote status={project.status} />
      </div>
      <Dialog project={project} open={open} onOpenChange={setOpen} />
    </>
  )
}
