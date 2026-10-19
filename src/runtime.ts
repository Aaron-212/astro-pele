import { mountPele } from "./client.js";

const cleanups: (() => void)[] = [];

function render(): void {
  cleanups.push(mountPele());
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
