/** @type {import('tailwindcss').Config} */
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
    colors: {
      "text-secondary": "#595959",
    },
    fontFamily: {
      sans: ["var(--font-inter)", "sans-serif"],
      aeonik: ["var(--font-aeonik-pro)", "sans-serif"],
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide", "ph"]),
    }),
  ],
}
