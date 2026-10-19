import tailwindcss from "@tailwindcss/vite";
import pele from "@aaron212/astro-pele";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
  integrations: [pele()],
});
