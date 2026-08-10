import ProjectCard from "./ProjectCard"
import { Theme } from "@radix-ui/themes"

export default function ProjectGrid({
  projects,
}: {
  projects: { title: string; description: string; imgsrc: string }[]
}) {
  return (
    <Theme data-is-root-theme="false">
      <div className="flex gap-3 flex-wrap justify-center md:justify-start">
        {projects.length > 0 ? (
          projects.map((project, index) => {
            return (
              <ProjectCard
                key={`${project.title}-${index}`}
                title={project.title}
                description={project.description}
                imgsrc={project.imgsrc}
              />
            )
          })
        ) : (
          <code> // No featured projects yet</code>
        )}
      </div>
    </Theme>
  )
}
