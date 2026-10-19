import { detectType, load, mount, type DiagramType, type Mounted, type MountOptions } from "pele/lazy";

const mounted = new WeakSet<HTMLElement>();

/** Load diagram types on demand and return cleanup for pending and completed mounts. */
export function mountPele(root: ParentNode = document, options?: MountOptions): () => void {
  const cleanups: (() => void)[] = [];

  for (const element of root.querySelectorAll<HTMLElement>(".astro-pele[data-pele]")) {
    if (mounted.has(element)) {
      continue;
    }

    const source = element.dataset.peleSource ?? "";
    element.replaceChildren();
    element.setAttribute("aria-busy", "true");
    let disposed = false;
    let diagram: Mounted | undefined;

    const cleanup = () => {
      if (disposed) {
        return;
      }
      disposed = true;
      diagram?.destroy();
      mounted.delete(element);
      element.replaceChildren();
      element.setAttribute("aria-busy", "true");
    };
    mounted.add(element);
    cleanups.push(cleanup);

    let type: DiagramType | null = null;
    try {
      type = detectType(source);
    } catch {}

    void load(type).then(
      () => {
        if (disposed) {
          return;
        }
        try {
          diagram = mount(element, source, options);
        } finally {
          element.setAttribute("aria-busy", "false");
        }
      },
      (error: unknown) => {
        if (disposed) {
          return;
        }
        element.textContent = "Unable to load this diagram.";
        element.setAttribute("aria-busy", "false");
        options?.onError?.(error);
      },
    );
  }

  return () => {
    for (const cleanup of cleanups.splice(0)) {
      cleanup();
    }
  };
}
