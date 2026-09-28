import {
  batch,
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  Show,
  untrack,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { cx } from "cva";
import { ChevronLeft, ChevronRight, X } from "lucide-solid";
import { GalleryItemsShape } from "~/models/GalleryItems.shape";
import { ConstantsShape } from "~/models";
import { getCollectionItem } from "~/lib/content";
import { iconLinkButtonClass, LinkButton } from "~/components/LinkButton";
import { compareDatesDescending } from "~/lib/utils/compareDatesDescending";
import { createContentFetch } from "~/primitives/createContentFetch";
import { useConstants } from "~/primitives/ConstantsContext";
import {
  CmsPathContextProvider,
  CmsSourceContextProvider,
  useCmsFieldProps,
} from "~/lib/cms/CmsPathContext";
import {
  createGalleryModalTransition,
  isModalTransitioning,
} from "../utils/createGalleryModalTransition";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";
import {
  GALLERY_DURATION_MS,
  GALLERY_SWIPE_THRESHOLD_PX,
  GALLERY_SWIPE_VELOCITY,
} from "~/lib/utils/galleryAnimations";
import { createDragAxisLock } from "~/lib/utils/createDragAxisLock";
import { createWindowMouseDrag } from "~/lib/utils/createWindowMouseDrag";
import { createBreakpoint } from "~/lib/utils/createBreakpoint";
import { GalleryModalDesktop } from "./GalleryModalDesktop";
import { GalleryModalMobile, type FilmstripSlot } from "./GalleryModalMobile";

export const GalleryModal: Component<{ imageUrl: string }> = (props) => {
  const [localImageUrl, setLocalImageUrl] = createSignal(props.imageUrl);

  const [transitioned, handleClose] =
    createGalleryModalTransition(localImageUrl);
  const cardReady = () => transitioned() && !isModalTransitioning();

  const { getModalHref } = createQueryParamRouting.modal.href();

  const galleryData = createContentFetch("gallery-items", () =>
    getCollectionItem(GalleryItemsShape, "main"),
  );

  const { galleryFilterTag } = createQueryParamRouting.galleryFilterTag.href();

  const allItems = createMemo(() => galleryData()?.items ?? []);

  const imageIndexMap = createMemo(() => {
    const map = new Map<string, number>();
    allItems().forEach((item, index) => {
      if (item.image) map.set(item.image, index);
    });
    return map;
  });
  const findItemIndex = (url: string | null) =>
    url ? (imageIndexMap().get(url) ?? -1) : -1;
  const itemAtIndex = (index: number) =>
    index >= 0 ? (allItems()[index] ?? null) : null;
  const itemAtUrl = (url: string) => itemAtIndex(findItemIndex(url));

  const sortedItems = createMemo(() =>
    allItems().toSorted((a, b) => compareDatesDescending(a.date, b.date)),
  );

  const filteredItems = createMemo(() => {
    const tag = galleryFilterTag();
    const all = sortedItems();
    return tag ? all.filter((i) => (i.tags ?? []).includes(tag)) : all;
  });

  const itemIndex = createMemo(() => findItemIndex(localImageUrl()));

  const filteredItemIndex = createMemo(() =>
    filteredItems().findIndex((i) => i.image === localImageUrl()),
  );

  const item = createMemo(() => itemAtIndex(itemIndex()));

  const prevImg = createMemo(() => {
    const idx = filteredItemIndex();
    return idx > 0 ? (filteredItems()[idx - 1]?.image ?? null) : null;
  });

  const nextImg = createMemo(() => {
    const idx = filteredItemIndex();
    return idx >= 0 && idx < filteredItems().length - 1
      ? (filteredItems()[idx + 1]?.image ?? null)
      : null;
  });

  const prevHref = createMemo(() => {
    const img = prevImg();
    if (!img) return null;
    return getModalHref({ type: "gallery", payload: { imageUrl: img } });
  });

  const nextHref = createMemo(() => {
    const img = nextImg();
    if (!img) return null;
    return getModalHref({ type: "gallery", payload: { imageUrl: img } });
  });

  createEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = "hidden";
    onCleanup(() => {
      document.documentElement.style.overflow = "";
    });
  });

  const navigate = useNavigate();
  const isMobile = createBreakpoint.IsMobileView();
  const constants = useConstants();
  const constantsSource = { collection: ConstantsShape.name, slug: "main" };
  const closeCmsProp = useCmsFieldProps(() => "galleryClose", constantsSource);
  const prevCmsProp = useCmsFieldProps(
    () => "galleryPrevious",
    constantsSource,
  );
  const nextCmsProp = useCmsFieldProps(() => "galleryNext", constantsSource);

  const handleShare = () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    navigator.share({
      title: item()?.title ?? constants()?.siteName ?? "Cake Elizabeth",
      text: item()?.description ?? undefined,
      url: window.location.href,
    });
  };

  const [swipeX, setSwipeX] = createSignal(0);
  const [swipeAnimate, setSwipeAnimate] = createSignal(false);

  let navDirectionPending: "prev" | "next" | null = null;
  let isNavigating = false;
  let navTimer: ReturnType<typeof setTimeout> | null = null;
  let outgoingTimer: ReturnType<typeof setTimeout> | null = null;

  const [outgoingUrl, setOutgoingUrl] = createSignal<string | null>(null);
  const [outgoingX, setOutgoingX] = createSignal(0);
  const [outgoingAnimate, setOutgoingAnimate] = createSignal(false);

  const outgoingItemIndex = createMemo(() => findItemIndex(outgoingUrl()));
  const outgoingItem = createMemo(() => itemAtIndex(outgoingItemIndex()));

  const navigatePrev = () => {
    const href = prevHref();
    if (!href) return;
    navDirectionPending = "prev";
    navigate(href, { scroll: false });
  };

  const navigateNext = () => {
    const href = nextHref();
    if (!href) return;
    navDirectionPending = "next";
    navigate(href, { scroll: false });
  };

  createEffect(() => {
    if (typeof window === "undefined") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") navigatePrev();
      if (e.key === "ArrowRight") navigateNext();
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
  });

  let filmstripRef: HTMLDivElement | undefined;

  let baseTranslate = 0;
  const [filmstripTranslate, setFilmstripTranslate] = createSignal(0);
  const [filmstripAnimate, setFilmstripAnimate] = createSignal(false);

  const [filmstripSlots, setFilmstripSlots] = createSignal<FilmstripSlot[]>([
    { url: props.imageUrl, left: 0 },
  ]);

  const getFilmstripWidth = () =>
    filmstripRef?.offsetWidth ?? window.innerWidth;

  const commitBaseTranslate = (value: number) => {
    baseTranslate = value;
    setFilmstripTranslate(value);
  };

  const ensureSlot = (url: string, left: number) => {
    setFilmstripSlots((prev) =>
      prev.some((s) => s.url === url) ? prev : [...prev, { url, left }],
    );
  };

  const pruneSlots = () => {
    const width = getFilmstripWidth();
    const currentLeft = -baseTranslate;
    setFilmstripSlots((prev) =>
      prev.filter((s) => Math.abs(s.left - currentLeft) <= width),
    );
  };

  const prefetchNeighbors = () => {
    const width = getFilmstripWidth();
    const currentLeft = -baseTranslate;
    const prev = prevImg();
    const next = nextImg();
    if (prev) ensureSlot(prev, currentLeft - width);
    if (next) ensureSlot(next, currentLeft + width);
  };

  const commitFilmstripNav = (
    newUrl: string,
    direction: "prev" | "next",
    href: string | null,
  ) => {
    const width = getFilmstripWidth();
    const targetLeft =
      direction === "next" ? -baseTranslate + width : -baseTranslate - width;
    ensureSlot(newUrl, targetLeft);
    setLocalImageUrl(newUrl);
    setFilmstripAnimate(true);
    commitBaseTranslate(
      direction === "next" ? baseTranslate - width : baseTranslate + width,
    );
    isNavigating = true;
    navTimer = setTimeout(() => {
      isNavigating = false;
      navTimer = null;
      setFilmstripAnimate(false);
      pruneSlots();
      prefetchNeighbors();
      if (href) navigate(href, { scroll: false });
    }, GALLERY_DURATION_MS + 50);
  };

  const dragAxisLock = createDragAxisLock("x");
  let touchStartX = 0;
  let touchStartTime = 0;

  const swipeStart = (x: number, y: number) => {
    if (isNavigating) return;
    prefetchNeighbors();
    dragAxisLock.reset();
    dragAxisLock.move(x, y);
    touchStartX = x;
    touchStartTime = performance.now();
    setFilmstripAnimate(false);
  };

  const swipeMove = (x: number, y: number) => {
    if (isNavigating) return;
    dragAxisLock.move(x, y);
    if (!dragAxisLock.locked) return;
    const dx = x - touchStartX;
    const hasTarget = (dx < 0 && !!nextImg()) || (dx > 0 && !!prevImg());
    setFilmstripTranslate(
      hasTarget ? baseTranslate + dx : baseTranslate + dx / 3,
    );
  };

  const swipeEnd = (x: number) => {
    if (isNavigating || !dragAxisLock.locked) return;
    const dx = x - touchStartX;
    const elapsed = Math.max(performance.now() - touchStartTime, 1);
    const velocity = Math.abs(dx) / elapsed;

    const goNext =
      (dx < -GALLERY_SWIPE_THRESHOLD_PX ||
        (dx < 0 && velocity > GALLERY_SWIPE_VELOCITY)) &&
      !!nextImg();
    const goPrev =
      (dx > GALLERY_SWIPE_THRESHOLD_PX ||
        (dx > 0 && velocity > GALLERY_SWIPE_VELOCITY)) &&
      !!prevImg();

    if (goNext) {
      commitFilmstripNav(nextImg()!, "next", nextHref()!);
    } else if (goPrev) {
      commitFilmstripNav(prevImg()!, "prev", prevHref()!);
    } else {
      commitBaseTranslate(baseTranslate);
      setFilmstripAnimate(true);
      setTimeout(() => setFilmstripAnimate(false), GALLERY_DURATION_MS + 50);
    }
  };

  const onSwipeMouseDown = createWindowMouseDrag({
    onStart: swipeStart,
    onMove: swipeMove,
    onEnd: swipeEnd,
  });

  const [expandedSlots, setExpandedSlots] = createSignal<
    Record<string, boolean>
  >({});
  const isSlotExpanded = (url: string) => () => expandedSlots()[url] ?? false;
  const setSlotExpanded = (url: string) => (expanded: boolean) =>
    setExpandedSlots((prev) => ({ ...prev, [url]: expanded }));
  const onSlotImageClick = (url: string) => {
    if (!dragAxisLock.hasMoved) setSlotExpanded(url)(false);
  };

  // defer:true skips the initial run so the first image uses the view transition only.
  createEffect(
    on(
      () => props.imageUrl,
      () => {
        const dir = navDirectionPending;
        navDirectionPending = null;

        const mobile = untrack(isMobile);

        if (dir && !mobile) {
          const oldUrl = untrack(localImageUrl);
          if (outgoingTimer) {
            clearTimeout(outgoingTimer);
            outgoingTimer = null;
          }
          batch(() => {
            setOutgoingUrl(oldUrl);
            setOutgoingX(0);
            setOutgoingAnimate(false);
            setLocalImageUrl(props.imageUrl);
            setSwipeX(dir === "next" ? window.innerWidth : -window.innerWidth);
            setSwipeAnimate(false);
          });
          requestAnimationFrame(() => {
            setOutgoingX(
              dir === "next" ? -window.innerWidth : window.innerWidth,
            );
            setOutgoingAnimate(true);
            setSwipeX(0);
            setSwipeAnimate(true);
            outgoingTimer = setTimeout(() => {
              setOutgoingUrl(null);
              outgoingTimer = null;
            }, GALLERY_DURATION_MS + 50);
          });
        } else if (dir && mobile) {
          commitFilmstripNav(props.imageUrl, dir, null);
        } else {
          setLocalImageUrl(props.imageUrl);
        }
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    if (navTimer !== null) {
      clearTimeout(navTimer);
      navTimer = null;
    }
    if (outgoingTimer !== null) {
      clearTimeout(outgoingTimer);
      outgoingTimer = null;
    }
  });

  return (
    <CmsSourceContextProvider collection="gallery-items" slug="main">
      <CmsPathContextProvider value={`items.${itemIndex()}`}>
        <div
          data-modal
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose(e);
          }}
        >
          <button
            onClick={handleClose}
            aria-label={constants()?.galleryClose ?? "Close"}
            {...closeCmsProp()}
            class={cx(
              iconLinkButtonClass,
              "absolute top-4 right-4 z-10 @max-dsk:bg-primary/50 @max-dsk:backdrop-blur-xs",
            )}
          >
            <X size={18} />
          </button>

          <Show when={prevHref()}>
            <LinkButton
              variant="icon"
              href={prevHref()!}
              noScroll
              aria-label={constants()?.galleryPrevious ?? "Previous image"}
              {...prevCmsProp()}
              class="absolute left-4 top-1/2 z-10 -translate-y-1/2 @max-dsk:bg-primary/50 @max-dsk:backdrop-blur-xs"
              onClick={() => (navDirectionPending = "prev")}
            >
              <ChevronLeft size={20} stroke-width={2.5} />
            </LinkButton>
          </Show>

          <Show when={nextHref()}>
            <LinkButton
              variant="icon"
              href={nextHref()!}
              noScroll
              aria-label={constants()?.galleryNext ?? "Next image"}
              {...nextCmsProp()}
              class="absolute right-4 top-1/2 z-10 -translate-y-1/2 @max-dsk:bg-primary/50 @max-dsk:backdrop-blur-xs"
              onClick={() => (navDirectionPending = "next")}
            >
              <ChevronRight size={20} stroke-width={2.5} />
            </LinkButton>
          </Show>

          <Show when={!isMobile()}>
            <GalleryModalDesktop
              transitioned={transitioned}
              cardReady={cardReady}
              localImageUrl={localImageUrl}
              item={item}
              swipeX={swipeX}
              swipeAnimate={swipeAnimate}
              outgoingUrl={outgoingUrl}
              outgoingItem={outgoingItem}
              outgoingItemIndex={outgoingItemIndex}
              outgoingX={outgoingX}
              outgoingAnimate={outgoingAnimate}
            />
          </Show>

          <Show when={isMobile()}>
            <GalleryModalMobile
              filmstripRef={(el) => (filmstripRef = el)}
              filmstripSlots={filmstripSlots}
              filmstripAnimate={filmstripAnimate}
              filmstripTranslate={filmstripTranslate}
              transitioned={transitioned}
              localImageUrl={localImageUrl}
              item={item}
              indexOf={findItemIndex}
              itemAt={itemAtUrl}
              isSlotExpanded={isSlotExpanded}
              setSlotExpanded={setSlotExpanded}
              onSlotImageClick={onSlotImageClick}
              onSwipeStart={swipeStart}
              onSwipeMove={swipeMove}
              onSwipeEnd={swipeEnd}
              onSwipeMouseDown={onSwipeMouseDown}
            />
          </Show>
        </div>
      </CmsPathContextProvider>
    </CmsSourceContextProvider>
  );
};
