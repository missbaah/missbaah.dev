import { useMemo, useState } from "react"
import { Theme } from "@radix-ui/themes"
import type { ProjectCardProps } from "../data/project"
import ProjectCard from "./ProjectCard"

type Filter = "all" | "done" | "in progress"

const TABS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Shipped", value: "done" },
  { label: "In progress", value: "in progress" },
]

export default function ProjectsBoard({
  projects,
}: {
  projects: ProjectCardProps[]
}) {
  const [filter, setFilter] = useState<Filter>("all")

  const done = useMemo(
    () => projects.filter((project) => project.status === "done"),
    [projects]
  )
  const wip = useMemo(
    () => projects.filter((project) => project.status === "in progress"),
    [projects]
  )

  const showDone = filter === "all" || filter === "done"
  const showWip = filter === "all" || filter === "in progress"

  return (
    <Theme data-is-root-theme="false">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`text-sm font-aeonik px-3 py-1.5 rounded-full border transition-colors ${
                filter === tab.value
                  ? "bg-primary text-white border-primary"
                  : "border-[#ECECEC] text-gray-light hover:border-[#D9D9D9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {showDone && (
          <section className="flex flex-col gap-6">
            <p className="text-xl font-aeonik capitalize font-bold">
              Shipped <span className="text-gray-light">{done.length}</span>
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {done.map((project, i) => (
                <ProjectCard key={`${project.title}-${i}`} {...project} />
              ))}
            </div>
          </section>
        )}

        {showWip && (
          <section className="flex flex-col gap-6">
            <p className="text-xl font-aeonik capitalize font-bold">
              Still in progress{" "}
              <span className="text-gray-light">{wip.length}</span>
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {wip.map((project, i) => (
                <ProjectCard key={`${project.title}-${i}`} {...project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Theme>
  )
}
