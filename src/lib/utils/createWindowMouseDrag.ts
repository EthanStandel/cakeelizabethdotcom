import { onCleanup } from "solid-js";

// Mouse drags attach move/up to window so the drag survives leaving the
// element. Listeners are reaped on mouseup, on the next mousedown (a mouseup
// released outside the window never fires), and on owner cleanup.
export const createWindowMouseDrag = (handlers: {
  onStart: (x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onEnd: (x: number, y: number) => void;
}): ((event: MouseEvent) => void) => {
  let abortController: AbortController | null = null;
  onCleanup(() => abortController?.abort());

  return (event: MouseEvent) => {
    if (event.button !== 0) return;
    handlers.onStart(event.clientX, event.clientY);
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;
    window.addEventListener(
      "mousemove",
      (moveEvent) => {
        moveEvent.preventDefault();
        handlers.onMove(moveEvent.clientX, moveEvent.clientY);
      },
      { signal },
    );
    window.addEventListener(
      "mouseup",
      (upEvent) => {
        abortController?.abort();
        handlers.onEnd(upEvent.clientX, upEvent.clientY);
      },
      { signal },
    );
  };
};
