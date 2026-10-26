// A project's icon, or its first letter on a tile when it has none yet
export default function ProjectMark({
  title,
  imgsrc,
  className = "size-10 text-base",
}: {
  title: string
  imgsrc?: string
  className?: string
}) {
  if (imgsrc) {
    return (
      <img src={imgsrc} alt="" className={`${className} rounded-tile object-cover`} />
    )
  }
  return (
    <span
      aria-hidden
      className={`${className} rounded-tile bg-pink text-pink-ink font-aeonik font-bold flex items-center justify-center`}
    >
      {title[0]}
    </span>
  )
}
