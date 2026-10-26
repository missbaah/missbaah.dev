export interface ProjectCardProps {
  title: string
  desc: string
  imgsrc: string
  screenshot?: string
  about: string
  featured: boolean
  status: "done" | "in progress"
  githubLink?: string
  siteLink?: string
}

export const projects: ProjectCardProps[] = [
  {
    title: "MindConnect",
    desc: "Find a therapist in Ghana without having to ask around.",
    imgsrc: "/image1.png",
    featured: true,
    status: "in progress",
    about:
      "In Ghana, finding a therapist usually means asking someone who's been to one. MindConnect makes that easier and more discreet. Every practitioner listed is verified against the Ghana Psychology Council's yearly gazette, so you can trust who you're contacting without having to ask around. Next up: practitioners adding their own locations and work numbers.",
  },
]
