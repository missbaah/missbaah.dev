import type { ProjectCardProps } from "../data/project"
import ProjectCard from "./ProjectCard"
import { Theme } from "@radix-ui/themes"

export default function ProjectGrid({
  projects,
}: {
  projects: ProjectCardProps[]
}) {
  return (
    <Theme data-is-root-theme="false">
      <div className="grid md:grid-cols-3 gap-6 justify-center md:justify-start">
        {projects.length > 0 ? (
          projects.map((project, index) => {
            return (
              <ProjectCard key={`${project.title}-${index}`} {...project} />
            )
          })
        ) : (
          <code> // No featured projects yet</code>
        )}
      </div>
    </Theme>
  )
}
