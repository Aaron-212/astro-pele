import tailwindcss from "@tailwindcss/vite";
import pele from "@aaron212/astro-pele";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://demos.aaron212.com",
  base: "/astro-pele",
  outDir: "./dist/astro-pele",
  output: "static",
  vite: { plugins: [tailwindcss()] },
  integrations: [pele()],
});
