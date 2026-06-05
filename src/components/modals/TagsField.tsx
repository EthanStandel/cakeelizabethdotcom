import { Component, For } from "solid-js";
import { Content } from "~/components/Content";
import type { GalleryItemsType } from "~/models/GalleryItems.shape";

type GalleryItem = NonNullable<GalleryItemsType["items"]>[number];

export const TagsField: Component<{ item: () => GalleryItem | null }> = (
  props
) => (
  <Content content={props.item() ?? undefined} property="tags" type="string">
    {(_, cmsProp) => (
      <div class="flex flex-wrap gap-2 mt-4" {...cmsProp()}>
        <For each={props.item()?.tags ?? []}>
          {(tag) => (
            <span class="rounded-full border border-border px-3 py-1 text-sm text-secondary-foreground">
              {tag}
            </span>
          )}
        </For>
      </div>
    )}
  </Content>
);
