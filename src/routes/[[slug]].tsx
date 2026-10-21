import { Navigate, useLocation, useParams } from "@solidjs/router";
import { Component, Match, Show, Suspense, Switch } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { PageShape } from "~/models";
import {
  HOME_PAGE_PATH,
  HOME_PAGE_SLUG,
  getPagePath,
} from "~/models/Page.shape";
import { NOT_FOUND_PAGE_SLUG } from "~/models/NotFound.shape";
import {
  contentQuery,
  createCmsContent,
} from "~/primitives/createContentFetch";
import { ModuleRegistry } from "~/modules/ModuleRegistry";
import { ContentFor } from "~/components/ContentFor";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { NotFound, preloadNotFound } from "~/components/NotFound";
import { SeoMarkup } from "~/components/seo/SeoMarkup";
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
    if (params["slug"] === NOT_FOUND_PAGE_SLUG) return preloadNotFound();
    void getPage(params["slug"] ?? HOME_PAGE_SLUG);
    preloadUniversalSuffixModule();
  },
};

const PageContent: Component<{ slug: string }> = (props) => {
  const content = createCmsContent(PageShape, fetchPage, () => props.slug);

  return (
    <Suspense>
      <Show when={content()} fallback={<NotFound />}>
        {(p) => (
          <main class="pb-module-dsk-gap @max-dsk:pb-module-mbl-gap has-[>:last-child>[data-rule-above]]:pb-0 *:last:*:data-rule-above:mb-0">
            <SeoMarkup
              title={p().title}
              seo={p().seo}
              path={getPagePath(props.slug)}
            />
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
      <Switch fallback={<PageContent slug={params.slug ?? HOME_PAGE_SLUG} />}>
        <Match when={params.slug === HOME_PAGE_SLUG}>
          <Navigate href={`${HOME_PAGE_PATH}${location.search}`} />
        </Match>
        <Match when={params.slug === NOT_FOUND_PAGE_SLUG}>
          <NotFound />
        </Match>
      </Switch>
    </ModuleTransitionProvider>
  );
};

export default Page;
