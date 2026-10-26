import type { SkillCardProps } from "../data/skill"

export default function SkillCard(skill: SkillCardProps) {
  return (
    <a
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full aspect-4/3 border border-[#ECECEC] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#D9D9D9] hover:shadow-lg focus-visible:outline-none focus-visible:-translate-y-1 focus-visible:border-[#D9D9D9] focus-visible:shadow-lg"
    >
      <span className="i-lucide-arrow-up-right self-end text-ink-soft transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

      <div className="flex flex-col gap-2 border-t border-[#ECECEC] pt-3">
        <p className="font-bold text-sm font-mono mb-1">{skill.name}</p>
        <p className="font-aeonik text-sm text-gray-500 leading-relaxed">
          {skill.desc}
        </p>
        <p className="font-aeonik text-xs text-ink-soft">
          Rewritten after real-world use.
        </p>
      </div>
    </a>
  )
}
