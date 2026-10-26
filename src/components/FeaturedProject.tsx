import type { ProjectCardProps } from "../data/project"

export default function FeaturedProject(project: ProjectCardProps) {
  return (
    <div className="w-full border border-line rounded-card bg-cream-card p-5 flex flex-col gap-6">
      <img
        src={project.imgsrc}
        alt=""
        className="w-10 h-10 rounded-tile object-cover"
      />

      <div className="w-full aspect-16/9 md:aspect-21/9 rounded-tile bg-cream-sunken border border-line-soft overflow-hidden flex items-center justify-center">
        {project.screenshot ? (
          <img
            src={project.screenshot}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-ink-soft uppercase tracking-wide font-aeonik">
            Image goes here
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-line-soft pt-5">
        <div className="flex flex-col gap-2 md:w-1/3 shrink-0">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-sm font-aeonik">{project.title}</p>
            <span className="inline-flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  project.status === "done" ? "bg-status-done" : "bg-status-wip"
                }`}
              />
              <span className="text-xs text-ink-soft font-aeonik">
                {project.status === "done" ? "Done" : "In Progress"}
              </span>
            </span>
          </div>
          <p className="font-aeonik text-sm text-ink-soft leading-relaxed">
            {project.desc}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:w-2/3">
          <p className="font-aeonik text-sm text-ink-muted leading-relaxed">
            {project.about}
          </p>
          {(project.siteLink || project.githubLink) && (
            <div className="flex gap-3">
              {project.siteLink && (
                <a
                  href={project.siteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white bg-ink rounded-pill px-4 py-2 hover:bg-ink/80 transition-colors"
                >
                  Open Project <span className="i-lucide-arrow-up-right" />
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm border border-line-strong rounded-pill px-4 py-2 hover:bg-cream-sunken transition-colors"
                >
                  <span className="i-lucide-github" /> Github
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
