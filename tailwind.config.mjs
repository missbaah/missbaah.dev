/** @type {import('tailwindcss').Config} */
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "gray-dark": "#595959",
        dark: "#212223",
        "gray-light": "#737373",
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
