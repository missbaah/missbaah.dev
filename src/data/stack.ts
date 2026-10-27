// The one list of what I build with, shown on About. The word search's stack
// rounds in WordSearch.tsx spell these out grid-style (NEXTJS, THREEJS), so
// update them together
export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: "Frontend",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Astro",
      "Tailwind CSS",
      "Zustand",
      "Three.js",
      "Storybook",
    ],
  },
  {
    label: "Backend",
    items: ["Node", "Express", "Hono", "PostgreSQL", "MongoDB"],
  },
]
