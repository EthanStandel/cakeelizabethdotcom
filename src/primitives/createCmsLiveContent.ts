import { createSignal, onMount, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import type { ContentItem } from "~/lib/content";

interface CmsPreviewMessage {
  type: "cms-preview-update";
  slug: string;
  data: Record<string, unknown>;
}

export function createCmsLiveContent<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  slug: Accessor<string>
): Accessor<ContentItem<F> | undefined> {
  const [liveContent, setLiveContent] = createSignal<
    ContentItem<F> | undefined
  >(undefined);

  onMount(() => {
    const handler = (event: MessageEvent<CmsPreviewMessage>) => {
      if (event.data?.type !== "cms-preview-update") return;
      if (event.data.slug !== slug()) return;
      const parsed = collection.schema.safeParse(event.data.data);
      if (parsed.success) {
        setLiveContent({ ...parsed.data, _slug: event.data.slug } as any);
      }
    };
    window.addEventListener("message", handler);
    onCleanup(() => window.removeEventListener("message", handler));
  });

  return liveContent;
}
