import { useMemo, useState } from "react"
import { Theme } from "@radix-ui/themes"
import type { ProjectCardProps } from "../data/project"
import ProjectCard from "./ProjectCard"

type Filter = "all" | "done" | "in progress"

const TABS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "done" },
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
    <Theme data-is-root-theme="false" className="bg-transparent!">
      <section className="flex flex-col gap-6 mt-10 ">
        <section className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-aeonik font-bold leading-10">
              Projects
            </h1>
            <p className="text-black/45 leading-7">
              Here are some of the projects I'm currently working on, and some
              of the projects I've worked on in the past. You can also check out
              my{" "}
              <a
                className="text-blue-500 hover:underline"
                href="https://github.com/missbaah"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub profile
              </a>
            </p>
          </div>

          <div className="flex gap-2 items-end md:justify-end w-full">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`text-xs w-fit font-aeonik px-3.5 py-2 rounded-full border transition-colors ${
                  filter === tab.value
                    ? "bg-primary text-white border-primary"
                    : "border-[#ECECEC] text-gray-light hover:border-[#D9D9D9]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <hr className="w-full text-[#EAEAE9]" />
        <div className="flex flex-col gap-8">
          {showDone && (
            <section className="flex flex-col gap-6">
              <p className="text-xl font-aeonik capitalize font-bold">
                Live{"  "}
                <span className="text-black/45 text-xs font-normal">
                  {String(done.length).padStart(2, "0")}
                </span>
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
                Working on{"  "}
                <span className="text-black/45 text-xs font-normal">
                  {String(wip.length).padStart(2, "0")}
                </span>
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {wip.map((project, i) => (
                  <ProjectCard key={`${project.title}-${i}`} {...project} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </Theme>
  )
}
