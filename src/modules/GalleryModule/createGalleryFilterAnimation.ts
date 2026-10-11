import {
  Accessor,
  createEffect,
  createSignal,
  on,
  onCleanup,
  untrack,
} from "solid-js";
import { withViewTransition } from "~/components/modals/utils/createGalleryModalTransition";
import {
  GALLERY_DURATION_MS,
  galleryTransition,
} from "~/lib/utils/galleryAnimations";

const MAX_PER_COLUMN = 3;
export const DESKTOP_COLS = 4;
const MAX_ITEMS = DESKTOP_COLS * MAX_PER_COLUMN;

export const COLUMN_INDICES = Array.from({ length: DESKTOP_COLS }, (_, i) => i);

export type IndexedGalleryItem<T> = T & { originalIndex: number };

// Distributes matching items round-robin across the columns visible at the
// current breakpoint, so no item is assigned to a hidden column. `orderedItems`
// is expected to already be in display order (e.g. sorted by date), with each
// entry carrying the original-array index so the returned indices still
// reference the correct items/CMS paths.
const buildColumnBuckets = <T extends { tags?: string[] }>(
  tag: string | null,
  orderedItems: ReadonlyArray<IndexedGalleryItem<T>>,
  activeColumns: number,
): number[][] => {
  const matching = (
    tag
      ? orderedItems.filter((item) => (item.tags ?? []).includes(tag))
      : orderedItems
  ).slice(0, MAX_ITEMS);
  const columns: number[][] = Array.from({ length: DESKTOP_COLS }, () => []);
  matching.forEach((item, i) =>
    columns[i % activeColumns].push(item.originalIndex),
  );
  return columns;
};

// Derived from the columns instead of by unfreezing the list, because a page
// scrolled to its end would lose scroll position the moment the list shrank.
const measureUnfrozenHeight = (list: HTMLUListElement): number => {
  const { paddingTop, paddingBottom } = getComputedStyle(list);
  const columnHeights = Array.from(
    list.children,
    (column) => column.getBoundingClientRect().height,
  );
  return (
    Math.max(...columnHeights) +
    parseFloat(paddingTop) +
    parseFloat(paddingBottom)
  );
};

export const createGalleryFilterAnimation = <T extends { tags?: string[] }>(
  galleryFilterTag: Accessor<string | null>,
  orderedItems: Accessor<ReadonlyArray<IndexedGalleryItem<T>>>,
  activeColumns: Accessor<number>,
): {
  displayBuckets: Accessor<number[][]>;
  leavingIndices: Accessor<ReadonlySet<number>>;
  enteringIndices: Accessor<ReadonlySet<number>>;
  containerRef: (el: HTMLUListElement) => void;
} => {
  const [displayBuckets, setDisplayBuckets] = createSignal<number[][]>(
    Array.from({ length: DESKTOP_COLS }, () => []),
  );
  const [leavingIndices, setLeavingIndices] = createSignal<ReadonlySet<number>>(
    new Set(),
  );
  const [enteringIndices, setEnteringIndices] = createSignal<
    ReadonlySet<number>
  >(new Set());

  let listRef: HTMLUListElement | undefined;
  let releaseTimer: ReturnType<typeof setTimeout> | null = null;

  const clearReleaseTimer = () => {
    if (releaseTimer) {
      clearTimeout(releaseTimer);
      releaseTimer = null;
    }
  };

  const release = () => {
    clearReleaseTimer();
    if (!listRef) return;
    listRef.style.minHeight = "";
    listRef.style.transition = "";
  };

  const freeze = () => {
    if (!listRef) return;
    clearReleaseTimer();
    listRef.style.transition = "";
    listRef.style.minHeight = `${listRef.offsetHeight}px`;
  };

  // Must run while entering items are still fully expanded, so that the height
  // it measures is the one the list settles at.
  const resizeToSettledHeight = () => {
    if (!listRef) return;
    const settledHeight = measureUnfrozenHeight(listRef);
    listRef.style.transition = galleryTransition("min-height");
    listRef.style.minHeight = `${settledHeight}px`;
    releaseTimer = setTimeout(release, GALLERY_DURATION_MS + 50);
  };

  let initialized = false;
  createEffect(() => {
    if (initialized) return;
    const items = orderedItems();
    if (!items.length) return;
    initialized = true;
    setDisplayBuckets(
      buildColumnBuckets(
        untrack(galleryFilterTag),
        items,
        untrack(activeColumns),
      ),
    );
  });

  createEffect(
    on(
      activeColumns,
      (columns) => {
        const items = orderedItems();
        if (!items.length || !initialized) return;
        release();
        setEnteringIndices(new Set<number>());
        setLeavingIndices(new Set<number>());
        setDisplayBuckets(
          buildColumnBuckets(untrack(galleryFilterTag), items, columns),
        );
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      galleryFilterTag,
      (newTag) => {
        const items = orderedItems();
        if (!items.length) return;

        const newBuckets = buildColumnBuckets(
          newTag,
          items,
          untrack(activeColumns),
        );
        const newActiveSet = new Set(newBuckets.flat());

        const currentActive = displayBuckets()
          .flat()
          .filter((i) => !leavingIndices().has(i));
        const currentActiveSet = new Set(currentActive);

        const toLeave = currentActive.filter((i) => !newActiveSet.has(i));
        const entering = newBuckets
          .flat()
          .filter((i) => !currentActiveSet.has(i));

        freeze();

        const commit = () => {
          withViewTransition(() => {
            setDisplayBuckets(newBuckets);
            setLeavingIndices(new Set<number>());
            resizeToSettledHeight();
            setEnteringIndices(new Set<number>(entering));
          }, ["gallery-filter"]);

          requestAnimationFrame(() =>
            requestAnimationFrame(() => setEnteringIndices(new Set<number>())),
          );
        };

        if (toLeave.length > 0) {
          setLeavingIndices((prev) => new Set<number>([...prev, ...toLeave]));
          const commitTimer = setTimeout(commit, GALLERY_DURATION_MS + 10);
          onCleanup(() => clearTimeout(commitTimer));
        } else {
          commit();
        }
      },
      { defer: true },
    ),
  );

  onCleanup(clearReleaseTimer);

  return {
    displayBuckets,
    leavingIndices,
    enteringIndices,
    containerRef: (el) => {
      listRef = el;
    },
  };
};
