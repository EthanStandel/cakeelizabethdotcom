import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { cx } from "cva";
import { createDragAxisLock } from "~/lib/utils/createDragAxisLock";
import { createWindowMouseDrag } from "~/lib/utils/createWindowMouseDrag";
import {
  GALLERY_DURATION_MS,
  galleryTransition,
} from "~/lib/utils/galleryAnimations";

export const COLLAPSED_HEIGHT_PX = 100;
const HANDLE_HEIGHT = 32;
const EXPANDED_VIEWPORT_FRACTION = 0.92;

interface ControlledActionSheetProps {
  children: JSX.Element;
  expanded: Accessor<boolean>;
  onExpandedChange: (expanded: boolean) => void;
}

export const ControlledActionSheet: Component<ControlledActionSheetProps> = (
  props,
) => {
  const [dragOffset, setDragOffset] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [contentNaturalHeight, setContentNaturalHeight] = createSignal(0);

  const [scrollable, setScrollable] = createSignal(false);
  const sheetAtRest = createMemo(() => props.expanded() && dragOffset() === 0);
  createEffect(() => {
    if (sheetAtRest()) {
      const timeout = setTimeout(
        () => setScrollable(true),
        GALLERY_DURATION_MS,
      );
      onCleanup(() => clearTimeout(timeout));
    } else {
      setScrollable(false);
    }
  });

  let contentRef!: HTMLDivElement;
  let scrollRef!: HTMLDivElement;
  let startY = 0;

  const dragAxisLock = createDragAxisLock("y");

  const expandedHeightPx = () =>
    Math.min(
      contentNaturalHeight() + HANDLE_HEIGHT,
      EXPANDED_VIEWPORT_FRACTION * window.innerHeight,
    );

  const dragStart = (clientX: number, clientY: number) => {
    dragAxisLock.reset();
    dragAxisLock.move(clientX, clientY);
    startY = clientY;
    setIsDragging(true);
  };

  const dragMove = (clientX: number, clientY: number) => {
    if (!isDragging()) return;
    dragAxisLock.move(clientX, clientY);
    if (!dragAxisLock.locked) return;
    const delta = clientY - startY;
    if (props.expanded()) {
      const canScrollDown =
        scrollRef.scrollHeight - scrollRef.scrollTop - scrollRef.clientHeight >
        1;
      const canScrollUp = scrollRef.scrollTop > 0;
      if ((delta < 0 && canScrollDown) || (delta > 0 && canScrollUp)) {
        startY = clientY;
        return;
      }
    }
    setDragOffset(delta);
  };

  const dragEnd = () => {
    setIsDragging(false);
    if (!dragAxisLock.locked) return;
    const basePx = props.expanded() ? expandedHeightPx() : COLLAPSED_HEIGHT_PX;
    const finalPx = basePx - dragOffset();
    const targetExpanded =
      Math.abs(finalPx - expandedHeightPx()) <
      Math.abs(finalPx - COLLAPSED_HEIGHT_PX);
    setDragOffset(0);
    if (targetExpanded !== props.expanded())
      props.onExpandedChange(targetExpanded);
  };

  const onTouchStart = (e: TouchEvent) =>
    dragStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e: TouchEvent) =>
    dragMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = () => dragEnd();

  const onMouseDown = createWindowMouseDrag({
    onStart: dragStart,
    onMove: dragMove,
    onEnd: dragEnd,
  });

  onMount(() => {
    const observer = new ResizeObserver(() =>
      setContentNaturalHeight(contentRef.clientHeight),
    );
    observer.observe(contentRef);

    onCleanup(() => observer.disconnect());
  });

  const sheetHeight = () => {
    const offset = dragOffset();
    const basePx = props.expanded() ? expandedHeightPx() : COLLAPSED_HEIGHT_PX;
    if (offset === 0) return `${basePx}px`;
    return `${Math.max(0, basePx - offset)}px`;
  };

  return (
    <div
      on:touchstart={{ passive: true, handleEvent: onTouchStart }}
      on:touchmove={{ passive: true, handleEvent: onTouchMove }}
      on:touchend={{ passive: true, handleEvent: onTouchEnd }}
      onMouseDown={onMouseDown}
      class="absolute bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white shadow-xl will-change-[height]"
      style={{
        height: sheetHeight(),
        transition: galleryTransition("height", !isDragging()),
      }}
    >
      <div
        class="flex shrink-0 items-center justify-center"
        style={{ height: `${HANDLE_HEIGHT}px` }}
        onDblClick={() => props.onExpandedChange(!props.expanded())}
      >
        <div class="h-1 w-10 rounded-full bg-black/20" />
      </div>

      <div class="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          class={cx("h-full", scrollable() ? "overflow-y-auto" : "overflow-y-hidden")}
        >
          <div ref={contentRef}>{props.children}</div>
        </div>

        <Show when={!props.expanded()}>
          <div
            class={cx(
              "pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-white transition-opacity duration-200",
              isDragging() && dragOffset() < -20 ? "opacity-0" : "opacity-100",
            )}
          />
        </Show>
      </div>
    </div>
  );
};
