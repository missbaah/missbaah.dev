import type { ProjectCardProps } from "../data/project"
import { CARD, ProjectLinks, StatusNote, Sticker, Tape } from "./Paper"

// The homepage spotlight, styled as an index card taped to the page
export default function FeaturedProject(project: ProjectCardProps) {
  return (
    <div
      className={`${CARD} mt-3 w-full p-6 md:p-8 flex flex-col gap-5 rotate-[-0.5deg] md:rotate-[-0.8deg]`}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2 w-24" />

      <Sticker title={project.title} imgsrc={project.imgsrc} />

      <div className="flex flex-col gap-3 pr-8">
        <h3 className="font-aeonik font-bold text-3xl md:text-4xl">
          {project.title}
        </h3>
        <p className="font-aeonik text-lg md:text-xl leading-8">
          <span className="marker">{project.desc}</span>
        </p>
      </div>

      {project.screenshot && (
        <div className="relative self-start w-full max-w-md bg-white p-2 pb-5 shadow-sm rotate-1">
          <Tape className="-top-2.5 -left-4 -rotate-12 w-16" />
          <img
            src={project.screenshot}
            alt={project.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      <p className="font-aeonik text-base text-ink-muted leading-7 max-w-prose">
        {project.about}
      </p>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <ProjectLinks
          siteLink={project.siteLink}
          githubLink={project.githubLink}
        />
        <StatusNote status={project.status} />
      </div>
    </div>
  )
}
