import { Navigate, useLocation, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Component, Show, Suspense } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { PageShape, ConstantsShape } from "~/models";
import { HOME_PAGE_PATH, HOME_PAGE_SLUG } from "~/models/Page.shape";
import {
  contentQuery,
  createCmsContent,
} from "~/primitives/createContentFetch";
import { ModuleRegistry } from "~/modules/ModuleRegistry";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { useConstants } from "~/primitives/ConstantsContext";
import {
  UniversalSuffixModules,
  preloadUniversalSuffixModule,
} from "~/components/UniversalSuffixModules";
import {
  ModuleTransition,
  ModuleTransitionProvider,
} from "~/components/ModuleTransition";

const fetchPage = (slug: string) => getCollectionItem(PageShape, slug);
const getPage = contentQuery("page", fetchPage);

export const route = {
  preload({ params }: { params: Record<string, string> }) {
    void getPage(params["slug"] ?? HOME_PAGE_SLUG);
    preloadUniversalSuffixModule();
  },
};

const PageContent: Component<{ slug: string }> = (props) => {
  const content = createCmsContent(PageShape, fetchPage, () => props.slug);
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
          <main class="pb-module-dsk-gap @max-dsk:pb-module-mbl-gap has-[>:last-child>[data-rule-above]]:pb-0 *:last:*:data-rule-above:mb-0">
            <Title>{p().title}</Title>
            <CmsSourceContextProvider
              collection={PageShape.name}
              slug={props.slug}
            >
              <ContentFor each={p()} field="modules">
                {(module, index) => (
                  <ModuleTransition index={index()}>
                    <ModuleRegistry module={module.type} shape={module} />
                  </ModuleTransition>
                )}
              </ContentFor>
            </CmsSourceContextProvider>
            <UniversalSuffixModules
              pageSlug={props.slug}
              transitionIndexOffset={p().modules?.length ?? 0}
            />
          </main>
        )}
      </Show>
    </Suspense>
  );
};

const Page = () => {
  const params = useParams<{ slug?: string }>();
  const location = useLocation();

  return (
    <ModuleTransitionProvider>
      <Show
        when={params.slug !== HOME_PAGE_SLUG}
        fallback={<Navigate href={`${HOME_PAGE_PATH}${location.search}`} />}
      >
        <PageContent slug={params.slug ?? HOME_PAGE_SLUG} />
      </Show>
    </ModuleTransitionProvider>
  );
};

export default Page;
