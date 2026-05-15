import { useParams, createAsync } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Show, Suspense } from "solid-js";
import { marked } from "marked";
import { getCollectionItem } from "~/lib/content";
import { pagesCollection } from "~/models";
import { createCmsLiveContent } from "~/primitives/createCmsLiveContent";

export const route = {
  preload({ params }: { params: Record<string, string> }) {
    void getCollectionItem(pagesCollection, params["slug"]!);
  },
};

export default function Page() {
  const params = useParams<{ slug: string }>();
  const page = createAsync(() =>
    getCollectionItem(pagesCollection, params.slug)
  );
  const liveContent = createCmsLiveContent(pagesCollection, () => params.slug);

  const content = () => liveContent() ?? page();

  return (
    <Suspense>
      <Show
        when={content()}
        fallback={
          <>
            <Title>Not Found</Title>
            <HttpStatusCode code={404} />
            <main>
              <h1>Page Not Found</h1>
            </main>
          </>
        }
      >
        {(p) => (
          <main>
            <Title>{p().title}</Title>
            <h1>{p().title}</h1>
            <div innerHTML={marked(p().content ?? "") as string} />
          </main>
        )}
      </Show>
    </Suspense>
  );
}
