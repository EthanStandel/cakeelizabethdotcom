import debounce from "lodash/debounce";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  type Accessor,
} from "solid-js";

const SETTLE_DELAY_MS = 500;
const REVEAL_THRESHOLD = 0.5;

// The anchor is the document offset the header rests at. It stays 0 on the
// server and until mount, which leaves the header at the top of the page.
export const createPartiallyStickyHeader = (
  isPartiallySticky: Accessor<boolean>,
) => {
  let track: HTMLElement | undefined;
  let header: HTMLElement | undefined;
  const [anchor, setAnchor] = createSignal(0);
  const [isSettling, setIsSettling] = createSignal(false);

  const headerHeight = () => header?.offsetHeight ?? 0;

  const withinReach = (value: number) =>
    Math.max(
      0,
      Math.min(
        Math.max(value, window.scrollY - headerHeight()),
        window.scrollY,
      ),
    );

  const settleTo = (value: number) => {
    if (!isPartiallySticky()) return;
    setIsSettling(true);
    setAnchor(withinReach(value));
  };

  const settle = debounce(() => {
    const height = headerHeight();
    const revealedHeight = anchor() - window.scrollY + height;
    if (revealedHeight <= 0 || revealedHeight >= height) return;
    settleTo(
      revealedHeight >= height * REVEAL_THRESHOLD
        ? window.scrollY
        : window.scrollY - height,
    );
  }, SETTLE_DELAY_MS);

  const follow = () => {
    if (!isPartiallySticky()) return;
    const interrupted =
      isSettling() && track ? track.offsetHeight - headerHeight() : anchor();
    setIsSettling(false);
    setAnchor(withinReach(interrupted));
    settle();
  };

  createEffect(
    on(
      isPartiallySticky,
      (partiallySticky) => {
        if (partiallySticky) follow();
        else setIsSettling(false);
      },
      { defer: true },
    ),
  );

  onMount(() => {
    const listeners = new AbortController();
    window.addEventListener("scroll", follow, {
      passive: true,
      signal: listeners.signal,
    });
    window.addEventListener("resize", follow, { signal: listeners.signal });
    follow();
    onCleanup(() => {
      listeners.abort();
      settle.cancel();
    });
  });

  return {
    anchor,
    isSettling,
    reveal: () => settleTo(window.scrollY),
    setTrack: (element: HTMLElement) => (track = element),
    setHeader: (element: HTMLElement) => (header = element),
  };
};
