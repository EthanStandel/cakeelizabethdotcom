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
  let scheduledReleaseTimer: ReturnType<typeof setTimeout> | null = null;

  const clearReleaseTimers = () => {
    if (releaseTimer) {
      clearTimeout(releaseTimer);
      releaseTimer = null;
    }
    if (scheduledReleaseTimer) {
      clearTimeout(scheduledReleaseTimer);
      scheduledReleaseTimer = null;
    }
  };

  const freeze = () => {
    if (!listRef) return;
    clearReleaseTimers();
    listRef.style.transition = "";
    listRef.style.minHeight = `${listRef.offsetHeight}px`;
  };

  const release = () => {
    if (!listRef) return;
    clearReleaseTimers();
    listRef.style.transition = galleryTransition("min-height");
    listRef.style.minHeight = "0px";
    releaseTimer = setTimeout(() => {
      if (listRef) {
        listRef.style.minHeight = "";
        listRef.style.transition = "";
      }
      releaseTimer = null;
    }, GALLERY_DURATION_MS + 50);
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
        clearReleaseTimers();
        if (listRef) {
          listRef.style.minHeight = "";
          listRef.style.transition = "";
        }
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
            setEnteringIndices(new Set<number>(entering));
            setDisplayBuckets(newBuckets);
            setLeavingIndices(new Set<number>());
          }, ["gallery-filter"]);

          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              setEnteringIndices(new Set<number>());
              scheduledReleaseTimer = setTimeout(
                release,
                GALLERY_DURATION_MS + 50,
              );
            }),
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

  onCleanup(clearReleaseTimers);

  return {
    displayBuckets,
    leavingIndices,
    enteringIndices,
    containerRef: (el) => {
      listRef = el;
    },
  };
};
