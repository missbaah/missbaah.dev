import { Dialog } from "radix-ui"
import type { Dispatch, SetStateAction } from "react"
import type { ProjectCardProps } from "../data/project"
import Doodle from "./Doodle"
import { ProjectLinks, StatusNote, Sticker, Tape } from "./Paper"

export default function CustomDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  project: ProjectCardProps
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/25 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-50 inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-2xl paper font-aeonik shadow-2xl focus:outline-none data-[state=open]:animate-[sheet-up_300ms_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[sheet-down_200ms_ease-in] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(560px,calc(100vw-32px))] sm:max-h-[90dvh] sm:rounded-sm sm:data-[state=open]:animate-[dialog-in_200ms_ease-out] sm:data-[state=closed]:animate-[dialog-out_150ms_ease-in]"
        >
          <Dialog.Close
            aria-label="Close"
            className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-ink-soft cursor-pointer transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-pink-strong"
          >
            <Doodle name="close" className="text-xl" />
          </Dialog.Close>

          <section className="flex flex-col gap-5 px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
            <Sticker
              title={project.title}
              imgsrc={project.imgsrc}
              className="relative"
            />

            <div className="flex flex-col gap-3">
              <Dialog.Title className="text-3xl font-bold text-ink">
                {project.title}
              </Dialog.Title>
              <p className="text-lg leading-8">
                <span className="marker">{project.desc}</span>
              </p>
            </div>

            {project.screenshot && (
              <div className="relative self-start w-full bg-white p-2 pb-5 shadow-sm rotate-1">
                <Tape className="-top-2.5 -left-4 -rotate-12 w-16" />
                <img
                  src={project.screenshot}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <p className="text-base leading-7 text-ink-muted">
              {project.about}
            </p>

            <div className="flex items-end justify-between gap-4 flex-wrap">
              <ProjectLinks
                siteLink={project.siteLink}
                githubLink={project.githubLink}
              />
              <StatusNote status={project.status} />
            </div>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
