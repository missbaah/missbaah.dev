import { useState, type SetStateAction } from "react"
import Dialog from "./Dialog"
import type { ProjectCardProps } from "../data/project"

export default function ProjectCard(project: ProjectCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={project.title}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen(true)
      }}
      className="group w-full max-w-full lg:max-w-[48%] aspect-18/8 border border-[#ECECEC] rounded-2xl flex items-center justify-center relative overflow-hidden hover:cursor-pointer"
    >
      <img
        src={project.imgsrc}
        alt={project.title}
        className="object-cover transition-transform duration-300 ease-out group-hover:-translate-y-2"
      />
      <div className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-3 bg-linear-to-t from-white via-white/90 to-transparent opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
        <p className="font-bold text-sm">{project.title}</p>
        <p className="text-sm text-[#595959]">{project.desc}</p>
      </div>
      <Dialog project={project} open={open} onOpenChange={setOpen} />
    </div>
  )
}
