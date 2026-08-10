import { useState, type SetStateAction } from "react"
import Dialog from "./Dialog"

interface Props {
  title: string
  description: string
  imgsrc: string
}

export default function ProjectCard({ title, description, imgsrc }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      role="button"
      aria-label={title}
      onClick={() => setOpen(true)}
      className="group w-full max-w-full lg:max-w-[48%] aspect-18/8 border border-[#ECECEC] rounded-2xl flex items-center justify-center relative hover:bg-black/4 hover:cursor-pointer transition-all duration-300 hover:ease-in-out hover:opacity-40"
    >
      <div className="absolute top-3 right-3 opacity-0 text-secondary text-sm group-hover:opacity-100">
        <p className="font-bold">{title}</p>
      </div>
      <div className="absolute bottom-3 opacity-0 text-secondary text-sm group-hover:opacity-100">
        <p>{description}</p>
      </div>
      <img src={imgsrc} alt={title} className="object-cover" />
      <Dialog title={title} open={open} onOpenChange={setOpen} />
    </div>
  )
}
