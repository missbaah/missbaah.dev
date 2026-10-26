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
  const [greeting, setGreeting] = useState(getGreeting)

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="flex gap-2.5 items-center text-sm">
      <Doodle name={greeting.icon} className="text-base" />
      {greeting.label} &#x2022; {greeting.time}
    </p>
  )
}
