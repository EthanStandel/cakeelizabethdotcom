import { createSignal, onCleanup, onMount, type Accessor } from "solid-js";
import { isServer } from "solid-js/web";

// Mirrors --container-dsk in app.css
export const DSK_BREAKPOINT_PX = 1024;

// Defaults to mobile so the first client render matches the server render;
// the real breakpoint is resolved in onMount to avoid a hydration mismatch.
export const createBreakpoint = (): Accessor<"dsk" | "mbl"> => {
  const [breakpoint, setBreakpoint] = createSignal<"dsk" | "mbl">("mbl");
  if (isServer) return breakpoint;
  onMount(() => {
    const query = window.matchMedia(`(min-width: ${DSK_BREAKPOINT_PX}px)`);
    const sync = () => setBreakpoint(query.matches ? "dsk" : "mbl");
    sync();
    query.addEventListener("change", sync);
    onCleanup(() => query.removeEventListener("change", sync));
  });
  return breakpoint;
};

createBreakpoint.IsMobileView = (): Accessor<boolean> => {
  const breakpoint = createBreakpoint();
  return () => breakpoint() === "mbl";
};
