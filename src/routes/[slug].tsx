import { useParams, createAsync, query } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Show, Suspense } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { pagesCollection } from "~/models";
import { createCmsLiveContent } from "~/primitives/createCmsLiveContent";
import { Content } from "~/components/Content";

const getPage = query(
  (slug: string) => getCollectionItem(pagesCollection, slug),
  "page"
);

export const route = {
  preload({ params }: { params: Record<string, string> }) {
    void getPage(params["slug"]!);
  },
};

export default function Page() {
  const params = useParams<{ slug: string }>();
  const page = createAsync(() => getPage(params.slug));
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
            <Content content={p()} property="title" type="string">
              {(span, field) => <h1 data-cms-field={field}>{span}</h1>}
            </Content>
            <Content content={p()} property="content" type="markdown" />
          </main>
        )}
      </Show>
    </Suspense>
  );
}
