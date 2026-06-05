import { Component, createMemo, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";
import { GalleryModuleType } from "~/models/modules/GalleryModule.shape";
import { GalleryItemsShape } from "~/models/GalleryItems.shape";
import { TagsShape } from "~/models/Tags.shape";
import { getCollectionItem } from "~/lib/content";
import { createContentFetch } from "~/primitives/createContentFetch";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";

const MAX_ITEMS = 12;

export const GalleryModule: Component<{ shape: GalleryModuleType }> = (
  props
) => {
  const galleryData = createContentFetch(GalleryItemsShape.name, () =>
    getCollectionItem(GalleryItemsShape, "main")
  );

  const galleryTagsData = createContentFetch(TagsShape.name, () =>
    getCollectionItem(TagsShape, "main")
  );

  const { galleryFilterTag, getGalleryFilterTagHref } = createQueryParamRouting.galleryFilterTag.href();
  const { getModalHref } = createQueryParamRouting.modal.href();

  const allItems = createMemo(() => galleryData()?.items ?? []);

  const allTags = createMemo(() => galleryTagsData()?.tags ?? []);

  const visibleItemIndices = createMemo(() => {
    const tag = galleryFilterTag();
    const items = allItems();
    const matching = tag
      ? items.flatMap((item, i) => ((item.tags ?? []).includes(tag) ? [i] : []))
      : items.map((_, i) => i);
    return new Set(matching.slice(0, MAX_ITEMS));
  });

  return (
    <section class="px-min-mbl-padding @dsk:px-min-dsk-padding py-8">
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
              class="rounded-full px-4 py-1 text-sm border transition-colors cursor-pointer border-border text-secondary-foreground hover:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:border-primary"
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
                  class="rounded-full px-4 py-1 text-sm border transition-colors cursor-pointer border-border text-secondary-foreground hover:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:border-primary"
                >
                  {tag}
                </A>
              )}
            </ContentFor>
          </div>
        </Show>

        <div class="columns-2 @dsk:columns-4 gap-4">
          <ContentFor
            each={galleryData()}
            field="items"
            source={{ collection: GalleryItemsShape.name, slug: "main" }}
          >
            {(item, index) => (
              <Show when={visibleItemIndices().has(index())}>
                <div class="break-inside-avoid mb-4">
                  <A
                    href={getModalHref({
                      type: "gallery",
                      payload: { imageUrl: item.image ?? "" },
                    })}
                    noScroll
                    class="block"
                  >
                    <Content content={item} property="image" type="string">
                      {(_, cmsProp) => (
                        <img
                          src={item.image ?? ""}
                          alt={item.title ?? ""}
                          class="w-full rounded-lg"
                          {...cmsProp()}
                        />
                      )}
                    </Content>
                  </A>
                </div>
              </Show>
            )}
          </ContentFor>
        </div>
      </Suspense>
    </section>
  );
};
