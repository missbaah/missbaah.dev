import { Dialog } from "radix-ui"
import type { Dispatch, SetStateAction } from "react"
import type { ProjectCardProps } from "../data/project"
import ProjectMark from "./ProjectMark"

export default function CustomDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  project: ProjectCardProps
}) {
  const primaryLink = project.siteLink ?? project.githubLink
  const primaryLabel = project.siteLink ? "Open Project" : "View on Github"
  // Github only gets the secondary text link when it isn't already the primary button
  const secondaryLink = project.siteLink ? project.githubLink : undefined

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/25 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-50 inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-cream-card font-aeonik shadow-2xl focus:outline-none data-[state=open]:animate-[sheet-up_300ms_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[sheet-down_200ms_ease-in] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(560px,calc(100vw-32px))] sm:max-h-[90dvh] sm:rounded-[28px] sm:data-[state=open]:animate-[dialog-in_200ms_ease-out] sm:data-[state=closed]:animate-[dialog-out_150ms_ease-in]"
        >
          <div className="relative w-full aspect-video bg-cream-sunken flex items-center justify-center overflow-hidden">
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ProjectMark
                title={project.title}
                imgsrc={project.imgsrc}
                className="size-14 text-2xl"
              />
            )}
            <Dialog.Close
              aria-label="Close"
              className="absolute top-3.5 right-3.5 size-8 rounded-full bg-cream-card shadow-sm flex items-center justify-center text-ink cursor-pointer transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-pink-strong"
            >
              <span className="i-lucide-x text-base" />
            </Dialog.Close>
          </div>

          <section className="flex flex-col px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-7 sm:pb-8">
            <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
              <span
                className={`size-1.5 rounded-full ${
                  project.status === "done" ? "bg-status-done" : "bg-status-wip"
                }`}
              />
              {project.status === "done" ? "Done" : "In Progress"}
            </span>

            <Dialog.Title className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {project.title}
            </Dialog.Title>
            <p className="mt-2 text-ink-soft leading-snug">{project.desc}</p>

            <div className="mt-6 rounded-2xl bg-cream-sunken px-5 py-5 sm:px-6">
              <p className="text-sm text-ink-soft">About</p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">
                {project.about}
              </p>
            </div>

            {primaryLink && (
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <a
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-pill bg-ink px-7 py-3 text-white transition-colors hover:bg-ink/80"
                >
                  {primaryLabel}
                  <span className="i-lucide-arrow-up-right text-sm" />
                </a>
                {secondaryLink && (
                  <a
                    href={secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-pink-link border-b border-pink-strong pb-0.5 transition-colors hover:text-pink-link-hover"
                  >
                    Github
                    <span className="i-lucide-arrow-up-right text-sm" />
                  </a>
                )}
              </div>
            )}
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
