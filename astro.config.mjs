// @ts-check
import { defineConfig, fontProviders } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Aeonik Pro",
      cssVariable: "--font-aeonik-pro",
      options: {
        variants: [
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/aeonik-bold.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/aeonik-medium.woff2"],
          },
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/aeonik-regular.woff2"],
          },
          {
            weight: 200,
            style: "normal",
            src: ["./src/assets/fonts/aeonik-thin.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
  ],

  adapter: vercel(),
})
