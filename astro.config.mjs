// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Reemplaza con el dominio final de tu sitio web
  site: "https://www.portafolio-mbd.xyz",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), icon(), react()],
});
