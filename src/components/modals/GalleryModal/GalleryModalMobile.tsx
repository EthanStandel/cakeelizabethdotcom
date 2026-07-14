import { Accessor, Component, createMemo, For, JSX } from "solid-js";
import { cx } from "cva";
import { CmsPathContextProvider } from "~/lib/cms/CmsPathContext";
import {
  COLLAPSED_HEIGHT_PX,
  ControlledActionSheet,
} from "~/components/ControlledActionSheet";
import { GalleryModalContent, GalleryItem } from "./GalleryModalContent";

export type FilmstripSlot = { url: string; left: number };

interface GalleryModalMobileProps {
  filmstripRef: (el: HTMLDivElement) => void;
  filmstripSlots: Accessor<FilmstripSlot[]>;
  filmstripAnimate: Accessor<boolean>;
  filmstripTranslate: Accessor<number>;
  transitioned: Accessor<boolean>;
  localImageUrl: Accessor<string>;
  item: Accessor<GalleryItem | null>;
  indexOf: (url: string) => number;
  itemAt: (url: string) => GalleryItem | null;
  isSlotExpanded: (url: string) => Accessor<boolean>;
  setSlotExpanded: (url: string) => (expanded: boolean) => void;
  onSlotImageClick: (url: string) => void;
  onSwipeStart: (x: number, y: number) => void;
  onSwipeMove: (x: number, y: number) => void;
  onSwipeEnd: (x: number) => void;
  onSwipeMouseDown: (event: MouseEvent) => void;
}

const FilmstripLayer: Component<{
  slots: Accessor<FilmstripSlot[]>;
  animate: Accessor<boolean>;
  translate: Accessor<number>;
  containerRef?: (el: HTMLDivElement) => void;
  class?: string;
  children: (slot: FilmstripSlot) => JSX.Element;
}> = (props) => (
  <div class={cx("absolute inset-0 overflow-hidden", props.class)}>
    <div
      ref={props.containerRef}
      class={cx(
        "absolute top-0 left-0 right-0 h-full",
        props.animate() ? "transition-transform" : "transition-none",
      )}
      style={{ transform: `translateX(${props.translate()}px)` }}
    >
      <For each={props.slots()}>
        {(slot) => (
          <div
            class="absolute top-0 h-full w-full"
            style={{ left: `${slot.left}px` }}
          >
            {props.children(slot)}
          </div>
        )}
      </For>
    </div>
  </div>
);

export const GalleryModalMobile: Component<GalleryModalMobileProps> = (
  props,
) => (
  <div
    class="relative h-full w-full"
    onClick={(e) => e.stopPropagation()}
    onTouchStart={(e) =>
      props.onSwipeStart(e.touches[0].clientX, e.touches[0].clientY)
    }
    onTouchMove={(e) =>
      props.onSwipeMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    onTouchEnd={(e) => props.onSwipeEnd(e.changedTouches[0].clientX)}
    onMouseDown={props.onSwipeMouseDown}
  >
    <FilmstripLayer
      slots={props.filmstripSlots}
      animate={props.filmstripAnimate}
      translate={props.filmstripTranslate}
      containerRef={props.filmstripRef}
    >
      {(slot) => {
        const isCurrent = () => slot.url === props.localImageUrl();
        return (
          <img
            src={slot.url}
            alt={isCurrent() ? (props.item()?.title ?? "") : ""}
            aria-hidden={!isCurrent() || undefined}
            draggable={false}
            class={cx(
              "absolute top-0 w-full cursor-pointer object-cover",
              isCurrent() && props.transitioned()
                ? "[view-transition-name:gallery-modal-image]"
                : "",
              isCurrent() && !props.transitioned()
                ? "opacity-0"
                : "opacity-100",
            )}
            style={{
              height: `calc(100vh - ${COLLAPSED_HEIGHT_PX}px + 1rem)`,
            }}
            onClick={() => props.onSlotImageClick(slot.url)}
          />
        );
      }}
    </FilmstripLayer>

    <FilmstripLayer
      slots={props.filmstripSlots}
      animate={props.filmstripAnimate}
      translate={props.filmstripTranslate}
      class="z-20"
    >
      {(slot) => {
        const slotItemIndex = createMemo(() => props.indexOf(slot.url));
        const slotItem = createMemo(() => props.itemAt(slot.url));
        return (
          <CmsPathContextProvider value={`items.${slotItemIndex()}`}>
            <ControlledActionSheet
              expanded={props.isSlotExpanded(slot.url)}
              onExpandedChange={props.setSlotExpanded(slot.url)}
            >
              <div class="flex flex-col">
                <GalleryModalContent item={slotItem} />
              </div>
            </ControlledActionSheet>
          </CmsPathContextProvider>
        );
      }}
    </FilmstripLayer>
  </div>
);
