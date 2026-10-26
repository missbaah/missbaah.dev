import { useMemo, useState } from "react"
import { Theme } from "@radix-ui/themes"
import type { ProjectCardProps } from "../data/project"
import type { SkillCardProps } from "../data/skill"
import ProjectCard from "./ProjectCard"
import SkillCard from "./SkillCard"

type Filter = "all" | "done" | "in progress" | "skills"

const TABS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "done" },
  { label: "In progress", value: "in progress" },
  { label: "Claude skills", value: "skills" },
]

export default function ProjectsBoard({
  projects,
  skills,
}: {
  projects: ProjectCardProps[]
  skills: SkillCardProps[]
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

  // empty groups are hidden, along with their filter tab
  const showDone = done.length > 0 && (filter === "all" || filter === "done")
  const showWip =
    wip.length > 0 && (filter === "all" || filter === "in progress")
  const showSkills =
    skills.length > 0 && (filter === "all" || filter === "skills")
  const groupSizes: Record<Filter, number> = {
    all: 1,
    done: done.length,
    "in progress": wip.length,
    skills: skills.length,
  }
  const tabs = TABS.filter((tab) => groupSizes[tab.value] > 0)

  return (
    <Theme data-is-root-theme="false" className="bg-transparent!">
      <section className="flex flex-col gap-6 mt-10 ">
        <section className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-aeonik font-bold leading-10">
              Projects
            </h1>
            <p className="text-ink-soft leading-7">
              You met me at a very WIP project section. Fret not! Live projects
              soon. You can also check out my{" "}
              <a
                className="text-pink-link hover:text-pink-link-hover transition-colors"
                href="https://github.com/missbaah"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub profile
              </a>
            </p>
          </div>

          <div className="flex gap-5 items-end md:justify-end w-full font-aeonik text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                aria-pressed={filter === tab.value}
                className={`w-fit cursor-pointer ${
                  filter === tab.value ? "marker font-bold" : "marker-sweep"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <hr className="w-full text-line" />
        <div className="flex flex-col gap-8">
          {showDone && (
            <section className="flex flex-col gap-6">
              <p className="text-xl font-aeonik font-bold">
                Live{"  "}
                <span className="font-hand text-ink-soft text-lg font-normal">
                  ({done.length})
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
              <p className="text-xl font-aeonik font-bold">
                Working on{"  "}
                <span className="font-hand text-ink-soft text-lg font-normal">
                  ({wip.length})
                </span>
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {wip.map((project, i) => (
                  <ProjectCard key={`${project.title}-${i}`} {...project} />
                ))}
              </div>
            </section>
          )}

          {showSkills && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-aeonik font-bold">
                  Claude skills{"  "}
                  <span className="font-hand text-ink-soft text-lg font-normal">
                    ({skills.length})
                  </span>
                </p>
                <p className="text-sm text-ink-soft">
                  Workflows I've built for Claude Code, each rewritten after
                  real-world use.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <SkillCard key={skill.name} {...skill} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </Theme>
  )
}
