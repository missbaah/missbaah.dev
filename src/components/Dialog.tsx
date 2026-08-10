import { Dialog } from "@radix-ui/themes"
import type { Dispatch, SetStateAction } from "react"
import type { ProjectCardProps } from "../data/project"

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
      <Dialog.Content className="font-aeonik">
        <Dialog.Title className="hidden">{project.title}</Dialog.Title>
        <section className="flex flex-col gap-6">
          <div className="flex items-center">
            <img src={project.imgsrc} alt={project.title} className="size-12" />
            <h2 className="text-h-sub-text font-aeonik">{project.title}</h2>
          </div>
          <p className="text-sub-text">{project.desc}</p>
          <div className="flex justify-center gap-3 mt-3">
            <a
              href={project.siteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white cursor-pointer bg-black text-center hover:bg-black/60 backdrop-blur-md px-2 py-2 rounded-lg flex-1 transition-all duration-300 hover:ease-in-out"
            >
              Open Project <span className="i-lucide-arrow-up-right"></span>
            </a>
            <div className="flex justify-center gap-3  border-[#ECECEC] border rounded-lg p-2 hover:bg-black/4 transition-all duration-300 hover:ease-in-out">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="i-lucide-github text-xl cursor-pointer"
              ></a>
            </div>
          </div>
        </section>
      </Dialog.Content>
    </Dialog.Root>
  )
}
