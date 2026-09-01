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
      className="group w-full aspect-4/3 border border-[#ECECEC] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:cursor-pointer hover:-translate-y-1 hover:border-[#D9D9D9] hover:shadow-lg focus-visible:outline-none focus-visible:-translate-y-1 focus-visible:border-[#D9D9D9] focus-visible:shadow-lg"
    >
      <img
        src={project.imgsrc}
        alt={project.title}
        className="w-10 h-10 rounded-[10px] object-cover transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-focus-visible:-translate-y-0.5 group-focus-visible:scale-110"
      />
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <p className="font-bold text-sm font-aeonik">{project.title}</p>
          <span className="inline-flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.status === "done" ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <span className="text-xs text-gray-500 font-aeonik">
              {project.status === "done" ? "Done" : "In Progress"}
            </span>
          </span>
        </div>
        <p className="font-aeonik text-sm text-gray-500 leading-relaxed">
          {project.desc}
        </p>
      </div>
      <Dialog project={project} open={open} onOpenChange={setOpen} />
    </div>
  )
}
