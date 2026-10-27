import type { SkillCardProps } from "../data/skill"
import Doodle from "./Doodle"
import { CARD, tiltFor } from "./Paper"

export default function SkillCard(skill: SkillCardProps) {
  return (
    <a
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${CARD} ${tiltFor(skill.name)} group w-full p-5 flex flex-col gap-3`}
    >
      <p className="font-bold text-sm font-mono">{skill.name}</p>
      <p className="font-aeonik text-sm text-ink-muted leading-6">
        {skill.desc}
      </p>
      {skill.afterUse && (
        <p className="font-aeonik text-sm text-ink-soft leading-6">
          {skill.afterUse}
        </p>
      )}
      <p className="font-hand text-lg text-ink-soft -rotate-2 ml-auto mt-auto">
        <span className="marker-sweep whitespace-nowrap">
          read the source <Doodle name="arrow" />
        </span>
      </p>
    </a>
  )
}
