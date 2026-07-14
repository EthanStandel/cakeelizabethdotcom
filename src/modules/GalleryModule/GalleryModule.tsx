import { Component, createMemo, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import { cx } from "cva";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";
import { GalleryModuleType } from "~/models/modules/GalleryModule.shape";
import { GalleryItemsShape } from "~/models/GalleryItems.shape";
import { TagsShape } from "~/models/Tags.shape";
import { getCollectionItem } from "~/lib/content";
import { createContentFetch } from "~/primitives/createContentFetch";
import { seededRandom } from "~/lib/utils/seededRandom";
import { compareDatesDescending } from "~/lib/utils/compareDatesDescending";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import {
  CmsPathContextProvider,
  CmsSourceContextProvider,
} from "~/lib/cms/CmsPathContext";
import {
  COLUMN_INDICES,
  createGalleryFilterAnimation,
  DESKTOP_COLS,
} from "./createGalleryFilterAnimation";
import { isModalTransitioning } from "~/components/modals/utils/createGalleryModalTransition";
import { createBreakpoint } from "~/lib/utils/createBreakpoint";
import "./GalleryModule.css";

const MOBILE_COLS = 2;

const MAX_RANDOM_HEIGHT = 0.5;
const seededAspectRatio = (imageUrl: string): string => {
  const heightToWidth =
    MAX_RANDOM_HEIGHT + seededRandom(imageUrl) * (1 - MAX_RANDOM_HEIGHT);
  return `1 / ${heightToWidth}`;
};

export const GalleryModule: Component<{ shape: GalleryModuleType }> = (
  props,
) => {
  const galleryData = createContentFetch(GalleryItemsShape.name, () =>
    getCollectionItem(GalleryItemsShape, "main"),
  );

  const galleryTagsData = createContentFetch(TagsShape.name, () =>
    getCollectionItem(TagsShape, "main"),
  );

  const { galleryFilterTag, getGalleryFilterTagHref } =
    createQueryParamRouting.galleryFilterTag.href();
  const { getModalHref } = createQueryParamRouting.modal.href();

  const allItems = createMemo(() => galleryData()?.items ?? []);
  const allTags = createMemo(() => galleryTagsData()?.tags ?? []);
  const dateSortedItems = createMemo(() =>
    allItems()
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .toSorted((a, b) => compareDatesDescending(a.date, b.date)),
  );

  const isMobile = createBreakpoint.IsMobileView();
  const activeColumns = () => (isMobile() ? MOBILE_COLS : DESKTOP_COLS);

  const { displayBuckets, leavingIndices, enteringIndices, containerRef } =
    createGalleryFilterAnimation(
      galleryFilterTag,
      dateSortedItems,
      activeColumns,
    );

  return (
    <section class="mt-12 @max-dsk:mt-10 page-container">
      <div class="content-container">
        <Content content={props.shape} property="heading" type="string">
          {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
        </Content>

        <Suspense>
          <Show when={allTags().length > 0}>
            <div class="flex flex-wrap gap-2 my-6">
              <A
                href={getGalleryFilterTagHref(null)}
                noScroll
                aria-selected={galleryFilterTag() === null}
                class="rounded-full px-4 py-1 text-sm border cursor-pointer border-border text-secondary-foreground hover:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:border-primary button-hover"
              >
                All
              </A>
              <ContentFor
                each={galleryTagsData()}
                field="tags"
                source={{ collection: TagsShape.name, slug: "main" }}
              >
                {(tag, _index, cmsProp) => (
                  <A
                    href={getGalleryFilterTagHref(tag)}
                    noScroll
                    aria-selected={galleryFilterTag() === tag}
                    {...cmsProp()}
                    class="rounded-full px-4 py-1 text-sm border cursor-pointer border-border text-secondary-foreground hover:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:border-primary button-hover"
                  >
                    {tag}
                  </A>
                )}
              </ContentFor>
            </div>
          </Show>

          <ul
            ref={containerRef}
            style={{
              "--mobile-cols": MOBILE_COLS,
              "--desktop-cols": DESKTOP_COLS,
            }}
            class="grid gap-4 items-start grid-cols-[repeat(var(--desktop-cols),minmax(0,1fr))] @max-dsk:grid-cols-[repeat(var(--mobile-cols),minmax(0,1fr))]"
          >
            <For each={COLUMN_INDICES}>
              {(colIndex) => {
                const colIndices = () => displayBuckets()[colIndex] ?? [];
                return (
                  <li
                    class={
                      colIndex >= MOBILE_COLS
                        ? "flex flex-col @max-dsk:hidden"
                        : "flex flex-col"
                    }
                  >
                    <For each={colIndices()}>
                      {(originalIndex) => {
                        const item = () => allItems()[originalIndex];
                        const isLeaving = () =>
                          leavingIndices().has(originalIndex);
                        const isEntering = () =>
                          enteringIndices().has(originalIndex);
                        return (
                          <div
                            class={cx(
                              "grid overflow-hidden rounded-2xl transition-[grid-template-rows,margin-bottom] last:mb-0",
                              isLeaving() || isEntering()
                                ? "grid-rows-[0fr] mb-0"
                                : "grid-rows-[1fr] mb-4",
                            )}
                          >
                            <CmsSourceContextProvider
                              collection={GalleryItemsShape.name}
                              slug="main"
                            >
                              <CmsPathContextProvider
                                value={`items.${originalIndex}`}
                              >
                                <A
                                  href={getModalHref({
                                    type: "gallery",
                                    payload: { imageUrl: item().image ?? "" },
                                  })}
                                  noScroll
                                  class="block button-hover rounded-2xl overflow-hidden min-h-0"
                                  style={{
                                    "aspect-ratio": seededAspectRatio(
                                      item().image ?? "",
                                    ),
                                    "view-transition-name":
                                      isEntering() || isModalTransitioning()
                                        ? "none"
                                        : `gallery-item-${originalIndex}`,
                                  }}
                                >
                                  <Content
                                    content={item()}
                                    property="image"
                                    type="string"
                                  >
                                    {(_, cmsProp) => (
                                      <img
                                        src={item().image ?? ""}
                                        alt={item().title ?? ""}
                                        class="w-full h-full object-cover"
                                        {...cmsProp()}
                                      />
                                    )}
                                  </Content>
                                </A>
                              </CmsPathContextProvider>
                            </CmsSourceContextProvider>
                          </div>
                        );
                      }}
                    </For>
                  </li>
                );
              }}
            </For>
          </ul>
        </Suspense>
      </div>
    </section>
  );
};
