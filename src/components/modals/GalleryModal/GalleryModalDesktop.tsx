import { Accessor, Component, Show } from "solid-js";
import { cx } from "cva";
import { CmsPathContextProvider } from "~/lib/cms/CmsPathContext";
import {
  GALLERY_MODAL_ASPECT_RATIO,
  GALLERY_MODAL_MAX_SIZE_PX,
  GALLERY_MODAL_PANEL_SPLIT_RATIO,
} from "~/lib/utils/galleryAnimations";
import { GalleryModalContent, GalleryItem } from "./GalleryModalContent";

interface GalleryModalDesktopProps {
  transitioned: Accessor<boolean>;
  cardReady: Accessor<boolean>;
  localImageUrl: Accessor<string>;
  item: Accessor<GalleryItem | null>;
  swipeX: Accessor<number>;
  swipeAnimate: Accessor<boolean>;
  outgoingUrl: Accessor<string | null>;
  outgoingItem: Accessor<GalleryItem | null>;
  outgoingItemIndex: Accessor<number>;
  outgoingX: Accessor<number>;
  outgoingAnimate: Accessor<boolean>;
}

export const GalleryModalDesktop: Component<GalleryModalDesktopProps> = (
  props,
) => (
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <Show when={props.outgoingUrl()}>
      <CmsPathContextProvider value={`items.${props.outgoingItemIndex()}`}>
        <div
          class={cx(
            "absolute top-1/2 left-1/2 aspect-(--gallery-modal-aspect-ratio) h-[min(85vh,calc(85vw/var(--gallery-modal-aspect-ratio)),calc(var(--gallery-modal-max-size)/var(--gallery-modal-aspect-ratio)))] flex flex-row overflow-hidden rounded-2xl bg-white shadow-base pointer-events-auto",
            props.outgoingAnimate()
              ? "transition-transform"
              : "transition-none",
          )}
          style={{
            transform: `translate(calc(-50% + ${props.outgoingX()}px), -50%)`,
            "--gallery-modal-max-size": `${GALLERY_MODAL_MAX_SIZE_PX}px`,
            "--gallery-modal-aspect-ratio": `${GALLERY_MODAL_ASPECT_RATIO}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            class="overflow-hidden"
            style={{ flex: `${GALLERY_MODAL_PANEL_SPLIT_RATIO} 1 0%` }}
          >
            <img
              src={props.outgoingUrl()!}
              alt={props.outgoingItem()?.title ?? ""}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="flex flex-1 flex-col overflow-y-auto">
            <GalleryModalContent item={props.outgoingItem} />
          </div>
        </div>
      </CmsPathContextProvider>
    </Show>
    <div
      class={cx(
        "absolute top-1/2 left-1/2 aspect-(--gallery-modal-aspect-ratio) h-[min(80vh,calc(80vw/var(--gallery-modal-aspect-ratio)),calc(var(--gallery-modal-max-size)/var(--gallery-modal-aspect-ratio)))] flex flex-row overflow-hidden rounded-2xl pointer-events-auto",
        props.cardReady()
          ? "bg-white shadow-base"
          : "bg-transparent shadow-none",
        props.swipeAnimate()
          ? "transition-[transform,background-color,box-shadow]"
          : "transition-[background-color,box-shadow]",
      )}
      style={{
        transform: `translate(calc(-50% + ${props.swipeX()}px), -50%)`,
        "--gallery-modal-max-size": `${GALLERY_MODAL_MAX_SIZE_PX}px`,
        "--gallery-modal-aspect-ratio": `${GALLERY_MODAL_ASPECT_RATIO}`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        class="overflow-hidden"
        style={{ flex: `${GALLERY_MODAL_PANEL_SPLIT_RATIO} 1 0%` }}
      >
        <img
          src={props.localImageUrl()}
          alt={props.item()?.title ?? ""}
          class={cx(
            "h-full w-full object-cover",
            props.transitioned()
              ? "opacity-100 [view-transition-name:gallery-modal-image]"
              : "opacity-0",
          )}
        />
      </div>
      <div class="flex-1 overflow-hidden">
        <div
          class={cx(
            "flex h-full flex-col overflow-y-auto",
            props.cardReady()
              ? "transition-transform translate-x-0"
              : "transition-none -translate-x-full",
          )}
        >
          <GalleryModalContent item={props.item} />
        </div>
      </div>
    </div>
  </div>
);
