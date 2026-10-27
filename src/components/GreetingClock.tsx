import { useEffect, useState } from "react"
import Doodle, { type DoodleName } from "./Doodle"

const greetings: { before: string; label: string; icon: DoodleName }[] = [
  { before: "12:00", label: "Good morning", icon: "sun" },
  { before: "18:00", label: "Good afternoon", icon: "cloud" },
  { before: "24:00", label: "Good evening", icon: "moon" },
]

function getGreeting() {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const { icon, label } = greetings.find((greeting) => time < greeting.before)!
  return { time, icon, label }
}

export default function GreetingClock() {
  // The page is built ahead of time, so reading the clock during render would
  // bake in the build's time and fail hydration; wait for the visitor's clock
  const [greeting, setGreeting] = useState<ReturnType<
    typeof getGreeting
  > | null>(null)

  useEffect(() => {
    setGreeting(getGreeting())
    const id = setInterval(() => setGreeting(getGreeting()), 30_000)
    return () => clearInterval(id)
  }, [])

  // min-h holds the line's height so the heading doesn't jump when it fills in
  return (
    <p className="flex gap-2.5 items-center text-sm min-h-5">
      {greeting && (
        <>
          <Doodle name={greeting.icon} className="text-base" />
          {greeting.label} &#x2022; {greeting.time}
        </>
      )}
    </p>
  )
}
