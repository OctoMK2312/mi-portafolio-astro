// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://www.portafolio-mbd.xyz",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), icon(), react()],
});
