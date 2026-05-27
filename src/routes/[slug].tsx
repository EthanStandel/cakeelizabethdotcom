import { useParams, createAsync, query } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Show, Suspense } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { PageShape } from "~/models";
import { createCmsLiveContent } from "~/primitives/createCmsLiveContent";
import { ModuleRegistry } from "~/modules/ModuleRegistry";
import { ContentFor } from "~/components/ContentFor";

const fetchPage = (slug: string) => getCollectionItem(PageShape, slug);
const getPage = import.meta.env.DEV ? fetchPage : query(fetchPage, "page");

export const route = {
  preload({ params }: { params: Record<string, string> }) {
    void getPage(params["slug"]!);
  },
};

const Page = () => {
  const params = useParams<{ slug: string }>();
  const page = createAsync(() => getPage(params.slug));
  const liveContent = createCmsLiveContent(PageShape, () => params.slug);

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
            <ContentFor each={p()} field="modules">
              {(module) => (
                <ModuleRegistry module={module.type} shape={module} />
              )}
            </ContentFor>
          </main>
        )}
      </Show>
    </Suspense>
  );
};

export default Page;
