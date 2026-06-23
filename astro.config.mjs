// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
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
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
  ],
});
