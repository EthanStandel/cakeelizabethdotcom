import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Show, Suspense } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { PageShape, ConstantsShape } from "~/models";
import {
  contentQuery,
  createCmsContent,
} from "~/primitives/createContentFetch";
import { ModuleRegistry } from "~/modules/ModuleRegistry";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { useConstants } from "~/primitives/ConstantsContext";

const fetchPage = (slug: string) => getCollectionItem(PageShape, slug);
const getPage = contentQuery("page", fetchPage);

export const route = {
  preload({ params }: { params: Record<string, string> }) {
    void getPage(params["slug"]!);
  },
};

const Page = () => {
  const params = useParams<{ slug: string }>();
  const content = createCmsContent(PageShape, fetchPage, () => params.slug);
  const constants = useConstants();

  return (
    <Suspense>
      <Show
        when={content()}
        fallback={
          <>
            <Title>{constants()?.notFoundTitle ?? "Not Found"}</Title>
            <HttpStatusCode code={404} />
            <CmsSourceContextProvider
              collection={ConstantsShape.name}
              slug="main"
            >
              <main>
                <h1>
                  <Content
                    content={constants()}
                    property="notFoundHeading"
                    type="string"
                  />
                </h1>
              </main>
            </CmsSourceContextProvider>
          </>
        }
      >
        {(p) => (
          <main>
            <Title>{p().title}</Title>
            <CmsSourceContextProvider
              collection={PageShape.name}
              slug={params.slug}
            >
              <ContentFor each={p()} field="modules">
                {(module) => (
                  <ModuleRegistry module={module.type} shape={module} />
                )}
              </ContentFor>
            </CmsSourceContextProvider>
          </main>
        )}
      </Show>
    </Suspense>
  );
};

export default Page;
