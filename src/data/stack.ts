// The one list of what I build with; About and the word search read from it
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
