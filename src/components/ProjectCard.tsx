import { useState } from "react"
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
      className="group w-full aspect-4/3 border border-[#ECECEC] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:cursor-pointer hover:border-[#D9D9D9] transition-colors duration-200"
    >
      <img
        src={project.imgsrc}
        alt={project.title}
        className="w-10 h-10 rounded-[10px] object-cover transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
      />
      <div>
        <p className="font-bold text-sm mb-1 font-aeonik">{project.title}</p>
        <p className="font-aeonik text-sm text-gray-500 leading-relaxed">
          {project.desc}
        </p>
      </div>
      <Dialog project={project} open={open} onOpenChange={setOpen} />
    </div>
  )
}
