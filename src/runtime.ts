import type { PeleOptions } from "./index.js";
import { mountPele } from "./client.js";

let initialized = false;
let mountOptions: PeleOptions = {};

/** Initialize diagram rendering and Astro navigation handlers with the integration's options. */
export function initPele(options?: PeleOptions): void {
  if (options) {
    mountOptions = options;
  }
  if (initialized) {
    return;
  }
  initialized = true;
  const cleanups: (() => void)[] = [];

  function render(): void {
    cleanups.push(mountPele(document, mountOptions));
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
