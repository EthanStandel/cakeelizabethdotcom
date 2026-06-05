import {
  Component,
  createEffect,
  createMemo,
  For,
  onCleanup,
  Show,
} from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { ChevronLeft, ChevronRight, Mail, Share2, X } from "lucide-solid";
import { GalleryItemsShape } from "~/models/GalleryItems.shape";
import { getCollectionItem } from "~/lib/content";
import { createContentFetch } from "~/primitives/createContentFetch";
import { Content } from "~/components/Content";
import {
  CmsPathContextProvider,
  CmsSourceContextProvider,
} from "~/lib/cms/CmsPathContext";
import { createGalleryModalTransition } from "./utils/createGalleryModalTransition";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";

export const GalleryModal: Component<{ imageUrl: string }> = (props) => {
  const [transitioned, handleClose] = createGalleryModalTransition(
    props.imageUrl
  );
  const { getModalHref } = createQueryParamRouting.modal.href();

  const galleryData = createContentFetch("gallery-items", () =>
    getCollectionItem(GalleryItemsShape, "main")
  );

  const { galleryFilterTag } = createQueryParamRouting.galleryFilterTag.href();

  const allItems = createMemo(() => galleryData()?.items ?? []);

  const filteredItems = createMemo(() => {
    const tag = galleryFilterTag();
    const all = allItems();
    return tag ? all.filter((i) => (i.tags ?? []).includes(tag)) : all;
  });

  // Index in the full list — drives the CMS edit path
  const itemIndex = createMemo(() =>
    allItems().findIndex((i) => i.image === props.imageUrl)
  );

  // Index in the filtered list — drives prev/next navigation
  const filteredItemIndex = createMemo(() =>
    filteredItems().findIndex((i) => i.image === props.imageUrl)
  );

  const item = createMemo(() => {
    const idx = itemIndex();
    if (idx < 0) return null;
    return allItems()[idx] ?? null;
  });

  const prevHref = createMemo(() => {
    const idx = filteredItemIndex();
    if (idx <= 0) return null;
    const prevImg = filteredItems()[idx - 1]?.image ?? "";
    return getModalHref({ type: "gallery", payload: { imageUrl: prevImg } });
  });

  const nextHref = createMemo(() => {
    const idx = filteredItemIndex();
    if (idx < 0 || idx >= filteredItems().length - 1) return null;
    const nextImg = filteredItems()[idx + 1]?.image ?? "";
    return getModalHref({ type: "gallery", payload: { imageUrl: nextImg } });
  });

  createEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = "hidden";
    onCleanup(() => {
      document.documentElement.style.overflow = "";
    });
  });

  const navigate = useNavigate();

  const handleShare = () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    navigator.share({
      title: item()?.title ?? "Cake Elizabeth",
      text: item()?.description ?? undefined,
      url: window.location.href,
    });
  };

  createEffect(() => {
    if (typeof window === "undefined") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && prevHref())
        navigate(prevHref()!, { scroll: false });
      if (e.key === "ArrowRight" && nextHref())
        navigate(nextHref()!, { scroll: false });
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
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
            aria-label="Close"
            class="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <X size={18} />
          </button>

          <Show when={prevHref()}>
            {(href) => (
              <A
                href={href()}
                noScroll
                aria-label="Previous image"
                class="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <ChevronLeft size={20} stroke-width={2.5} />
              </A>
            )}
          </Show>

          <Show when={nextHref()}>
            {(href) => (
              <A
                href={href()}
                noScroll
                aria-label="Next image"
                class="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <ChevronRight size={20} stroke-width={2.5} />
              </A>
            )}
          </Show>

          <div
            class="mx-20 flex max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-base"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="w-[55%] shrink-0">
              <img
                src={props.imageUrl}
                alt={item()?.title ?? ""}
                class="h-full w-full object-cover"
                style={{
                  "view-transition-name": transitioned()
                    ? "gallery-modal-image"
                    : undefined,
                  opacity: transitioned() ? "1" : "0",
                }}
              />
            </div>

            <div class="flex flex-1 flex-col overflow-y-auto">
              <div class="px-6 pb-4 pt-6">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground">
                    <span class="text-xs font-bold tracking-wider text-white">
                      CE
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold leading-tight text-primary-foreground">
                      Cake Elizabeth
                    </p>
                    <p class="text-xs leading-tight text-secondary-foreground">
                      Maine · Summer 2025
                    </p>
                  </div>
                </div>
                <hr class="mt-4 border-border" />
              </div>

              <div class="flex-1 px-6">
                <Content
                  content={item() ?? undefined}
                  property="title"
                  type="string"
                >
                  {(title, cmsProp) => (
                    <>
                      <h2
                        class="mb-0 mt-0 font-serif text-2xl italic leading-tight text-primary-foreground"
                        {...cmsProp()}
                      >
                        {title()}
                      </h2>
                      <div class="mt-3 h-0.5 w-8 bg-primary" />
                    </>
                  )}
                </Content>
                <Content
                  content={item() ?? undefined}
                  property="description"
                  type="string"
                >
                  {(description, cmsProp) => (
                    <p
                      class="mt-4 text-sm leading-relaxed text-secondary-foreground"
                      {...cmsProp()}
                    >
                      {description()}
                    </p>
                  )}
                </Content>
              </div>

              <div class="px-6 pb-6 pt-4">
                <Content
                  content={item() ?? undefined}
                  property="tags"
                  type="string"
                >
                  {(_, cmsProp) => (
                    <div
                      class="mb-4 flex items-center justify-between"
                      {...cmsProp()}
                    >
                      <div class="flex items-center gap-3 text-secondary-foreground">
                        <button
                          aria-label="Share"
                          class="cursor-pointer transition-colors hover:text-primary-foreground"
                          onClick={handleShare}
                        >
                          <Share2 size={20} stroke-width={1.5} />
                        </button>
                      </div>
                      <div class="flex flex-wrap justify-end gap-1.5">
                        <For each={item()?.tags ?? []}>
                          {(tag) => (
                            <span class="rounded border border-primary px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                              {tag}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </Content>

                <a
                  href="/about"
                  class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Mail size={16} />
                  Inquire About a Similar Cake
                </a>
              </div>
            </div>
          </div>
        </div>
      </CmsPathContextProvider>
    </CmsSourceContextProvider>
  );
};
