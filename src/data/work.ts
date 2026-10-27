// Newest first; years only, a portfolio doesn't need months
export interface Job {
  company: string
  title: string
  dates: string
  mode: "On-site" | "Remote" | "Hybrid"
}

export const work: Job[] = [
  {
    company: "Dexwin Tech",
    title: "Software Engineer",
    dates: "2026 – now",
    mode: "Hybrid",
  },
  {
    company: "AMAKA Studio",
    title: "Frontend Developer",
    dates: "2024 – 2026",
    mode: "Remote",
  },
  {
    company: "Wahu",
    title: "Frontend Developer",
    dates: "2023 – 2024",
    mode: "Hybrid",
  },
  {
    company: "Blue Torus",
    title: "Creative Frontend Dev",
    dates: "2023",
    mode: "Hybrid",
  },
]
