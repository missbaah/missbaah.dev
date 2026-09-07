/** @type {import('tailwindcss').Config} */
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "cream-page": "#f7f4ee",
        "cream-card": "#fdfbf7",
        "cream-sunken": "#f1ece1",
        ink: "#1f1e1a",
        "ink-muted": "#5c574e",
        "ink-soft": "#6f6a5f",
        line: "#e3ded3",
        "line-soft": "#ece7dc",
        "line-strong": "#ded8cb",
        separator: "#cfc8ba",
        pink: "#efc7ce",
        "pink-strong": "#dc93a1",
        "pink-ink": "#43222a",
        "pink-link": "#a3324f",
        "pink-link-hover": "#7f2440",
        "status-done": "#3f9153",
        "status-wip": "#b06f00",
      },
      backgroundColor: {
        cream: "#f7f4ee",
      },
      borderRadius: {
        card: "12px",
        tile: "9px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        aeonik: ["var(--font-aeonik-pro)", "sans-serif"],
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide", "ph"]),
    }),
  ],
}
