// Claude skills are not projects: no status, never featured — see CONTEXT.md "Claude skill"
export interface SkillCardProps {
  name: string
  desc: string
  // What changed once I'd used it for real
  afterUse?: string
  link: string
}

const REPO = "https://github.com/missbaah/claudeskills/tree/main"

export const skills: SkillCardProps[] = [
  {
    name: "learning-log",
    desc: "Logs something you just learned into your notes, then asks Socratic questions to check you really understand it.",
    afterUse:
      "It started as a plain log; after using it I added the questioning, because writing something down didn't mean I understood it.",
    link: `${REPO}/learning-log`,
  },
  {
    name: "engineering-diary",
    desc: "Turns a messy end-of-day dump into a structured diary entry, carrying open to-dos forward until they're done.",
    afterUse:
      "After real use I added carry-forward to-dos and reminders, so open items stop disappearing between days.",
    link: `${REPO}/engineering-diary`,
  },
  {
    name: "engineering-diary-review",
    desc: "Reads your diary and writes a weekly review, a performance self-assessment, or resume bullets, without inventing metrics.",
    link: `${REPO}/engineering-diary-review`,
  },
]
