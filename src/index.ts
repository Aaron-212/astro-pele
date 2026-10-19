import { isSatteriProcessor, satteri } from "@astrojs/markdown-satteri";
import type { AstroIntegration } from "astro";
import { peleMdast } from "./satteri.js";

/** Render Mermaid fences with Pele in the browser. */
export default function pele(): AstroIntegration {
  const mdastPlugin = peleMdast();

  return {
    name: "astro-pele",
    hooks: {
      "astro:config:setup": ({ config, updateConfig, injectScript }) => {
        const processor = config.markdown.processor;
        if (!isSatteriProcessor(processor)) {
          throw new Error(
            "astro-pele requires the Sätteri Markdown processor. Configure markdown.processor with satteri() " +
              "from @astrojs/markdown-satteri before adding the integration.",
          );
        }

        updateConfig({
          markdown: {
            processor: satteri({
              ...processor.options,
              mdastPlugins: [...processor.options.mdastPlugins, mdastPlugin],
            }),
          },
        });

        injectScript("page", 'import "@aaron212/astro-pele/runtime";');
      },
      "astro:config:done": ({ config }) => {
        const processor = config.markdown.processor;
        if (!isSatteriProcessor(processor) || !processor.options.mdastPlugins.includes(mdastPlugin)) {
          throw new Error(
            "Another integration removed astro-pele's plugin. " +
              "Place astro-pele after integrations that configure markdown.processor.",
          );
        }
      },
    },
  };
}
