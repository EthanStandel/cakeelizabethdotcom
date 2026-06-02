import { createSignal, onMount, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import type { ContentItem } from "~/lib/content";
import { createMessageHandler } from "~/lib/cms/messages";

export function createCmsLiveContent<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  slug: Accessor<string>
): Accessor<ContentItem<F> | undefined> {
  const [liveContent, setLiveContent] = createSignal<
    ContentItem<F> | undefined
  >(undefined);

  onMount(() => {
    const handler = createMessageHandler({
      "cms-preview-update": ({ slug: msgSlug, data }) => {
        if (msgSlug !== slug()) return;
        const parsed = collection.schema.safeParse(data);
        if (parsed.success) {
          setLiveContent({ ...parsed.data, _slug: msgSlug } as any);
        }
      },
    });
    window.addEventListener("message", handler);
    onCleanup(() => window.removeEventListener("message", handler));
  });

  return liveContent;
}
