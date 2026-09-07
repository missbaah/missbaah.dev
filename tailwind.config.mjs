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
        light: "#EAEAE9",
        primary: "#141412",
        "text-color": "#1f1e1a",
        "text-color-light": "#5C574E",
        "text-color-lighter": "#6F6A5F",
        hairline: "#e3ded3",
        "pink-fill": "#efc7ce",
        links: "#a3324f",
        "pink-text": "#43222a",
      },
      backgroundColor: {
        cream: "#f7f4ee",
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
