import { isSatteriProcessor, satteri } from "@astrojs/markdown-satteri";
import type { AstroIntegration } from "astro";
import type { MountOptions } from "pele/lazy";
import { peleMdast } from "./satteri.js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Pele options that can be serialized from Astro's config to the browser. */
export interface PeleOptions extends Omit<
  MountOptions,
  "measurer" | "icons" | "onRender" | "onError" | "sanitize" | "config" | "now"
> {
  config?: { [key: string]: JsonValue };
  /** Reference time in milliseconds since the Unix epoch. */
  now?: number;
}

/** Render Mermaid fences with Pele in the browser. */
export default function pele(options: PeleOptions = {}): AstroIntegration {
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

        injectScript(
          "page",
          'import { initPele } from "@aaron212/astro-pele/runtime";\n' +
            `initPele(${JSON.stringify(options).replaceAll("<", "\\u003c")});`,
        );
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
