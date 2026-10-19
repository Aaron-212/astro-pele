import type { PeleOptions } from "./index.js";
import { mountPele } from "./client.js";

/** Initialize diagram rendering and Astro navigation handlers with the integration's options. */
export function initPele(options: PeleOptions = {}): void {
  const cleanups: (() => void)[] = [];

  function render(): void {
    cleanups.push(mountPele(document, options));
  }

  document.addEventListener("astro:before-swap", () => {
    for (const cleanup of cleanups.splice(0)) {
      cleanup();
    }
  });
  document.addEventListener("astro:page-load", render);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
}
