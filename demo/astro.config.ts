import tailwindcss from "@tailwindcss/vite";
import pele from "@aaron212/astro-pele";
import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
  markdown: { processor: satteri() },
  integrations: [pele({ fontSize: 15 })],
});
