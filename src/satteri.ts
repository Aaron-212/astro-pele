import { defineMdastPlugin, type MdastPluginDefinition } from "satteri";

/** Preserve Mermaid source in a blank placeholder before Astro's code highlighter runs. */
export function peleMdast(): MdastPluginDefinition {
  return defineMdastPlugin({
    name: "pele-mdast",
    code(node, ctx) {
      if (node.lang !== "mermaid") {
        return;
      }

      ctx.replaceNode(node, {
        type: "peleDiagram",
        data: {
          hName: "div",
          hProperties: {
            className: ["astro-pele"],
            dataPele: "",
            dataPeleSource: node.value,
            ariaBusy: "true",
          },
        },
        children: [],
      });
    },
  });
}
